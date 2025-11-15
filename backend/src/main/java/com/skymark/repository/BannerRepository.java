package com.skymark.repository;

import com.skymark.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    /**
     * 获取所有启用的 banner，按排序顺序排列
     */
    @Query("SELECT b FROM Banner b WHERE b.enabled = true ORDER BY b.sortOrder ASC, b.id ASC")
    List<Banner> findAllEnabled();
}





