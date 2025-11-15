package com.skymark.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * 微信工具类
 * 用于调用微信 API 获取用户 openid
 */
@Component
public class WechatUtil {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // 微信小程序 AppID 和 AppSecret
    // 注意：这些值应该从配置文件读取，这里先使用占位符
    // 请在 application.properties 或 application.yml 中配置
    @Value("${wechat.appid:your_appid}")
    private String appid;
    
    @Value("${wechat.secret:your_secret}")
    private String secret;
    
    /**
     * 通过 code 获取微信用户 openid 和 session_key
     * @param code 微信登录凭证
     * @return 包含 openid 和 session_key 的 Map，如果失败返回 null
     */
    public Map<String, String> getOpenidByCode(String code) {
        try {
            // 构建请求 URL
            String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                appid, secret, code
            );
            
            // 发送请求
            String response = restTemplate.getForObject(url, String.class);
            
            // 解析响应
            JsonNode jsonNode = objectMapper.readTree(response);
            
            // 检查是否有错误
            if (jsonNode.has("errcode")) {
                int errcode = jsonNode.get("errcode").asInt();
                String errmsg = jsonNode.has("errmsg") ? jsonNode.get("errmsg").asText() : "未知错误";
                System.err.println("微信 API 错误: " + errcode + " - " + errmsg);
                return null;
            }
            
            // 提取 openid 和 session_key
            Map<String, String> result = new HashMap<>();
            if (jsonNode.has("openid")) {
                result.put("openid", jsonNode.get("openid").asText());
            }
            if (jsonNode.has("session_key")) {
                result.put("session_key", jsonNode.get("session_key").asText());
            }
            
            return result;
        } catch (Exception e) {
            System.err.println("调用微信 API 失败: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}





