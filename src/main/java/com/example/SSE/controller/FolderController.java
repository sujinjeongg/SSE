package com.example.SSE.controller;

import com.example.SSE.service.FolderService;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/folder")
public class FolderController {

    private final FolderService folderService;

    // 생성자 주입
    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping("/structure")
    public ResponseEntity<?> getFolderStructure(@RequestParam String path) {
        Path folderPath = Paths.get(path); // 요청된 경로
        try {
            JSONObject folderStructure = folderService.getFolderStructure(folderPath);
            return ResponseEntity.ok(folderStructure.toString());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("폴더 구조를 가져오는 중 오류가 발생했습니다.");
        }
    }
}
