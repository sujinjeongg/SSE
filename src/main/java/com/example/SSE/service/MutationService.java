package com.example.SSE.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
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
            System.out.println("input file: " + file.toString());
            // 윈도우 inputfile 경로를 wsl 경로 형식으로 변환
            String windowsPath = file.toString();
            String wslPath = windowsPath.replace("\\", "/").replace("C:", "/mnt/c");
            System.out.println("리눅스 형태로 변환: " + wslPath);

            // cp 명령어 - wsl 경로 형식으로 바꾼 윈도우 파일을 우분투 디렉토리로 복사
            Process copyWslPathProcess = new ProcessBuilder("wsl", "cp", wslPath, "/home/user/").start();
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

        // -rs -re 파라미터 설정
        String defaultStartFilename = modelFiles.get(0).getFileName().toString(); // -rs filename의 default는 첫번째 .c 파일
        String defaultEndFilename = modelFiles.get(modelFiles.size() - 1).getFileName().toString(); // -re filename의 default는 마지막 .c 파일
        int startMutantLine = startLine != 0 ? startLine : 1;
        String startMutantFilename = startFilename != null ? startFilename + ":" + startMutantLine : defaultStartFilename + ":" + startMutantLine; // 사용자가 입력하는 값이 있다면 그 값 사용. 없다면 default값 사용.
        int endMutantLine = endLine != 0 ? endLine : (int) Files.lines(modelFiles.get(modelFiles.size() - 1)).count();
        String endMutantFilename = endFilename != null ? endFilename + ":" + endMutantLine : defaultEndFilename + ":" + endMutantLine; // 사용자가 입력하는 값이 있다면 그 값 사용. 없다면 default값 사용.

        // 윈도우 outputDirectory 경로를 wsl 경로 형식으로 변환
        String wslOutputDirectory;
        if (outputDirectory != null) { // 사용자로부터 outputDirectory를 입력 받은 경우
            String windowsOutputDirectory = outputDirectory.toString();
            wslOutputDirectory = windowsOutputDirectory.replace("\\", "/").replace("C:", "/mnt/c");
        } else { // 사용자로부터 outputDirectory를 입력 받지 않은 경우
            String windowsDownloadsDirectory = System.getProperty("user.home") + "\\Downloads"; // 사용자의 다운로드 디렉토리를 가져옴
            String windowsMutationDirectory = windowsDownloadsDirectory + "\\mutationDirectory"; // 다운로드 디렉토리 내 mutationDirectory
            File mutationDirectory = new File(windowsMutationDirectory); // mutationDirectory 디렉토리 생성
            if (mutationDirectory.mkdir()) {
                System.out.println("mutationDirectory가 생성되었습니다: " + windowsMutationDirectory);
            } else {
                System.err.println("mutationDirectory를 생성하는데 실패했습니다.");
            }
            wslOutputDirectory = windowsMutationDirectory.replace("\\", "/").replace("C:", "/mnt/c");
        }

        // STEP 3: MUSIC 명령어 실행
        List<String> commands = new ArrayList<>();
        commands.add("wsl");
        commands.add("--cd");
        commands.add("/home/user"); // WSL에서 시작할 디렉토리 지정
        commands.add("/home/user/MUSIC/music");
        modelFiles.forEach(file -> { // inputfilename1 inputfilename2... 파일 이름들
            String inputfilename = file.getFileName().toString();
            commands.add(inputfilename);
        });
        if (compileDatabasePath != null) { // 사용자로부터 compilation database file 경로를 받았으면 -p 옵션 추가
            commands.add("-p");
            commands.add(compileDatabasePath.toString());
        }
        commands.add("-o");
        commands.add(wslOutputDirectory);
        if (maxMutants > 0) {
            commands.add("-l");
            commands.add(String.valueOf(maxMutants)); // mutants 최대 생성 개수
        }
        if (startFilename != null) {
            commands.add("-rs");
            commands.add(startMutantFilename); // mutant 생성 시작 file, line. null이면 default로 첫 번째 c파일의 첫 번째줄
        }
        if (endFilename != null) {
            commands.add("-re");
            commands.add(endMutantFilename); // mutant 생성 끝 file, line. null이면 defaulat로 마지막 c파일의 마지막줄
        }
        if (notMutatedLine > 0) {
            commands.add("-x");
            commands.add(String.valueOf(notMutatedLine)); // mutant 생성 제외할 lines
        }
        if (mutantOperator != null) {
            commands.add("-m");
            commands.add(mutantOperator); // 변이 연산자
        }
        System.out.println("Generated commands: " + String.join(" ", commands));

        ProcessBuilder musicProcessBuilder = new ProcessBuilder(commands);
        musicProcessBuilder.redirectErrorStream(true); // stderr와 stdout 통합

        // 프로세스 실행 및 출력 로그 출력
        Process musicProcess = musicProcessBuilder.start();
        ExecutorService executor = Executors.newFixedThreadPool(2);
        executor.submit(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(musicProcess.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("STDOUT: " + line);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        executor.submit(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(musicProcess.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.err.println("STDERR: " + line);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        executor.shutdown();
        executor.awaitTermination(1, TimeUnit.MINUTES);

        // (임시) Process 실행 결과 검사 추가
        int exitCode = musicProcess.waitFor();
        if (exitCode != 0) {
            throw new IOException("MUSIC process failed with exit code " + exitCode);
        }

        // 변이된 파일 이름들, 코드 반환
        List<Map<String, String>> outputFilesList = new ArrayList<>();
        String resultOutputDirectory = (outputDirectory != null) ? outputDirectory.toString() : System.getProperty("user.home") + "\\Downloads\\mutationDirectory";;
        try (Stream<Path> outputFiles = Files.list(Paths.get(resultOutputDirectory))) {
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

