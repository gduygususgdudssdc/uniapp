package com.skymark.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 50)
    private String username;
    
    @Column(nullable = false, unique = true, length = 20)
    private String phone;
    
    @Column(nullable = false, length = 255)
    private String password;
    
    @Column(length = 100)
    private String email;
    
    @Column(length = 500)
    private String avatar;
    
    @Column(length = 100, unique = true)
    private String openid; // 微信 openid
    
    @Column(length = 200)
    private String address;
    
    @Column(length = 10)
    private String level = "V1";
    
    @Column
    private Integer score = 0;
    
    @Column(name = "create_time", updatable = false)
    private LocalDateTime createTime;
    
    @Column(name = "update_time")
    private LocalDateTime updateTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updateTime = LocalDateTime.now();
    }
}





