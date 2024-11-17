package com.example.SSE.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class MutationService {

    public List<Path> findModelFiles(String modelFolderPath) throws IOException {
        Path startPath = Paths.get(modelFolderPath);
        try (Stream<Path> walk = Files.walk(startPath)) {
            return walk.filter(Files::isRegularFile)
                    .filter(p -> p.getFileName().toString().endsWith(".c"))
                    .collect(Collectors.toList());
        }
    }

    public String applyMutation(Path modelFilePath, Path compileDatabasePath, Path outputDirectory, int maxMutants, String startFilename, int startLine, String endFilename, int endLine, int notMutatedLine, String mutantOperator) throws IOException {
        if (Files.exists(modelFilePath)) {
            ProcessBuilder processBuilder; // 외부 /home/user/MUSIC 프로그램을 실행하기 위함. 명령어와 인수들을 문자열 배열로 전달해야 함.
            if (compileDatabasePath != null) { // 사용자로부터 compilation database file 경로를 받았으면 -p 옵션 추가
                processBuilder = new ProcessBuilder(
                        "/home/user/MUSIC",
                        "-p", compileDatabasePath.toString(), // compilation database file 경로
                        "-o", outputDirectory.toString(), // output directory 절대 경로
                        "-l", String.valueOf(maxMutants), // mutants 최대 생성 개수
                        "-rs", startFilename, String.valueOf(startLine), // mutant 생성 시작 line
                        "-re", endFilename, String.valueOf(endLine), // mutant 생성 끝 line
                        "-x", String.valueOf(notMutatedLine), // mutant 생성 제외할 lines
                        "-m", mutantOperator, // 변이 연산자
                        modelFilePath.toString()
                );
            } else { // 사용자로부터 compilation database file 경로를 받지 않았으면 없는 상태로 실행
                processBuilder = new ProcessBuilder(
                        "/home/user/MUSIC",
                        "-p --", // compilation database file 없이 실행할 때 '--' 옵션 추가
                        "-o", outputDirectory.toString(),
                        "-l", String.valueOf(maxMutants),
                        "-rs", startFilename, String.valueOf(startLine),
                        "-re", endFilename, String.valueOf(endLine),
                        "-x", String.valueOf(notMutatedLine),
                        modelFilePath.toString()
                );
            }
            processBuilder.directory(modelFilePath.getParent().toFile()); // #include와 같은 상대 경로가 포함된 경우, MUSIC이 폴더 구조를 유지하면서 올바르게 실행되도록

            // 프로세스 실행 및 결과 저장
            Process process = processBuilder.start();
            InputStream inputStream = process.getInputStream();
            String result = new BufferedReader(new InputStreamReader(inputStream))
                    .lines().collect(Collectors.joining("\n")); // 프로세스 결과를 문자열로 수집 후 result에 저장
            return result;  // 변이 결과 반환
        }
        return "C file not found";
    }
}
