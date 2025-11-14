package com.skymark.service;

import com.skymark.entity.User;
import com.skymark.repository.UserRepository;
import com.skymark.util.WechatUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import java.util.Map;
import java.util.Optional;
import java.nio.charset.StandardCharsets;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WechatUtil wechatUtil;
    
    public User register(String phone, String password, String username) {
        if (userRepository.existsByPhone(phone)) {
            throw new RuntimeException("手机号已存在");
        }
        
        User user = new User();
        user.setPhone(phone);
        // 明确指定 UTF-8 编码
        user.setPassword(DigestUtils.md5DigestAsHex(password.getBytes(StandardCharsets.UTF_8)));
        user.setUsername(username);
        
        return userRepository.save(user);
    }
    
    public User login(String phone, String password) {
        Optional<User> userOpt = userRepository.findByPhone(phone);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("用户不存在");
        }
        
        User user = userOpt.get();
        // 明确指定 UTF-8 编码，确保与注册时一致
        String hashedPassword = DigestUtils.md5DigestAsHex(password.getBytes(StandardCharsets.UTF_8));
        String dbPassword = user.getPassword();
        
        // 检查密码是否匹配
        boolean passwordMatch = false;
        
        // 情况1：数据库中是MD5格式（32位十六进制字符串）
        if (dbPassword != null && dbPassword.length() == 32) {
            passwordMatch = dbPassword.equals(hashedPassword);
        } 
        // 情况2：数据库中是明文密码（兼容旧数据）
        else if (dbPassword != null && dbPassword.equals(password)) {
            passwordMatch = true;
            // 自动将明文密码更新为MD5格式
            user.setPassword(hashedPassword);
            userRepository.save(user);
            System.out.println("已自动将用户密码从明文转换为MD5格式");
        }
        
        if (!passwordMatch) {
            throw new RuntimeException("密码错误");
        }
        
        return user;
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }
    
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    /**
     * 更新用户昵称
     * @param userId 用户ID
     * @param username 新昵称
     * @return 更新后的用户对象
     */
    public User updateUsername(Long userId, String username) {
        User user = getUserById(userId);
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("昵称不能为空");
        }
        user.setUsername(username.trim());
        return userRepository.save(user);
    }
    
    /**
     * 更新用户头像
     * @param userId 用户ID
     * @param avatarUrl 头像URL
     * @return 更新后的用户对象
     */
    public User updateAvatar(Long userId, String avatarUrl) {
        User user = getUserById(userId);
        if (avatarUrl == null || avatarUrl.trim().isEmpty()) {
            throw new RuntimeException("头像URL不能为空");
        }
        user.setAvatar(avatarUrl.trim());
        return userRepository.save(user);
    }
    
    /**
     * 微信登录
     * @param code 微信登录凭证
     * @param nickName 微信昵称（可选）
     * @param avatarUrl 微信头像（可选）
     * @return 用户对象
     */
    public User wechatLogin(String code, String nickName, String avatarUrl) {
        // 1. 通过 code 获取 openid
        Map<String, String> wechatInfo = wechatUtil.getOpenidByCode(code);
        if (wechatInfo == null || !wechatInfo.containsKey("openid")) {
            throw new RuntimeException("获取微信用户信息失败");
        }
        
        String openid = wechatInfo.get("openid");
        
        // 2. 查找是否已存在该微信用户
        Optional<User> userOpt = userRepository.findByOpenid(openid);
        
        User user;
        if (userOpt.isPresent()) {
            // 已存在，更新用户信息（昵称和头像）
            user = userOpt.get();
            if (nickName != null && !nickName.isEmpty()) {
                user.setUsername(nickName);
            }
            if (avatarUrl != null && !avatarUrl.isEmpty()) {
                user.setAvatar(avatarUrl);
            }
        } else {
            // 不存在，创建新用户
            user = new User();
            user.setOpenid(openid);
            user.setUsername(nickName != null && !nickName.isEmpty() ? nickName : "微信用户");
            user.setAvatar(avatarUrl != null && !avatarUrl.isEmpty() ? avatarUrl : "");
            // 生成一个随机手机号（用于兼容现有系统，实际项目中可以改为可选）
            user.setPhone("wx_" + openid.substring(0, Math.min(11, openid.length())));
            // 设置一个默认密码（微信登录用户不需要密码）
            user.setPassword(DigestUtils.md5DigestAsHex(("wechat_" + openid).getBytes(StandardCharsets.UTF_8)));
        }
        
        // 3. 保存用户
        return userRepository.save(user);
    }
}
