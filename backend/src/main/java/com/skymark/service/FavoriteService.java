package com.skymark.service;

import com.skymark.entity.Favorite;
import com.skymark.entity.Goods;
import com.skymark.repository.FavoriteRepository;
import com.skymark.repository.GoodsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {
    
    @Autowired
    private FavoriteRepository favoriteRepository;
    
    @Autowired
    private GoodsRepository goodsRepository;
    
    // 添加收藏
    @Transactional
    public Favorite addFavorite(Long userId, Long goodsId) {
        // 检查是否已收藏
        if (favoriteRepository.existsByUserIdAndGoodsId(userId, goodsId)) {
            throw new RuntimeException("该商品已收藏");
        }
        
        // 检查商品是否存在
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new RuntimeException("商品不存在"));
        
        // 创建收藏记录
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setGoodsId(goodsId);
        favorite = favoriteRepository.save(favorite);
        
        // 更新商品的收藏数
        goods.setLikes(goods.getLikes() + 1);
        goodsRepository.save(goods);
        
        return favorite;
    }
    
    // 取消收藏
    @Transactional
    public void removeFavorite(Long userId, Long goodsId) {
        // 检查收藏是否存在
        if (!favoriteRepository.existsByUserIdAndGoodsId(userId, goodsId)) {
            throw new RuntimeException("该商品未收藏");
        }
        
        // 删除收藏记录
        favoriteRepository.deleteByUserIdAndGoodsId(userId, goodsId);
        
        // 更新商品的收藏数
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new RuntimeException("商品不存在"));
        if (goods.getLikes() > 0) {
            goods.setLikes(goods.getLikes() - 1);
            goodsRepository.save(goods);
        }
    }
    
    // 检查是否已收藏
    public boolean isFavorite(Long userId, Long goodsId) {
        return favoriteRepository.existsByUserIdAndGoodsId(userId, goodsId);
    }
    
    // 获取用户的收藏列表
    public List<Goods> getFavoriteGoods(Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        List<Long> goodsIds = favorites.stream()
                .map(Favorite::getGoodsId)
                .collect(Collectors.toList());
        
        return goodsRepository.findAllById(goodsIds);
    }
    
    // 获取收藏数量
    public Long getFavoriteCount(Long userId) {
        return (long) favoriteRepository.findByUserId(userId).size();
    }
}





