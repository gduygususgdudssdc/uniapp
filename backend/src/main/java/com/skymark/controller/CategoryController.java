package com.skymark.controller;

import com.skymark.common.ApiResponse;
import com.skymark.entity.Category;
import com.skymark.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping("/list")
    public ApiResponse<List<Category>> getCategories(@RequestParam(required = false) Long parentId) {
        try {
            List<Category> categories = categoryService.getCategories(parentId);
            return ApiResponse.success(categories);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ApiResponse<Category> getCategory(@PathVariable Long id) {
        try {
            Category category = categoryService.getCategoryById(id);
            return ApiResponse.success(category);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}









