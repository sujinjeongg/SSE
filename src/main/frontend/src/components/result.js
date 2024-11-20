import React, { useState, useEffect } from "react";

function Result() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    // 서버에서 변이된 파일 목록 가져오기
    useEffect(() => {
        fetch("/api/mutation-results") // API 엔드포인트 호출
            .then((response) => response.json())
            .then((data) => {
                setFiles(data);
                if (data.length > 0) setSelectedFile(data[0]);
            })
            .catch((error) => console.error("Error fetching files:", error));
    }, []);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Mutation Results</h3>
            </div>
            <div style={styles.content}>
                <div style={styles.sidebar}>
                    <h3>Files</h3>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.fileItem,
                                backgroundColor:
                                    selectedFile && selectedFile.name === file.name
                                        ? "#d3d3d3"
                                        : "transparent",
                            }}
                            onClick={() => handleFileSelect(file)}
                        >
                            {file.name}
                        </div>
                    ))}
                </div>
                <div style={styles.mainContent}>
                    {selectedFile && (
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>{selectedFile.name}</div>
                            <pre style={styles.fileContent}>
                                <code>{selectedFile.content}</code>
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: "flex", flexDirection: "column" },
    header: { padding: "10px", borderBottom: "1px solid #ccc" },
    content: { display: "flex", marginTop: "10px" },
    sidebar: { width: "200px", padding: "10px", borderRight: "1px solid #ccc" },
    fileItem: { padding: "5px", cursor: "pointer" },
    mainContent: { flex: 1, padding: "10px" },
    card: { padding: "10px", border: "1px solid #ccc" },
    cardHeader: { fontWeight: "bold", marginBottom: "10px" },
    fileContent: { backgroundColor: "#f8f9fa", padding: "10px", height: "400px", overflowY: "scroll" },
};

export default Result;
