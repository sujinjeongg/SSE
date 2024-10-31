package com.example.SSE.config;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class WebSocketHandler extends TextWebSocketHandler {
    /** 클라이언트, 서버 연결 성공 시 서버 연결 성공 알림 발생. */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("클라이언트 연결: " + session.getId());
        session.sendMessage(new TextMessage("서버 연결 성공"));
    }

    /** 텍스트 메세지 수신 시 응답 알림 발생. */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage msg) throws Exception {
        System.out.println("메시지 수신: " + msg.getPayload());
        session.sendMessage(new TextMessage("서버 응답: " + msg.getPayload()));
    }
}

