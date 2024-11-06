package com.example.SSE.config;

import com.example.SSE.service.FolderService;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final FolderService folderService;

    public WebSocketHandler(FolderService folderService) {
        this.folderService = folderService;
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String folderPath = message.getPayload(); // 클라이언트가 보낸 메시지에서 폴더 경로를 추출 (문자열 형태)
        Path path = Paths.get(folderPath);  // 파일 시스템에서의 경로 (Path 객체)

        JSONObject folderStructure = folderService.getFolderStructure(path);  // 폴더 구조 JSON 형태로 생성
        session.sendMessage(new TextMessage(folderStructure.toString()));  // JSON 구조 문자열 형태로 전송
    }
}