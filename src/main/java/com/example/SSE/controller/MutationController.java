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
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mutation")
public class MutationController {

    private final MutationService mutationService;

    @Autowired
    public MutationController(MutationService mutationService) {
        this.mutationService = mutationService;
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyMutation(@RequestParam String modelFolderPath, @RequestParam(required = false) String compilePath, @RequestParam(required = false) String outputDirectory, @RequestParam(required = false) int maxMutants, @RequestParam String startFilename, @RequestParam(required = false) int startLine, @RequestParam String endFilename, @RequestParam(required = false) int endLine, @RequestParam(required = false) int notMutatedLine, @RequestParam String mutantOperator) throws IOException {
        try {
            // 사용자가 입력한 폴더에서 .c 파일들 찾기
            List<Path> modelFiles = mutationService.findModelFiles(modelFolderPath);
            if (modelFiles.isEmpty()) {
                return ResponseEntity.status(404).body("No C files found in the provided folder");
            }

            // .c 파일들을 순회하며 변이 적용
            Path compileDatabasePath = compilePath != null ? Paths.get(compilePath) : null;
            Path outputDirectoryPath = outputDirectory != null ? Paths.get(outputDirectory) : null;
            String mutationResults = modelFiles.stream()
                    .map(modelfile -> {
                        try {
                            return mutationService.applyMutation(
                                    modelfile, compileDatabasePath, outputDirectoryPath, maxMutants, startFilename, startLine, endFilename, endLine, notMutatedLine, mutantOperator
                            );
                        } catch (IOException e) {
                            return "Error mutating file: " + modelfile.getFileName();
                        }
                    })
                    .collect(Collectors.joining("\n"));
            return ResponseEntity.ok(mutationResults);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error during mutation process");
        }
    }
}
