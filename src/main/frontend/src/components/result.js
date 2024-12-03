import React, { useEffect, useState } from "react";
import axios from "axios";

const Result = () => {
    const [files, setFiles] = useState([]); // 변이된 파일 목록
    const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 정보

    useEffect(() => {
        // 서버에서 변이된 파일 목록 가져오기
        const fetchFiles = async () => {
            try {
                const response = await axios.get("https://localhost:8082/api/mutation/output-files");
                setFiles(response.data);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, []);

    const handleFileClick = (file) => {
        setSelectedFile(file); // 클릭한 파일의 정보를 상태로 설정
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* 사이드바 */}
            <div style={{ width: "20%", backgroundColor: "#f0f0f0", padding: "10px" }}>
                <h3>Files</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {files.map((file, index) => (
                        <li
                            key={index}
                            onClick={() => handleFileClick(file)}
                            style={{
                                padding: "10px",
                                cursor: "pointer",
                                backgroundColor: selectedFile?.name === file.name ? "#e0e0e0" : "transparent",
                            }}
                        >
                            {file.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 파일 내용 표시 */}
            <div style={{ flex: 1, padding: "20px" }}>
                {selectedFile ? (
                    <div>
                        <h2>{selectedFile.name}</h2>
                        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {selectedFile.content}
            </pre>
                    </div>
                ) : (
                    <p>Select a file to view its content</p>
                )}
            </div>
        </div>
    );
};

export default Result;
