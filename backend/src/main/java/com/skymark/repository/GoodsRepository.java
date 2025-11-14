package com.skymark.repository;

import com.skymark.entity.Goods;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GoodsRepository extends JpaRepository<Goods, Long> {
    Page<Goods> findByStatus(String status, Pageable pageable);
    Page<Goods> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Goods> findBySellerId(Long sellerId, Pageable pageable);
    
    @Query("SELECT g FROM Goods g WHERE g.status = :status AND (g.title LIKE CONCAT('%', :keyword, '%') OR g.description LIKE CONCAT('%', :keyword, '%'))")
    Page<Goods> searchGoods(@Param("status") String status, @Param("keyword") String keyword, Pageable pageable);
    
    List<Goods> findByStatusOrderByCreateTimeDesc(String status);
}


