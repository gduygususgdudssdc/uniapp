package com.skymark.service;

import com.skymark.entity.Category;
import com.skymark.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<Category> getCategories(Long parentId) {
        if (parentId == null || parentId == 0) {
            return categoryRepository.findByParentIdIsNull();
        }
        return categoryRepository.findByParentId(parentId);
    }
    
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("分类不存在"));
    }
}









