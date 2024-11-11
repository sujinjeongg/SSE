package com.example.SSE.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;

@Service
public class MutationService {

    public Path findModelFile(String userProvidedFile) throws IOException {
        Path startPath = Paths.get(userProvidedFile);
        return Files.walk(startPath)
                .filter(p -> p.getFileName().toString().endsWith(".c"))
                .findFirst()
                .orElse(null);
    }

    public String applyMutation(Path modelFilePath, Path compileCommandsPath) throws IOException {
        if (Files.exists(modelFilePath)) {
            // 사용자로부터 compilation database file 경로를 받았으면 -p 옵션 추가
            ProcessBuilder processBuilder;
            if (compileCommandsPath != null) {
                processBuilder = new ProcessBuilder(
                        "/home/user/MUSIC",
                        "-p", compileCommandsPath.toString(), // compilation database file 경로
                        modelFilePath.toString()
                );
            } else { // compilation database file 없이 실행
                processBuilder = new ProcessBuilder(
                        "/home/user/MUSIC",
                        modelFilePath.toString(),
                        "--" // compilation database file 없이 실행할 때 '--' 옵션 추가
                );
            }
            processBuilder.directory(modelFilePath.getParent().toFile()); // #include와 같은 상대 경로가 포함된 경우, MUSIC이 폴더 구조를 유지하면서 올바르게 실행되도록
            // 프로세스 실행 및 결과 저장
            Process process = processBuilder.start();
            InputStream inputStream = process.getInputStream();
            String result = new BufferedReader(new InputStreamReader(inputStream))
                    .lines().collect(Collectors.joining("\n"));
            return result;  // 변이 결과 반환
        }
        return "Target C file not found";
    }
}
