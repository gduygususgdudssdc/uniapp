package com.skymark.controller;

import com.skymark.common.ApiResponse;
import com.skymark.entity.Message;
import com.skymark.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/message")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    /**
     * 发送消息
     */
    @PostMapping("/send")
    public ApiResponse<Message> sendMessage(@RequestBody Message message) {
        try {
            Message savedMessage = messageService.sendMessage(message);
            return ApiResponse.success(savedMessage);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 获取聊天记录
     */
    @GetMapping("/chat")
    public ApiResponse<List<Message>> getChatMessages(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        try {
            List<Message> messages = messageService.getChatMessages(userId1, userId2);
            return ApiResponse.success(messages);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 获取消息列表（所有对话）
     */
    @GetMapping("/list/{userId}")
    public ApiResponse<List<Map<String, Object>>> getMessageList(@PathVariable Long userId) {
        try {
            List<Map<String, Object>> messageList = messageService.getMessageList(userId);
            return ApiResponse.success(messageList);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 标记消息为已读
     */
    @PostMapping("/read")
    public ApiResponse<String> markAsRead(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long senderId = request.get("senderId");
            messageService.markMessagesAsRead(userId, senderId);
            return ApiResponse.success("标记成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 获取未读消息数量
     */
    @GetMapping("/unread/{userId}")
    public ApiResponse<Long> getUnreadCount(@PathVariable Long userId) {
        try {
            Long count = messageService.getUnreadCount(userId);
            return ApiResponse.success(count);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}


