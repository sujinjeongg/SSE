import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'mdb-ui-kit/css/mdb.min.css';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

function CreateProject() {
    const [uploadStatus, setUploadStatus] = useState("폴더 업로드 준비중...")
    const [folderPath, setFolderPath] = useState("");
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOperator, setSelectedOperator] = useState('');
    const [modelFilePath, setModelFilePath] = useState('');
    const [compileDatabasePath, setCompileDatabasePath] = useState('');
    const [outputDirectory, setOutputDirectory] = useState('');
    const [maxMutants, setMaxMutants] = useState('');
    const [startFilename, setStartFilename] = useState('firstmodel.c');
    const [startLine, setStartLine] = useState(0);
    const [endFilename, setEndFilename] = useState('endmodel.c');
    const [endLine, setEndLine] = useState(0);
    const [notMutatedLine, setNotMutatedLine] = useState(-1);
    const navigate = useNavigate();

    useEffect(() => {
        if (!folderPath) return; // 폴더 경로가 설정되지 않은 경우 실행하지 않음

        const socket = new WebSocket("wss://localhost:8084/folder");

        // WebSocket 연결이 열리면 호출됨
        socket.onopen = () => {
            console.log("WebSocket 연결됨");
            setUploadStatus("폴더 업로드 중...");
            // WebSocket이 열리면 사용자가 입력한 폴더 경로를 전송
            socket.send(folderPath);
        };

        // 서버로부터 메시지를 받으면 호출됨
        socket.onmessage = (event) => {
            // 서버에서 완료 메시지를 받으면 업로드 완료 상태로 변경
            setUploadStatus("업로드 완료");
            console.log("서버로부터의 응답:", event.data);
        };

        // WebSocket 연결이 종료되면 호출됨
        socket.onclose = () => {
            console.log("WebSocket 연결 종료");
            if (uploadStatus === "폴더 업로드 중...") {
                setUploadStatus("업로드 실패");
            }
        };

        return () => {
            socket.close();
        };
    }, [folderPath]);

    const handleOptionChange = (e) => {
        const value = e.target.value;
        setSelectedOption((prev) =>
        prev.includes(value) ? prev.filter((opt) => opt !==value) : [...prev, value]);
    };

    const handleGenerate = async () => {
        try {
            const response = await axios.post('/api/mutation/apply', {
                modelFilePath, compileDatabasePath, outputDirectory, maxMutants, startFilename, startLine, endFilename, endLine, notMutatedLine, mutantOperator: selectedOperator.join(','),
            });
            navigate('/result', { state: { mutationResult: response.data } });
        } catch (e) {
            console.error(e);
            navigate('/result', { state: { mutationResult: `Error: ${e.response?.data || e.message}` } });
        }
    };

    const handleOperatorChange = (e) => {
        const value = e.target.value;
        setSelectedOperator((prev) =>
            prev.includes(value) ? prev.filter((opr) => opr !==value) : [...prev, value]);
    };

    return (
        <div style={{position: 'relative'}}>
            <div className="container-fluid" style={{backgroundColor: '#000', color: 'white', padding: '35px'}}>
                <i className="bi bi-house-fill"
                   style={{fontSize: '2rem', marginLeft: '1390px', marginRight: '15px', marginTop: '10px'}}></i>
                <i className="bi bi-person-circle"
                   style={{fontSize: '2rem', marginRight: '15px', marginTop: '10px'}}></i>
                <i className="bi bi-gear" style={{fontSize: '2rem', marginRight: '5px', marginTop: '10px'}}></i>
                <h3 style={{marginTop: '30px'}}>Create New Project</h3>
            </div>

            <div className="container-fluid" style={{position: 'absolute', top: '260px', left: '150px'}}>
                <h4><b>Upload an original folder</b></h4>
                <h5><small className="text-body-secondary"><i>one folder</i></small></h5>
            </div>

            <div className="container-fluid" style={{position: 'absolute', top: '345px', left: '150px'}}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="폴더 경로를 입력하세요"
                    value = {folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                    style={{width: '40%', marginBottom: '10px'}}
                />
                <h5>상태: {uploadStatus}</h5>
            </div>

            <div className="container-fluid" style={{position: 'absolute', top: '260px', left: '850px'}}>
                <h4><b>Select mutation options and operators</b></h4>
                <h5><small className="text-body-secondary"><i>at least one option and one operator</i></small></h5>
            </div>

            <div className="container-fluid" style={{position: 'absolute', top: '330px', left: '850px'}}>
                <div>
                    <label>Select options:</label>
                    <select multiple={true} onChange={handleOptionChange}>
                        <option value="-p">-p</option>
                        <option value="-o">-o</option>
                        <option value="-l">-l</option>
                        <option value="-rs">-rs</option>
                        <option value="-re">-re</option>
                        <option value="-x">-x</option>
                    </select>

                    {selectedOption.includes('-p') && (
                        <div>
                            <label>
                                Compilation database file:
                                <input
                                    type="text"
                                    value={compileDatabasePath}
                                    onChange={(e) => setCompileDatabasePath(e.target.value)}/>
                            </label>
                        </div>
                    )}

                    {selectedOption.includes('-o') && (
                        <div>
                            <label>
                                Directory:
                                <input
                                    type="text"
                                    value={outputDirectory}
                                    onChange={(e) => setOutputDirectory(e.target.value)}/>
                            </label>
                        </div>
                    )}

                    {selectedOption.includes('-l') && (
                        <div>
                            <label>
                                Maximum mutants:
                                <input
                                    type="number"
                                    value={maxMutants}
                                    onChange={(e) => setMaxMutants(e.target.value)}/>
                            </label>
                        </div>
                    )}

                    {selectedOption.includes('-rs') && (
                        <div>
                            <label>
                                Start Filename:
                                <input
                                    type="text"
                                    value={startFilename}
                                    onChange={(e) => setStartFilename(e.target.value)}/>
                            </label>
                            <br/>
                            <label>
                                Start Line:
                                <input
                                    type="number"
                                    value={startLine}
                                    onChange={(e) => setStartLine(e.target.value)}/>
                            </label>
                        </div>
                    )}

                    {selectedOption.includes('-re') && (
                        <div>
                            <label>
                                End Filename:
                                <input
                                    type="text"
                                    value={endFilename}
                                    onChange={(e) => setEndFilename(e.target.value)}/>
                            </label>
                            <br/>
                            <label>
                                End Line:
                                <input
                                    type="number"
                                    value={endLine}
                                    onChange={(e) => setEndLine(e.target.value)}/>
                            </label>
                        </div>
                    )}

                    {selectedOption.includes('-x') && ( //여러 line 입력하여 쉼표로 구분
                        <div>
                            <label>
                                Not be mutated line:
                                <input
                                    type="text"
                                    value={notMutatedLine}
                                    onChange={(e) => setNotMutatedLine(e.target.value)}/>
                            </label>
                        </div>
                    )}
                </div>
            </div>

            <div className="container-fluid" style={{position: 'absolute', left: '1150px', top: '330px'}}>
                <label>Select operators:</label>
                <select multiple={true} value={selectedOperator}>
                    {['oaan', 'obbn', 'ossf', 'oaab', 'vscr'].map((option) => (
                        <option
                            key={option}
                            value={option}
                            onClick={(e) => handleOperatorChange(e)}
                        >
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            <div className="container-fluid d-flex justify-content-center"
                 style={{position: 'absolute', top: '720px', paddingBottom: '30px'}}>
                <button className="btn btn-dark" type="submit" onClick={handleGenerate}>Generate</button>
            </div>
        </div>
    );
}

export default CreateProject;
