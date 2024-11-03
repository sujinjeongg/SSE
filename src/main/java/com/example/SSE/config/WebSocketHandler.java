package com.example.SSE.config;

import com.example.SSE.service.FolderService;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.io.IOException;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final FolderService folderService;

    public WebSocketHandler(FolderService folderService) {
        this.folderService = folderService;
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String requestedPath = message.getPayload();
        Path folerPath = Paths.get(requestedPath);

        JSONObject folderStructure = folderService.getFolderStructure(folerPath);
        session.sendMessage(new TextMessage(folderStructure.toString()));
    }
}

