package com.example.SSE.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    //WebSocketHandler를 주입받아 사용
    @Autowired
    private WebSocketHandler webSocketHandler;

    // 웹소켓 핸들러 등록.
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry reg) {
        reg.addHandler(new WebSocketHandler(), "/ws").setAllowedOrigins("*");
    }
}