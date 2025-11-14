package com.skymark.controller;

import com.skymark.common.ApiResponse;
import com.skymark.entity.User;
import com.skymark.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ApiResponse<User> register(@RequestBody Map<String, String> request) {
        try {
            String phone = request.get("phone");
            String password = request.get("password");
            String username = request.get("username");
            
            User user = userService.register(phone, password, username);
            // 不返回密码
            user.setPassword(null);
            return ApiResponse.success(user);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        try {
            String phone = request.get("phone");
            String password = request.get("password");
            
            User user = userService.login(phone, password);
            user.setPassword(null);
            
            Map<String, Object> result = new HashMap<>();
            result.put("user", user);
            result.put("token", "mock_token_" + user.getId()); // 模拟token
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/wechat/login")
    public ApiResponse<Map<String, Object>> wechatLogin(@RequestBody Map<String, String> request) {
        try {
            String code = request.get("code");
            String nickName = request.get("nickName");
            String avatarUrl = request.get("avatarUrl");
            
            if (code == null || code.isEmpty()) {
                return ApiResponse.error("微信登录凭证不能为空");
            }
            
            User user = userService.wechatLogin(code, nickName, avatarUrl);
            user.setPassword(null);
            
            Map<String, Object> result = new HashMap<>();
            result.put("user", user);
            result.put("token", "mock_token_" + user.getId()); // 模拟token
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 更新用户昵称
     * 注意：更具体的路径要放在通用路径之前
     */
    @PutMapping("/{id}/username")
    public ApiResponse<User> updateUsername(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            User user = userService.updateUsername(id, username);
            user.setPassword(null);
            return ApiResponse.success(user);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 更新用户头像
     * 注意：更具体的路径要放在通用路径之前
     */
    @PutMapping("/{id}/avatar")
    public ApiResponse<User> updateAvatar(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String avatarUrl = request.get("avatarUrl");
            User user = userService.updateAvatar(id, avatarUrl);
            user.setPassword(null);
            return ApiResponse.success(user);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 上传头像（接收头像URL，实际文件上传需要前端先上传到OSS/CDN）
     * 如果前端需要直接上传文件，可以使用 MultipartFile，但需要配置文件存储
     * 注意：更具体的路径要放在通用路径之前
     */
    @PostMapping("/{id}/avatar/upload")
    public ApiResponse<User> uploadAvatar(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String avatarUrl = request.get("avatarUrl");
            if (avatarUrl == null || avatarUrl.isEmpty()) {
                return ApiResponse.error("头像URL不能为空");
            }
            User user = userService.updateAvatar(id, avatarUrl);
            user.setPassword(null);
            return ApiResponse.success(user);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ApiResponse<User> getUser(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            user.setPassword(null);
            return ApiResponse.success(user);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ApiResponse<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User existingUser = userService.getUserById(id);
            user.setId(id);
            // 不更新密码
            user.setPassword(existingUser.getPassword());
            User updatedUser = userService.updateUser(user);
            updatedUser.setPassword(null);
            return ApiResponse.success(updatedUser);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}





