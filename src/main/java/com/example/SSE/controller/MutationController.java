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
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/mutation")
public class MutationController {

    private final MutationService mutationService;

    @Autowired
    public MutationController(MutationService mutationService) {
        this.mutationService = mutationService;
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyMutation(@RequestParam String path, @RequestParam(required = false) String compilePath) throws IOException {
        try {
            Path modelFile = mutationService.findModelFile(path);
            if (modelFile != null) {
                Path compileCommandsPath = compilePath != null ? Paths.get(compilePath) : null;
                String mutationResult = mutationService.applyMutation(modelFile, compileCommandsPath);
                return ResponseEntity.ok(mutationResult);
            } else {
                return ResponseEntity.status(404).body("Target C file not found");
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error during mutation process");
        }
    }
}
