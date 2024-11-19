import React, { useState } from "react";

function Result() {
    const [files] = useState([
        { id: 1, name: "input01_modified.c" },
        { id: 2, name: "input02_modified.c" },
        { id: 3, name: "input03_modified.c" },
        { id: 4, name: "input04_modified.c" },
    ]);
    const [selectedFile, setSelectedFile] = useState(files[0]);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            fontFamily: "Arial, sans-serif",
        },
        header: {
            backgroundColor: "#000",
            color: "white",
            padding: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
        icon: {
            fontSize: "2rem",
            margin: "0 15px",
            cursor: "pointer",
        },
        title: {
            margin: "30px 0 0 0",
            fontSize: "1.5rem",
            fontWeight: "bold",
        },
        content: {
            display: "flex",
            flex: 1,
            overflow: "hidden",
        },
        sidebar: {
            width: "20%",
            backgroundColor: "#f8f9fa",
            padding: "20px",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
            overflowY: "auto",
        },
        fileItem: {
            padding: "10px 15px",
            margin: "5px 0",
            borderRadius: "5px",
            cursor: "pointer",
        },
        mainContent: {
            flex: 1,
            padding: "20px",
            backgroundColor: "#fff",
            overflowY: "auto",
        },
        card: {
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "15px",
            marginBottom: "20px",
        },
        cardHeader: {
            fontWeight: "bold",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
            marginBottom: "10px",
        },
        button: {
            marginRight: "10px",
            padding: "8px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
        primaryButton: {
            backgroundColor: "#007bff",
            color: "#fff",
        },
        secondaryButton: {
            backgroundColor: "#6c757d",
            color: "#fff",
        },
    };

    return (
        <div style={styles.container}>
            {/* 헤더 */}
            <div style={styles.header}>
                <div>
                    <h3 style={styles.title}>Create New Project</h3>
                </div>
                <div>
                    <i className="bi bi-house-fill" style={styles.icon}></i>
                    <i className="bi bi-person-circle" style={styles.icon}></i>
                    <i className="bi bi-gear" style={styles.icon}></i>
                </div>
            </div>

            {/* 콘텐츠 */}
            <div style={styles.content}>
                {/* 사이드바 */}
                <div style={styles.sidebar}>
                    <h3>Files</h3>
                    {files.map((file) => (
                        <div
                            key={file.id}
                            style={{
                                ...styles.fileItem,
                                backgroundColor:
                                    selectedFile.id === file.id
                                        ? "#d3d3d3"
                                        : "transparent",
                            }}
                            onClick={() => handleFileSelect(file)}
                        >
                            {file.name}
                        </div>
                    ))}
                </div>

                {/* 메인 콘텐츠 */}
                <div style={styles.mainContent}>
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            {selectedFile.name}
                        </div>
                        <div>
                            <pre
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "10px",
                                    height: "400px",
                                    overflowY: "scroll",
                                }}
                            >
                                <code>
                                    {`#include <stdio.h>\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}`}
                                </code>
                            </pre>
                            <button
                                style={{ ...styles.button, ...styles.primaryButton }}
                            >
                                Edit
                            </button>
                            <button
                                style={{ ...styles.button, ...styles.secondaryButton }}
                            >
                                Log Record
                            </button>
                            <button
                                style={{ ...styles.button, ...styles.primaryButton }}
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Result;
