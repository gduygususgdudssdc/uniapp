package com.skymark.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "sender_id", nullable = false)
    private Long senderId; // 发送者ID
    
    @Column(name = "receiver_id", nullable = false)
    private Long receiverId; // 接收者ID
    
    @Column(nullable = false, length = 1000)
    private String content; // 消息内容
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false; // 是否已读
    
    @Column(name = "create_time", updatable = false)
    private LocalDateTime createTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
    }
}


