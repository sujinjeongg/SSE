package com.example.SSE.controller;

import com.example.SSE.service.MutationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/mutation")
public class MutationController {

    private final MutationService mutationService;

    @Autowired
    public MutationController(MutationService mutationService) {
        this.mutationService = mutationService;
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyMutation(@RequestParam String folderPath, @RequestParam(required = false) Path compilePath, @RequestParam(required = false) Path outputDirectory, @RequestParam(required = false) int maxMutants, @RequestParam String startFilename, @RequestParam(required = false) int startLine, @RequestParam String endFilename, @RequestParam(required = false) int endLine, @RequestParam(required = false) int notMutatedLine, @RequestParam String mutantOperator) throws IOException {
        try {
            // 변이 생성 서비스 호출
            String result = mutationService.applyMutation(
                    folderPath, compilePath, outputDirectory, maxMutants,
                    startFilename, startLine, endFilename, endLine, notMutatedLine, mutantOperator
            );
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error during mutation process: " + e.getMessage());
        }
    }
}
