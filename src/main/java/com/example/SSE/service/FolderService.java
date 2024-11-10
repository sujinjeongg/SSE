package com.example.SSE.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FolderService {

    public JSONObject getFolderStructure(Path folderPath) throws IOException {
        return buildFolderJson(folderPath);
    }

    private JSONObject buildFolderJson(Path path) throws IOException {
        JSONObject folderJson = new JSONObject();
        folderJson.put("name", path.getFileName().toString());
        folderJson.put("type", Files.isDirectory(path) ? "folder" : "file");
        folderJson.put("size", Files.isDirectory(path) ? 0 : Files.size(path)); // 파일 크기
        folderJson.put("lastModified", Files.getLastModifiedTime(path).toMillis()); // 수정 날짜

        if (Files.isDirectory(path)) {
            JSONArray filesArray = new JSONArray();
            try (DirectoryStream<Path> stream = Files.newDirectoryStream(path)) { //모든 하위 디렉터리와 파일을 계층적으로 탐색
                for (Path file : stream) {
                    filesArray.put(buildFolderJson(file)); // 재귀 호출하여 하위 폴더 및 파일 추가
                }
            }
            folderJson.put("files", filesArray); // 하위 파일 및 폴더 목록
        }
        return folderJson;
    }
}
