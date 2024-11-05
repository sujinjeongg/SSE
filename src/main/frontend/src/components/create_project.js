import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'mdb-ui-kit/css/mdb.min.css';
import $ from 'jquery';
import 'bootstrap-fileinput/css/fileinput.min.css';
import 'bootstrap-fileinput/js/fileinput.min.js';

function CreateProject() {
    const [uploadStatus, setUploadStatus] = useState("폴더 업로드 준비중...")
    const [folderPath, setFolderPath] = useState("");
    const [selectedOption, setSelectedOption] = useState('');
    const [directory, setDirectory] = useState('');
    const [path, setPath] = useState('');
    const [maxmutants, setMaxmutants] = useState('');
    const [filename, setFilename] = useState('');
    const [sline, setSLine] = useState('');
    const [eline, setELine] = useState('');
    const [Xfilename, setXFilename] = useState('');
    const [Xline, setXLine] = useState('');

    const fileInputRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        $(fileInputRef.current).fileinput({
            uploadUrl: "/file-upload-batch/2",
            hideThumbnailContent: true
        });

        // 컴포넌트가 언마운트될 때 fileinput 해제
        return () => {
            $(fileInputRef.current).fileinput('destroy');
        };
    }, []); // 이 useEffect는 처음 마운트될 때만 실행됨

    useEffect(() => {
        if (!folderPath) return; // 폴더 경로가 설정되지 않은 경우 실행하지 않음

        // WebSocket을 컴포넌트가 처음 마운트될 때 한 번만 생성
        socket.current = new WebSocket("ws://localhost:8080/folder"); // 컴포넌트가 마운트될 때 한 번만 WebSocket 객체를 생성

        // WebSocket 연결이 열리면 호출됨
        socket.current.onopen = () => {
            console.log("WebSocket 연결됨");
        };

        // 서버로부터 메시지를 받으면 호출됨
        socket.current.onmessage = (event) => {
            // 서버에서 완료 메시지를 받으면 업로드 완료 상태로 변경
            const data = event.data;
            if (data.includes("Error")) {
                setUploadStatus("업로드 실패: " + data);
            } else {
                setUploadStatus("업로드 완료");
                console.log("서버로부터의 응답:", data);
            }
        };

        // WebSocket 연결이 종료되면 호출됨
        socket.current.onclose = () => {
            console.log("WebSocket 연결 종료");
            if (uploadStatus === "폴더 업로드 중...") {
                setUploadStatus("업로드 실패");
            }
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [folderPath]); // folderPath가 변경될 때만 이 useEffect가 실행됨


    const handleFileChange = (e) => {
        const files = e.target.files;
        const folderPaths = Array.from(files).map(file => file.webkitRelativePath);

        if (folderPaths.length > 0) {
            setFolderPath(folderPaths); // folderPath 설정
            setUploadStatus("폴더 업로드 중...");

            // 상태가 업데이트된 후에 WebSocket에 폴더 경로 전송
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                socket.current.send(JSON.stringify(folderPaths));
            }
        } else {
            setUploadStatus("파일이 선택되지 않았습니다.");
        }
    };

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

            <div className="container-fluid" style={{position: 'absolute', top: '260px', left: '150px'}}>
                <h4><b>Upload an original folder</b></h4>
                <h5><small className="text-body-secondary"><i>one folder</i></small></h5>
            </div>

            <div className="container-fluid" style={{position: 'absolute', top: '345px', left: '150px', width: '40%'}}>
                <div className="file-loading">
                    <input type="file" multiple webkitdirectory="true" onChange={handleFileChange} ref={fileInputRef}/>
                    <h5>상태: {uploadStatus}</h5>
                </div>
            </div>

            <div className="container-fluid" style={{position: 'absolute', top: '260px', left: '850px'}}>
                <h4><b>Select mutation options and operators</b></h4>
                    <h5><small className="text-body-secondary"><i>at least one option and one operator</i></small></h5>
                </div>

                <div className="container-fluid" style={{position: 'absolute', top: '330px', left: '850px'}}>
                    <div>
                        <label>Select options:</label>
                        <select multiple={true} onChange={handleOptionChange}>
                            <option value="-o">-o</option>
                            <option value="-p">-p</option>
                            <option value="-l">-l</option>
                            <option value="-rs-re">-rs-re</option>
                            <option value="-x">-x</option>
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
                                    Path to compilation database file:
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
                                <br/>
                                <label>
                                    Start Line:
                                    <input
                                        type="number"
                                        value={sline}
                                        onChange={(e) => setSLine(e.target.value)}/>
                                </label>
                                <label>
                                    End Line:
                                    <input
                                        type="number"
                                        value={eline}
                                        onChange={(e) => setELine(e.target.value)}/>
                                </label>
                            </div>
                        )}

                        {selectedOption.includes('-x') && (
                            <div>
                                <label>
                                    XFilename:
                                    <input
                                        type="text"
                                        value={Xfilename}
                                        onChange={(e) => setXFilename(e.target.value)}/>
                                </label>
                                <label>
                                    XLine:
                                    <input
                                        type="number"
                                        value={Xline}
                                        onChange={(e) => setXLine(e.target.value)}/>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                <div className="container-fluid" style={{position: 'absolute', left: '1150px', top: '330px'}}>
                    <label>Select operators:</label>
                    <select multiple={true} onChange={handleOptionChange}>
                        <option value="CRCR">CRCR</option>
                        <option value="OBBA">OBBA</option>
                        <option value="OAEA">OAEA</option>
                        <option value="OLAN">OLAN</option>
                        <option value="STRI">STRI</option>
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
