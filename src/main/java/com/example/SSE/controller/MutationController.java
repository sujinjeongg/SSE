package com.example.SSE.controller;

import com.example.SSE.service.MutationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mutation")
public class MutationController {

    public static void main(String[] args) {
        System.out.println(System.getenv("PATH"));
    }

    private final MutationService mutationService;

    @Autowired
    public MutationController(MutationService mutationService) {
        this.mutationService = mutationService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyMutation(@RequestBody Map<String, Object> requestData) {
        try {
            String folderPath = (String) requestData.get("folderPath");
            Path compilePath = requestData.get("compilePath") != null ? Paths.get((String) requestData.get("compilePath")) : null;
            Path outputDirectory = requestData.get("outputDirectory") != null ? Paths.get((String) requestData.get("outputDirectory")) : null;
            int maxMutants = requestData.get("maxMutants") != null ? (int) requestData.get("maxMutants") : 0;
            String startFilename = (String) requestData.get("startFilename");
            int startLine = requestData.get("startLine") != null ? (int) requestData.get("startLine") : 0;
            String endFilename = (String) requestData.get("endFilename");
            int endLine = requestData.get("endLine") != null ? (int) requestData.get("endLine") : 0;
            int notMutatedLine = requestData.get("notMutatedLine") != null ? (int) requestData.get("notMutatedLine") : -1;
            String mutantOperator = (String) requestData.get("mutantOperator");

            // (임시) 간단한 로그 출력
            System.out.println("Received mutation request: " + requestData.toString());
            String result = "Mutation applied successfully!";
            System.out.println("Mutation result: " + result);

            return ResponseEntity.ok(mutationService.applyMutation(
                    folderPath, compilePath, outputDirectory, maxMutants,
                    startFilename, startLine, endFilename, endLine,
                    notMutatedLine, mutantOperator
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Mutation failed.");
        }
    }
}
