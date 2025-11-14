package com.skymark.controller;

import com.skymark.common.ApiResponse;
import com.skymark.entity.Favorite;
import com.skymark.entity.Goods;
import com.skymark.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/favorite")
public class FavoriteController {
    
    @Autowired
    private FavoriteService favoriteService;
    
    // 添加收藏
    @PostMapping("/add")
    public ApiResponse<Favorite> addFavorite(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long goodsId = request.get("goodsId");
            
            if (userId == null || goodsId == null) {
                return ApiResponse.error("用户ID和商品ID不能为空");
            }
            
            Favorite favorite = favoriteService.addFavorite(userId, goodsId);
            return ApiResponse.success(favorite);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    // 取消收藏
    @PostMapping("/remove")
    public ApiResponse<Void> removeFavorite(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long goodsId = request.get("goodsId");
            
            if (userId == null || goodsId == null) {
                return ApiResponse.error("用户ID和商品ID不能为空");
            }
            
            favoriteService.removeFavorite(userId, goodsId);
            return ApiResponse.success(null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    // 检查是否已收藏
    @GetMapping("/check")
    public ApiResponse<Boolean> checkFavorite(@RequestParam Long userId, @RequestParam Long goodsId) {
        try {
            boolean isFavorite = favoriteService.isFavorite(userId, goodsId);
            return ApiResponse.success(isFavorite);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    // 获取收藏列表
    @GetMapping("/list/{userId}")
    public ApiResponse<List<Goods>> getFavoriteList(@PathVariable Long userId) {
        try {
            List<Goods> goodsList = favoriteService.getFavoriteGoods(userId);
            return ApiResponse.success(goodsList);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    // 获取收藏数量
    @GetMapping("/count/{userId}")
    public ApiResponse<Long> getFavoriteCount(@PathVariable Long userId) {
        try {
            Long count = favoriteService.getFavoriteCount(userId);
            return ApiResponse.success(count);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}




