package com.skymark.service;

import com.skymark.entity.Message;
import com.skymark.entity.User;
import com.skymark.repository.MessageRepository;
import com.skymark.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 发送消息
     */
    @Transactional
    public Message sendMessage(Message message) {
        // 验证发送者和接收者是否存在
        if (!userRepository.existsById(message.getSenderId())) {
            throw new RuntimeException("发送者不存在");
        }
        if (!userRepository.existsById(message.getReceiverId())) {
            throw new RuntimeException("接收者不存在");
        }
        
        message.setIsRead(false);
        return messageRepository.save(message);
    }
    
    /**
     * 获取两个用户之间的聊天记录
     */
    public List<Message> getChatMessages(Long userId1, Long userId2) {
        return messageRepository.findChatMessages(userId1, userId2);
    }
    
    /**
     * 获取某个用户的消息列表（显示所有对话）
     */
    public List<Map<String, Object>> getMessageList(Long userId) {
        // 获取该用户的所有消息
        List<Message> allMessages = messageRepository.findAllUserMessages(userId);
        
        // 使用Map来存储每个对话的最新消息和未读数
        Map<Long, Map<String, Object>> conversationMap = new HashMap<>();
        
        for (Message message : allMessages) {
            Long otherUserId = message.getSenderId().equals(userId) ? message.getReceiverId() : message.getSenderId();
            
            if (!conversationMap.containsKey(otherUserId)) {
                // 获取对方用户信息
                User otherUser = userRepository.findById(otherUserId).orElse(null);
                if (otherUser == null) continue;
                
                Map<String, Object> conversation = new HashMap<>();
                conversation.put("userId", otherUserId);
                conversation.put("username", otherUser.getUsername());
                conversation.put("avatar", otherUser.getAvatar());
                conversation.put("lastMessage", message.getContent());
                conversation.put("lastTime", message.getCreateTime());
                conversation.put("unreadCount", 0L);
                conversationMap.put(otherUserId, conversation);
            }
            
            Map<String, Object> conversation = conversationMap.get(otherUserId);
            // 更新最新消息（因为消息是按时间倒序排列的，第一条就是最新的）
            if (conversation.get("lastTime") == null || 
                message.getCreateTime().isAfter((java.time.LocalDateTime) conversation.get("lastTime"))) {
                conversation.put("lastMessage", message.getContent());
                conversation.put("lastTime", message.getCreateTime());
            }
            
            // 统计未读消息数（只统计对方发给我的未读消息）
            if (message.getReceiverId().equals(userId) && !message.getIsRead()) {
                Long unreadCount = (Long) conversation.get("unreadCount");
                conversation.put("unreadCount", unreadCount + 1);
            }
        }
        
        // 转换为列表并按时间排序
        return conversationMap.values().stream()
                .sorted((a, b) -> {
                    java.time.LocalDateTime timeA = (java.time.LocalDateTime) a.get("lastTime");
                    java.time.LocalDateTime timeB = (java.time.LocalDateTime) b.get("lastTime");
                    if (timeA == null && timeB == null) return 0;
                    if (timeA == null) return 1;
                    if (timeB == null) return -1;
                    return timeB.compareTo(timeA); // 降序排列
                })
                .collect(Collectors.toList());
    }
    
    /**
     * 标记消息为已读
     */
    @Transactional
    public void markMessagesAsRead(Long userId, Long senderId) {
        List<Message> unreadMessages = messageRepository.findByReceiverIdAndIsReadFalse(userId)
                .stream()
                .filter(m -> m.getSenderId().equals(senderId))
                .collect(Collectors.toList());
        
        for (Message message : unreadMessages) {
            message.setIsRead(true);
            messageRepository.save(message);
        }
    }
    
    /**
     * 获取未读消息数量
     */
    public Long getUnreadCount(Long userId) {
        return (long) messageRepository.findByReceiverIdAndIsReadFalse(userId).size();
    }
}


