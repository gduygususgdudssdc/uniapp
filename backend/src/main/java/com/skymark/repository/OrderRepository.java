package com.skymark.repository;

import com.skymark.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findBySellerId(Long sellerId);
    List<Order> findByBuyerIdAndStatus(Long buyerId, String status);
    List<Order> findBySellerIdAndStatus(Long sellerId, String status);
    Order findByOrderNo(String orderNo);
}









