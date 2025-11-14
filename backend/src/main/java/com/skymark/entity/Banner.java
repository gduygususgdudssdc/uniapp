package com.skymark.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "banners")
@Data
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    private String imageUrl; // 图片URL
    
    @Column(length = 200)
    private String title; // 标题（可选）
    
    @Column(length = 500)
    private String linkUrl; // 跳转链接（可选）
    
    @Column
    private Integer sortOrder = 0; // 排序顺序
    
    @Column
    private Boolean enabled = true; // 是否启用
    
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




