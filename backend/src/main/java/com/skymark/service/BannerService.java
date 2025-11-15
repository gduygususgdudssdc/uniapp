package com.skymark.service;

import com.skymark.entity.Banner;
import com.skymark.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BannerService {
    
    @Autowired
    private BannerRepository bannerRepository;
    
    /**
     * 获取所有启用的 banner
     * @return banner 列表
     */
    public List<Banner> getEnabledBanners() {
        return bannerRepository.findAllEnabled();
    }
    
    /**
     * 获取所有 banner（包括禁用的）
     * @return banner 列表
     */
    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }
    
    /**
     * 根据ID获取 banner
     * @param id banner ID
     * @return banner 对象
     */
    public Banner getBannerById(Long id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner不存在"));
    }
    
    /**
     * 创建 banner
     * @param banner banner 对象
     * @return 保存后的 banner
     */
    public Banner createBanner(Banner banner) {
        return bannerRepository.save(banner);
    }
    
    /**
     * 更新 banner
     * @param banner banner 对象
     * @return 更新后的 banner
     */
    public Banner updateBanner(Banner banner) {
        return bannerRepository.save(banner);
    }
    
    /**
     * 删除 banner
     * @param id banner ID
     */
    public void deleteBanner(Long id) {
        bannerRepository.deleteById(id);
    }
}





