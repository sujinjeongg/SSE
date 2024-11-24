package com.example.SSE.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class MutationService {

    public List<Path> findModelFiles(String folderPath) throws IOException {
        Path startPath = Paths.get(folderPath);
        try (Stream<Path> walk = Files.walk(startPath)) {
            List<Path> cFiles = walk.filter(Files::isRegularFile)
                    .filter(p -> p.getFileName().toString().endsWith(".c"))
                    .collect(Collectors.toList());
            if (cFiles.isEmpty()) {
                throw new IllegalArgumentException("No .c files found in the directory: " + folderPath);
            }
            return cFiles;
        }
    }

    public List<Map<String, String>> applyMutation(String folderPath, Path compileDatabasePath, Path outputDirectory, int maxMutants, String startFilename, int startLine, String endFilename, int endLine, int notMutatedLine, String mutantOperator) throws IOException, InterruptedException {

        // STEP 1: 폴더에서 .c파일들 찾기
        List<Path> modelFiles = findModelFiles(folderPath);

        // STEP 2: 모든 .c 파일들을 wsl 경로로 변환 후 우분투 디렉토리에 복사
        for (Path file : modelFiles) {
            System.out.println(file.toString());
            // 윈도우 inputfile 경로를 wsl 경로 형식으로 변환
            String windowsPath = file.toString();
            String wslPath = windowsPath.replace("\\", "/").replace("C:", "/mnt/c");

            // cp 명령어 - wsl 경로 형식으로 바꾼 윈도우 파일을 우분투 디렉토리로 복사
            Process copyWslPathProcess = new ProcessBuilder("cp", wslPath, "/home/user/MUSIC/").start();
            try {
                int copyExitCode = copyWslPathProcess.waitFor();
                if (copyExitCode != 0) {
                    throw new IOException("Error copying file to MUSIC directory.");
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); // 스레드의 인터럽트 상태 복원
                throw new IOException("File copy process was interrupted.");
            }
        }

        // STEP 3: inputfilename1 inputfilename2... 파일 이름 리스트 생성
        String inputfilenames = modelFiles.stream().map(file -> file.getFileName().toString()).collect(Collectors.joining(" "));

        // -rs -re 값 설정
        String defaultStartFilename = modelFiles.get(0).getFileName().toString(); // -rs filename의 default는 첫번째 .c 파일
        String defaultEndFilename = modelFiles.get(modelFiles.size() - 1).getFileName().toString(); // -re filename의 default는 마지막 .c 파일
        String startMutantFilename = startFilename != null ? startFilename + ":" + startLine : defaultStartFilename + ":0"; // 사용자가 입력하는 값이 있다면 그 값 사용. 없다면 default값 사용.
        int endMutantLine = endLine != 0 ? endLine : (int) Files.lines(modelFiles.get(modelFiles.size() - 1)).count();
        String endMutantFilename = endFilename != null ? endFilename + ":" + endMutantLine : defaultEndFilename + ":" + endMutantLine; // 사용자가 입력하는 값이 있다면 그 값 사용. 없다면 default값 사용.

        // 윈도우 outputDirectory 경로를 wsl 경로 형식으로 변환
        String windowsOutputDirectory = outputDirectory.toString();
        String wslOutputDirectory = windowsOutputDirectory.replace("\\", "/").replace("C:", "/mnt/c");
        String windowsCurrentDirectory = System.getProperty("user.dir"); // 사용자의 현재 디렉토리를 가져옴
        String wslCurrentDirectory = windowsCurrentDirectory.replace("\\", "/").replace("C:", "/mnt/c");

        // STEP 4: MUSIC 명령어 실행
        List<String> commands = new ArrayList<>();
        commands.add("/home/user/MUSIC/music");
        commands.add(inputfilenames);
        if (compileDatabasePath != null) { // 사용자로부터 compilation database file 경로를 받았으면 -p 옵션 추가
            commands.add("-p");
            commands.add(compileDatabasePath.toString());
        } else { // 사용자로부터 compilation database file 경로를 받지 않았으면 없는 상태로 실행
            commands.add("-p --");
        }
        if (outputDirectory != null) {
            commands.add("-o " + wslOutputDirectory); // output directory 절대 경로. 윈도우 디렉토리에 저장됨.
        } else { // 사용자로부터 ouputDirectory 경로를 받지 않았으면 사용자의 현재 디렉토리를 outputDiretory로 설정
            commands.add("-o " + wslCurrentDirectory);
        }
        if (maxMutants > 0) {
            commands.add("-l " + String.valueOf(maxMutants)); // mutants 최대 생성 개수
        }
        commands.add("-rs " + startMutantFilename); // mutant 생성 시작 file, line. null이면 default로 첫 번째 c파일의 첫 번째줄
        commands.add("-re " + endMutantFilename); // mutant 생성 끝 file, line. null이면 defaulat로 마지막 c파일의 마지막줄
        if (notMutatedLine > 0) {
            commands.add("-x " + String.valueOf(notMutatedLine)); // mutant 생성 제외할 lines
        }
        commands.add("-m " + mutantOperator); // 변이 연산자

        ProcessBuilder musicProcessBuilder = new ProcessBuilder(commands);
        musicProcessBuilder.directory(Paths.get(folderPath).getParent().toFile()); // #include와 같은 상대 경로가 포함된 경우, MUSIC이 폴더 구조를 유지하면서 올바르게 실행되도록

        // 프로세스 실행 및 출력 로그 출력
        Process musicProcess = musicProcessBuilder.start();
        StringBuilder outputLog = new StringBuilder();
        try (BufferedReader outputReader = new BufferedReader(new InputStreamReader(musicProcess.getInputStream()))) {
            String line;
            while ((line = outputReader.readLine()) != null) {
                outputLog.append(line).append("\n");
            }

            System.out.println("MUSIC process output:\n" + outputLog);
        }

        // (임시) Process 실행 결과 검사 추가 , Output 디렉토리 검사
        int exitCode = musicProcess.waitFor();
        if (exitCode != 0) {
            throw new IOException("MUSIC process failed with exit code " + exitCode);
        }
        if (outputDirectory == null || !Files.exists(outputDirectory)) {
            throw new IllegalArgumentException("Invalid output directory: " + outputDirectory);
        }

        // 변이된 파일 이름들, 코드 반환
        List<Map<String, String>> outputFilesList = new ArrayList<>();
        try (Stream<Path> outputFiles = Files.list(outputDirectory)) {
            outputFiles.filter(p -> p.getFileName().toString().endsWith(".c"))
                    .forEach(p -> {
                        Map<String, String> fileInfo = new HashMap<>();
                        fileInfo.put("name", p.getFileName().toString());
                        try {
                            fileInfo.put("content", Files.readString(p));
                        } catch (IOException e) {
                            fileInfo.put("content", "Error reading file.");
                        }
                        outputFilesList.add(fileInfo);
                    });
        }
        return outputFilesList;
    }
}

