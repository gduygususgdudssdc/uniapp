package com.skymark.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    /**
     * 配置静态资源访问
     * 允许访问 resources/static 目录下的文件
     * 注意：由于设置了 context-path: /api，所以访问路径是 /api/static/...
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置静态资源路径
        // 访问路径：http://localhost:8080/api/static/banner/1.png
        // 注意：由于 context-path 是 /api，所以这里不需要再加 /api
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600); // 设置缓存时间（秒）
    }
}


