package com.skymark.controller;

import com.skymark.common.ApiResponse;
import com.skymark.entity.Order;
import com.skymark.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping("/create")
    public ApiResponse<Order> createOrder(@RequestBody Order order) {
        try {
            Order createdOrder = orderService.createOrder(order);
            return ApiResponse.success(createdOrder);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ApiResponse<Order> getOrder(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            return ApiResponse.success(order);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/list/{userId}")
    public ApiResponse<List<Order>> getOrders(@PathVariable Long userId,
                                              @RequestParam(required = false) String status) {
        try {
            List<Order> orders;
            if (status != null && !status.isEmpty()) {
                orders = orderService.getOrdersByStatus(userId, status);
            } else {
                orders = orderService.getOrdersByUserId(userId);
            }
            return ApiResponse.success(orders);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/pay/{id}")
    public ApiResponse<Order> payOrder(@PathVariable Long id) {
        try {
            Order order = orderService.payOrder(id);
            return ApiResponse.success(order);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/cancel/{id}")
    public ApiResponse<Order> cancelOrder(@PathVariable Long id) {
        try {
            Order order = orderService.cancelOrder(id);
            return ApiResponse.success(order);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}








