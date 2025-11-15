package com.skymark.config;

import com.skymark.websocket.ChatWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    
    private final ChatWebSocketHandler chatWebSocketHandler;
    private final WebSocketInterceptor webSocketInterceptor;
    
    public WebSocketConfig(ChatWebSocketHandler chatWebSocketHandler) {
        this.chatWebSocketHandler = chatWebSocketHandler;
        this.webSocketInterceptor = new WebSocketInterceptor();
    }
    
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 注意：Spring WebSocket 路径注册是相对于根路径的
        // 由于 context-path=/api，实际访问路径是 ws://host:port/api/ws/chat
        // 但注册时只需要注册 /ws/chat（不包含 /api）
        System.out.println("注册 WebSocket 处理器...");
        System.out.println("注意：context-path=/api，注册路径 /ws/chat，实际访问 /api/ws/chat");
        
        // 注册路径: /ws/chat（不包含 context-path）
        // 实际访问路径: ws://host:port/api/ws/chat（context-path 会自动添加）
        registry.addHandler(chatWebSocketHandler, "/ws/chat")
                .addInterceptors(webSocketInterceptor)
                .setAllowedOrigins("*");
        System.out.println("✓ 注册路径: /ws/chat");
        System.out.println("✓ 实际访问路径: ws://host:port/api/ws/chat");
        
        System.out.println("WebSocket 处理器注册完成");
    }
}

