import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'mdb-ui-kit/css/mdb.min.css';

function CreateProject() {
    const [uploadStatus, setUploadStatus] = useState("폴더 업로드 준비중...")
    const [folderPath, setFolderPath] = useState("");
    const [selectedOption, setSelectedOption] = useState('');
    const [directory, setDirectory] = useState('');
    const [path, setPath] = useState('');
    const [maxmutants, setMaxmutants] = useState('');
    const [filename, setFilename] = useState('');
    const [line, setLine] = useState('');
    const [notmutated, setNotmutated] = useState('');

    useEffect(() => {
        if (!folderPath) return; // 폴더 경로가 설정되지 않은 경우 실행하지 않음

        const socket = new WebSocket("ws://localhost:8080/folder");

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

            <div className="container-fluid text-center" style={{position: 'absolute', top: '260px'}}>
                <h4><b>Upload an original folder</b></h4>
                <h5><small className="text-body-secondary"><i>one folder</i></small></h5>
            </div>

            <div className="container-fluid text-center" style={{position: 'absolute', top: '330px'}}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="폴더 경로를 입력하세요"
                    onChange={(e) => setFolderPath(e.target.value)}
                    style={{width: '50%', margin: '20px auto'}}
                />
                <h5>상태: {uploadStatus}</h5>
            </div>

            <div className="container-fluid text-center" style={{position: 'absolute', top: '470px'}}>
                <h4><b>Select mutation options and operators</b></h4>
                <h5><small className="text-body-secondary"><i>at least one option and one operator</i></small></h5>
            </div>

            <div className="container-fluid" style={{position: 'absolute', top: '550px'}}>
                <div>
                    <label>Select options:</label>
                    <select multiple={true} onChange={handleOptionChange}>
                        <option value="-o">-o</option>
                        <option value="-p">-p</option>
                        <option value="-l">-l</option>
                        <option value="-rs-re">-rs-re</option>
                        <option value="-x">-x</option>
                        <option value="-m">-m</option>
                    </select>


                    {selectedOption.includes('-o') && (
                        <div>
                            <label>
                                Directory:
                                <input
                                    type="text"
                                    value={directory}
                                    onChange={(e) => setDirectory(e.target.value)}/>
                            </label>
                        </div>
                    )}

                    {selectedOption.includes('-p') && (
                        <div>
                            <label>
                                Compilation database file:
                                <input
                                    type="text"
                                    value={path}
                                    onChange={(e) => setPath(e.target.value)}/>
                            </label>
                        </div>
                    )}

                    {selectedOption.includes('-l') && (
                        <div>
                            <label>
                                Maximum mutatants:
                                <input
                                    type="number"
                                    value={maxmutants}
                                    onChange={(e) => setMaxmutants(e.target.value)}/>
                            </label>
                        </div>
                    )}

                    {selectedOption.includes('-rs-re') && (
                        <div>
                            <label>
                                Filename:
                                <input
                                    type="text"
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}/>
                            </label>
                            <label>
                                Line:
                                <input
                                    type="number"
                                    value={line}
                                    onChange={(e) => setLine(e.target.value)}/>
                            </label>
                        </div>
                    )}

                    {selectedOption.includes('-x') && (
                        <div>
                            <label>
                                Not be mutated:
                                <input
                                    type="text"
                                    value={notmutated}
                                    onChange={(e) => setNotmutated(e.target.value)}/>
                            </label>
                        </div>
                    )}
                </div>
            </div>

            <div className="container-fluid" style={{position: 'absolute', left: '600px', top: '550px'}}>
                <label>Select operators:</label>
                <select multiple={true} onChange={handleOptionChange}>
                    <option value="oaan">oaan</option>
                    <option value="obbn">obbn</option>
                    <option value="ossf">ossf</option>
                    <option value="oaab">oaab</option>
                </select>
            </div>

            <div className="container-fluid d-flex justify-content-center"
                 style={{position: 'absolute', top: '720px', paddingBottom: '30px'}}>
                <button className="btn btn-dark" type="submit">Generate</button>
            </div>
        </div>
    );
}

export default CreateProject;
