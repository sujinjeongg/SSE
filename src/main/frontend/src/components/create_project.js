import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'mdb-ui-kit/css/mdb.min.css';

function CreateProject() {
    const [uploadStatus, setUploadStatus] = useState("폴더 업로드 준비중...")
    const [folderPath, setFolderPath] = useState("");

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

            <div className="container-fluid d-flex justify-content-center" style={{position: 'absolute', top: '550px'}}>
                <div className="dropdown">
                    <button className="btn btn-dark dropdown-toggle" type="button" id="dropdownOptionsButton"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        options
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownOptionsButton">
                        {['-o', '-p', '-l', '-rs -re', '-x', '-m'].map((option, index) => (
                            <li key={index}>
                                <a className="dropdown-item" href="#" data-bs-toggle="tooltip" title="description">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id={`option${index}`}/>
                                        <label className="form-check-label" htmlFor={`option${index}`}>{option}</label>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="container-fluid d-flex justify-content-center" style={{position: 'absolute', top: '590px'}}>
                <div className="dropdown">
                    <button className="btn btn-dark dropdown-toggle" type="button" id="dropdownOperatorsButton"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        operators
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownOperatorsButton">
                        {['osln', 'obaa', 'orsn', 'obbb', 'ossn', 'oabb'].map((operator, index) => (
                            <li key={index}>
                                <a className="dropdown-item" href="#" data-bs-toggle="tooltip" title="description">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id={`operator${index}`}/>
                                        <label className="form-check-label"
                                               htmlFor={`operator${index}`}>{operator}</label>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="container-fluid d-flex justify-content-center"
                 style={{position: 'absolute', top: '720px', paddingBottom: '30px'}}>
                <button className="btn btn-dark" type="submit">Generate</button>
            </div>
        </div>
    );
}

export default CreateProject;
