package com.skymark.service;

import com.skymark.entity.Goods;
import com.skymark.repository.GoodsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GoodsService {
    
    @Autowired
    private GoodsRepository goodsRepository;
    
    public Page<Goods> getGoodsList(String status, Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            return goodsRepository.findByStatus(status, pageable);
        }
        return goodsRepository.findAll(pageable);
    }
    
    public Page<Goods> getGoodsByCategory(Long categoryId, Pageable pageable) {
        return goodsRepository.findByCategoryId(categoryId, pageable);
    }
    
    public Page<Goods> searchGoods(String keyword, String status, Pageable pageable) {
        if (status == null) {
            status = "onSale";
        }
        return goodsRepository.searchGoods(status, keyword, pageable);
    }
    
    public Goods getGoodsById(Long id) {
        return goodsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("商品不存在"));
    }
    
    public Goods createGoods(Goods goods) {
        return goodsRepository.save(goods);
    }
    
    public Goods updateGoods(Goods goods) {
        return goodsRepository.save(goods);
    }
    
    public void deleteGoods(Long id) {
        goodsRepository.deleteById(id);
    }
    
    public List<Goods> getMyGoods(Long sellerId) {
        return goodsRepository.findBySellerId(sellerId, Pageable.unpaged()).getContent();
    }
    
    public void incrementViews(Long id) {
        Goods goods = getGoodsById(id);
        goods.setViews(goods.getViews() + 1);
        goodsRepository.save(goods);
    }
}









