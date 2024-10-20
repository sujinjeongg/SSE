package com.example.SSE.controller;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.charset.StandardCharsets;


@Controller //RestController로 String을 반환하면 그것이 데이터로 간주되어 리다이렉트 동작이 아닌 텍스트로 출력되기 때문에 Controller를 사용
@RequestMapping("/upload")
public class UploadController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UploadController.class);

    /**
     * By default, the public folder in the working directory is a static resource directory, which can be accessed directly by the client.
     */
    private static final Path PUBLIC_DIR = Paths.get(System.getProperty("user.dir"), "public");

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String upload(@RequestParam("folder") MultipartFile[] files, RedirectAttributes redirectAttributes) throws IOException {
        boolean modelExists = false; //model.c 파일이 있는지 확인

        for (MultipartFile file : files) {

            // 파일 이름 가져오기 및 인코딩
            String originalFileName = file.getOriginalFilename();
            String encodedFileName = URLEncoder.encode(originalFileName, StandardCharsets.UTF_8);

            // 경로 구분자를 시스템에 맞게 변환
            String fileName = FilenameUtils.separatorsToSystem(encodedFileName);

            // public 폴더에 파일 경로 설정
            Path filePath = PUBLIC_DIR.resolve(fileName);

            // 디렉토리가 없으면 생성
            if (Files.notExists(filePath.getParent())) {
                Files.createDirectories(filePath.getParent());
            }

            // 파일 저장
            try (var inputStream = file.getInputStream()) {
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            LOGGER.info("write file: [{}] {}", file.getSize(), filePath);

            if ("model".equals(FilenameUtils.getBaseName(originalFileName))) {
                modelExists = true;
            }
        }

        if (!modelExists) { //폴더 내에 model.c 파일이 없으면 message 전달
            redirectAttributes.addFlashAttribute("message", "There's no model.c file.");
        }
        return "redirect:/create_project";
    }
}