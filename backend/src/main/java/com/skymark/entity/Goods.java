package com.skymark.entity;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "goods")
@Data
public class Goods {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Column(columnDefinition = "TEXT")
    private String images; // JSON数组字符串
    
    @Column(name = "category_id")
    private Long categoryId;
    
    @Column(name = "category_name", length = 50)
    private String categoryName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "seller_id")
    private Long sellerId;
    
    @Column(length = 200)
    private String location;
    
    @Column(name = "`condition`", length = 20)
    private String condition;
    
    @Column
    private Integer views = 0;
    
    @Column
    private Integer likes = 0;
    
    @Column(length = 20)
    private String status = "onSale"; // onSale, sold, offShelf
    
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


