package com.skymark.controller;

import com.skymark.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class WebSocketTestController {
    
    @GetMapping("/ws/status")
    public ApiResponse<String> getWebSocketStatus() {
        return ApiResponse.success("WebSocket 服务运行正常，路径: /ws/chat, /api/ws/chat, /test/ws, /ws");
    }
}


