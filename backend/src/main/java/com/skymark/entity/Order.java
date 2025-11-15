package com.skymark.entity;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_no", unique = true, length = 50)
    private String orderNo;
    
    @Column(name = "goods_id")
    private Long goodsId;
    
    @Column(name = "goods_title", length = 200)
    private String goodsTitle;
    
    @Column(name = "goods_image", length = 500)
    private String goodsImage;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column
    private Integer quantity;
    
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(name = "buyer_id")
    private Long buyerId;
    
    @Column(name = "seller_id")
    private Long sellerId;
    
    @Column(length = 20)
    private String status; // pending, paid, shipped, completed, cancelled
    
    @Column(name = "create_time", updatable = false)
    private LocalDateTime createTime;
    
    @Column(name = "pay_time")
    private LocalDateTime payTime;
    
    @Column(name = "ship_time")
    private LocalDateTime shipTime;
    
    @Column(name = "complete_time")
    private LocalDateTime completeTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
    }
}









