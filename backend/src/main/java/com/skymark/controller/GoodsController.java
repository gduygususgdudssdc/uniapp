package com.skymark.controller;

import com.skymark.common.ApiResponse;
import com.skymark.entity.Goods;
import com.skymark.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/goods")
public class GoodsController {
    
    @Autowired
    private GoodsService goodsService;
    
    @GetMapping("/list")
    public ApiResponse<Page<Goods>> getGoodsList(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Goods> goodsPage;
            
            if (categoryId != null) {
                goodsPage = goodsService.getGoodsByCategory(categoryId, pageable);
            } else {
                goodsPage = goodsService.getGoodsList(status, pageable);
            }
            
            return ApiResponse.success(goodsPage);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ApiResponse<Page<Goods>> searchGoods(
            @RequestParam String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Goods> goodsPage = goodsService.searchGoods(keyword, status, pageable);
            return ApiResponse.success(goodsPage);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ApiResponse<Goods> getGoods(@PathVariable Long id) {
        try {
            Goods goods = goodsService.getGoodsById(id);
            // 增加浏览次数
            goodsService.incrementViews(id);
            return ApiResponse.success(goods);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/create")
    public ApiResponse<Goods> createGoods(@RequestBody Goods goods) {
        try {
            Goods createdGoods = goodsService.createGoods(goods);
            return ApiResponse.success(createdGoods);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ApiResponse<Goods> updateGoods(@PathVariable Long id, @RequestBody Goods goods) {
        try {
            goods.setId(id);
            Goods updatedGoods = goodsService.updateGoods(goods);
            return ApiResponse.success(updatedGoods);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteGoods(@PathVariable Long id) {
        try {
            goodsService.deleteGoods(id);
            return ApiResponse.success("删除成功");
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/my/{sellerId}")
    public ApiResponse<List<Goods>> getMyGoods(@PathVariable Long sellerId) {
        try {
            List<Goods> goodsList = goodsService.getMyGoods(sellerId);
            return ApiResponse.success(goodsList);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}








