package com.skymark.service;

import com.skymark.entity.Order;
import com.skymark.entity.Goods;
import com.skymark.repository.OrderRepository;
import com.skymark.repository.GoodsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private GoodsRepository goodsRepository;
    
    @Transactional
    public Order createOrder(Order order) {
        // 根据商品ID查询商品信息
        Goods goods = goodsRepository.findById(order.getGoodsId())
                .orElseThrow(() -> new RuntimeException("商品不存在"));
        
        // 检查商品状态
        if (!"onSale".equals(goods.getStatus())) {
            throw new RuntimeException("商品已下架或已售出");
        }
        
        // 填充订单信息
        order.setGoodsTitle(goods.getTitle());
        order.setSellerId(goods.getSellerId());
        order.setPrice(goods.getPrice());
        
        // 处理商品图片（取第一张）
        if (goods.getImages() != null && !goods.getImages().isEmpty()) {
            try {
                String imagesStr = goods.getImages();
                // 如果是JSON数组字符串，解析后取第一张
                if (imagesStr.startsWith("[")) {
                    // 移除方括号和引号，按逗号分割
                    imagesStr = imagesStr.replace("[", "").replace("]", "").trim();
                    if (imagesStr.startsWith("\"")) {
                        imagesStr = imagesStr.substring(1);
                    }
                    if (imagesStr.endsWith("\"")) {
                        imagesStr = imagesStr.substring(0, imagesStr.length() - 1);
                    }
                    // 如果有多个图片，取第一个（按逗号分割）
                    String[] imageArray = imagesStr.split(",");
                    if (imageArray.length > 0) {
                        String firstImage = imageArray[0].trim();
                        // 移除可能的引号
                        firstImage = firstImage.replace("\"", "").trim();
                        order.setGoodsImage(firstImage);
                    }
                } else {
                    // 如果不是JSON数组，直接使用
                    order.setGoodsImage(imagesStr);
                }
            } catch (Exception e) {
                // 如果解析失败，使用原始值
                order.setGoodsImage(goods.getImages());
            }
        }
        
        // 计算总价
        if (order.getPrice() != null && order.getQuantity() != null) {
            BigDecimal totalPrice = order.getPrice().multiply(new BigDecimal(order.getQuantity()));
            order.setTotalPrice(totalPrice);
        }
        
        // 生成订单号
        String orderNo = "ORD" + System.currentTimeMillis();
        order.setOrderNo(orderNo);
        order.setStatus("pending");
        
        // 将商品状态更新为已售出
        goods.setStatus("sold");
        goodsRepository.save(goods);
        
        return orderRepository.save(order);
    }
    
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
    }
    
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByBuyerId(userId);
    }
    
    public List<Order> getOrdersByStatus(Long userId, String status) {
        return orderRepository.findByBuyerIdAndStatus(userId, status);
    }
    
    public Order payOrder(Long id) {
        Order order = getOrderById(id);
        order.setStatus("paid");
        order.setPayTime(LocalDateTime.now());
        return orderRepository.save(order);
    }
    
    public Order cancelOrder(Long id) {
        Order order = getOrderById(id);
        order.setStatus("cancelled");
        return orderRepository.save(order);
    }
    
    public Order completeOrder(Long id) {
        Order order = getOrderById(id);
        order.setStatus("completed");
        order.setCompleteTime(LocalDateTime.now());
        return orderRepository.save(order);
    }
}





