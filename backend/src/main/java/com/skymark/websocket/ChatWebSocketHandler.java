package com.skymark.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.skymark.dto.MessageDTO;
import com.skymark.entity.Message;
import com.skymark.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    
    @Autowired
    private MessageService messageService;
    
    // 配置 ObjectMapper 支持 Java 8 时间类型
    private final ObjectMapper objectMapper;
    
    public ChatWebSocketHandler() {
        this.objectMapper = new ObjectMapper();
        // 注册 Java 8 时间模块
        this.objectMapper.registerModule(new JavaTimeModule());
        // 禁用将日期写为时间戳
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }
    
    // 存储用户会话：userId -> WebSocketSession
    private final Map<Long, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("=== WebSocket 连接建立 ===");
        System.out.println("URI: " + (session.getUri() != null ? session.getUri().toString() : "null"));
        System.out.println("Remote Address: " + session.getRemoteAddress());
        
        // 从请求参数或请求头获取用户ID
        String userIdStr = null;
        
        // 尝试从查询参数获取
        if (session.getUri() != null && session.getUri().getQuery() != null) {
            String query = session.getUri().getQuery();
            System.out.println("查询参数: " + query);
            if (query.contains("userId=")) {
                userIdStr = query.substring(query.indexOf("userId=") + 7);
                if (userIdStr.contains("&")) {
                    userIdStr = userIdStr.substring(0, userIdStr.indexOf("&"));
                }
            }
        }
        
        // 如果查询参数没有，尝试从请求头获取
        if (userIdStr == null && session.getHandshakeHeaders() != null) {
            userIdStr = session.getHandshakeHeaders().getFirst("userId");
            System.out.println("请求头中的 userId: " + userIdStr);
        }
        
        if (userIdStr != null && !userIdStr.isEmpty()) {
            try {
                Long userId = Long.parseLong(userIdStr);
                
                // 如果用户已经连接，先关闭旧连接
                WebSocketSession oldSession = userSessions.get(userId);
                if (oldSession != null && oldSession.isOpen()) {
                    System.out.println("⚠ 用户 " + userId + " 已有连接，关闭旧连接");
                    try {
                        oldSession.close();
                    } catch (IOException e) {
                        System.err.println("关闭旧连接失败: " + e.getMessage());
                    }
                }
                
                // 存储新会话
                userSessions.put(userId, session);
                // 将用户ID存储到session属性中
                session.getAttributes().put("userId", userId);
                System.out.println("✓ 用户 " + userId + " 已成功连接 WebSocket");
                System.out.println("当前在线用户: " + userSessions.keySet());
                System.out.println("当前在线用户数: " + userSessions.size());
            } catch (NumberFormatException e) {
                System.err.println("✗ 无效的用户ID: " + userIdStr);
                session.close();
            }
        } else {
            System.err.println("✗ 未找到用户ID，连接将被关闭");
            System.err.println("URI: " + (session.getUri() != null ? session.getUri().toString() : "null"));
            session.close();
        }
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("=== 收到 WebSocket 文本消息 ===");
        System.out.println("原始消息: " + message.getPayload());
        System.out.println("会话用户ID: " + session.getAttributes().get("userId"));
        
        try {
            // 解析消息
            MessageDTO messageDTO = objectMapper.readValue(message.getPayload(), MessageDTO.class);
            System.out.println("解析后的消息类型: " + messageDTO.getType());
            
            // 处理不同类型的消息
            switch (messageDTO.getType()) {
                case "SEND":
                    handleSendMessage(messageDTO);
                    break;
                case "READ":
                    handleMarkAsRead(messageDTO);
                    break;
                default:
                    System.out.println("未知消息类型: " + messageDTO.getType());
            }
        } catch (Exception e) {
            System.err.println("✗ 处理消息失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * 处理发送消息
     */
    private void handleSendMessage(MessageDTO messageDTO) {
        System.out.println("=== 处理发送消息 ===");
        System.out.println("发送者ID: " + messageDTO.getSenderId());
        System.out.println("接收者ID: " + messageDTO.getReceiverId());
        System.out.println("消息内容: " + messageDTO.getContent());
        
        try {
            // 保存消息到数据库
            Message message = new Message();
            message.setSenderId(messageDTO.getSenderId());
            message.setReceiverId(messageDTO.getReceiverId());
            message.setContent(messageDTO.getContent());
            
            System.out.println("保存消息到数据库...");
            Message savedMessage = messageService.sendMessage(message);
            System.out.println("✓ 消息已保存，ID: " + savedMessage.getId());
            
            // 转换为 DTO
            MessageDTO responseDTO = new MessageDTO();
            responseDTO.setId(savedMessage.getId());
            responseDTO.setSenderId(savedMessage.getSenderId());
            responseDTO.setReceiverId(savedMessage.getReceiverId());
            responseDTO.setContent(savedMessage.getContent());
            responseDTO.setIsRead(savedMessage.getIsRead());
            responseDTO.setCreateTime(savedMessage.getCreateTime());
            responseDTO.setType("MESSAGE");
            
            System.out.println("准备推送消息给发送者和接收者...");
            
            // 发送给发送者（确认）
            System.out.println("1. 发送给发送者 (ID: " + savedMessage.getSenderId() + ")");
            sendToUser(savedMessage.getSenderId(), responseDTO);
            
            // 发送给接收者
            System.out.println("2. 发送给接收者 (ID: " + savedMessage.getReceiverId() + ")");
            sendToUser(savedMessage.getReceiverId(), responseDTO);
            
            System.out.println("✓ 消息处理完成");
            
        } catch (Exception e) {
            System.err.println("✗ 发送消息失败: " + e.getMessage());
            e.printStackTrace();
            // 发送错误消息给发送者
            MessageDTO errorDTO = new MessageDTO();
            errorDTO.setType("ERROR");
            errorDTO.setContent("发送消息失败: " + e.getMessage());
            sendToUser(messageDTO.getSenderId(), errorDTO);
        }
    }
    
    /**
     * 处理标记已读
     */
    private void handleMarkAsRead(MessageDTO messageDTO) {
        try {
            messageService.markMessagesAsRead(messageDTO.getReceiverId(), messageDTO.getSenderId());
            
            // 通知发送者消息已被读取
            MessageDTO readDTO = new MessageDTO();
            readDTO.setType("READ");
            readDTO.setSenderId(messageDTO.getSenderId());
            readDTO.setReceiverId(messageDTO.getReceiverId());
            sendToUser(messageDTO.getSenderId(), readDTO);
        } catch (Exception e) {
            System.err.println("标记已读失败: " + e.getMessage());
        }
    }
    
    /**
     * 发送消息给指定用户
     */
    private void sendToUser(Long userId, MessageDTO messageDTO) {
        WebSocketSession session = userSessions.get(userId);
        System.out.println("=== 尝试发送消息给用户 " + userId + " ===");
        System.out.println("会话是否存在: " + (session != null));
        
        if (session != null) {
            System.out.println("会话是否打开: " + session.isOpen());
            System.out.println("消息内容: " + messageDTO.getContent());
            System.out.println("消息类型: " + messageDTO.getType());
            
            if (session.isOpen()) {
                try {
                    String json = objectMapper.writeValueAsString(messageDTO);
                    System.out.println("发送 JSON: " + json);
                    session.sendMessage(new TextMessage(json));
                    System.out.println("✓ 消息已成功发送给用户 " + userId);
                } catch (IOException e) {
                    System.err.println("✗ 发送消息给用户 " + userId + " 失败: " + e.getMessage());
                    e.printStackTrace();
                    // 移除失效的会话
                    userSessions.remove(userId);
                }
            } else {
                System.err.println("✗ 用户 " + userId + " 的会话已关闭");
            }
        } else {
            System.err.println("✗ 用户 " + userId + " 不在线，无法发送消息");
            System.out.println("当前在线用户: " + userSessions.keySet());
        }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 移除会话
        Long userId = (Long) session.getAttributes().get("userId");
        if (userId != null) {
            userSessions.remove(userId);
            System.out.println("✓ 用户 " + userId + " 的 WebSocket 连接已关闭");
        } else {
            userSessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
            System.out.println("WebSocket 连接已关闭（未找到用户ID）");
        }
        System.out.println("当前在线用户: " + userSessions.keySet());
        System.out.println("当前在线用户数: " + userSessions.size());
    }
}

