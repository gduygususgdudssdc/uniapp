package com.skymark.controller;

import com.skymark.common.ApiResponse;
import com.skymark.entity.Banner;
import com.skymark.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/banner")
public class BannerController {
    
    @Autowired
    private BannerService bannerService;
    
    /**
     * 获取所有启用的 banner（前端使用）
     */
    @GetMapping("/list")
    public ApiResponse<List<Banner>> getBannerList() {
        try {
            List<Banner> banners = bannerService.getEnabledBanners();
            return ApiResponse.success(banners);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 获取所有 banner（管理后台使用）
     */
    @GetMapping("/all")
    public ApiResponse<List<Banner>> getAllBanners() {
        try {
            List<Banner> banners = bannerService.getAllBanners();
            return ApiResponse.success(banners);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 根据ID获取 banner
     */
    @GetMapping("/{id}")
    public ApiResponse<Banner> getBanner(@PathVariable Long id) {
        try {
            Banner banner = bannerService.getBannerById(id);
            return ApiResponse.success(banner);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 创建 banner
     */
    @PostMapping("/create")
    public ApiResponse<Banner> createBanner(@RequestBody Banner banner) {
        try {
            Banner createdBanner = bannerService.createBanner(banner);
            return ApiResponse.success(createdBanner);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 更新 banner
     */
    @PutMapping("/{id}")
    public ApiResponse<Banner> updateBanner(@PathVariable Long id, @RequestBody Banner banner) {
        try {
            banner.setId(id);
            Banner updatedBanner = bannerService.updateBanner(banner);
            return ApiResponse.success(updatedBanner);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 删除 banner
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBanner(@PathVariable Long id) {
        try {
            bannerService.deleteBanner(id);
            return ApiResponse.success("删除成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 初始化 Banner 数据（用于快速创建测试数据）
     * 注意：生产环境应该禁用此接口
     */
    @PostMapping("/init")
    public ApiResponse<String> initBanners() {
        try {
            // 检查是否已有数据
            List<Banner> existingBanners = bannerService.getAllBanners();
            if (!existingBanners.isEmpty()) {
                return ApiResponse.error("Banner 数据已存在，请先删除后再初始化");
            }
            
            // 创建 4 个 banner
            String baseUrl = "http://10.1.23.38:8080/api/static/banner";
            
            Banner banner1 = new Banner();
            banner1.setImageUrl(baseUrl + "/1.png");
            banner1.setTitle("新品上市，限时优惠");
            banner1.setLinkUrl("/pages/goods/list?tag=new");
            banner1.setSortOrder(1);
            banner1.setEnabled(true);
            bannerService.createBanner(banner1);
            
            Banner banner2 = new Banner();
            banner2.setImageUrl(baseUrl + "/2.png");
            banner2.setTitle("二手好物，等你来淘");
            banner2.setLinkUrl("/pages/goods/list?tag=hot");
            banner2.setSortOrder(2);
            banner2.setEnabled(true);
            bannerService.createBanner(banner2);
            
            Banner banner3 = new Banner();
            banner3.setImageUrl(baseUrl + "/3.png");
            banner3.setTitle("会员专享，积分兑换");
            banner3.setLinkUrl("/pages/user/profile");
            banner3.setSortOrder(3);
            banner3.setEnabled(true);
            bannerService.createBanner(banner3);
            
            Banner banner4 = new Banner();
            banner4.setImageUrl(baseUrl + "/4.png");
            banner4.setTitle("发布闲置，快速变现");
            banner4.setLinkUrl("/pages/goods/publish");
            banner4.setSortOrder(4);
            banner4.setEnabled(true);
            bannerService.createBanner(banner4);
            
            return ApiResponse.success("Banner 数据初始化成功");
        } catch (Exception e) {
            return ApiResponse.error("初始化失败: " + e.getMessage());
        }
    }
}

