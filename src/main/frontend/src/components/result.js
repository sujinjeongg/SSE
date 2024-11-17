import React from 'react';
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Result() {
    const location = useLocation();
    const mutationResult = location.state?.mutationResult || "No result available";

    return (
        <div style={{position: 'relative'}}>
            <div className="container-fluid" style={{backgroundColor: '#000', color: 'white', padding: '20px'}}>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-light" style={{
                        width: '150px',
                        height: '30px',
                        fontSize: '0.9rem',
                        marginRight: '43px',
                        marginTop: '21px',
                        paddingTop: '0',
                        paddingBottom: '0'
                    }}>
                        <b>New Project</b>
                    </button>
                    <i className="bi bi-house-fill"
                       style={{fontSize: '2rem', marginRight: '26px', marginTop: '10px'}}></i>
                    <i className="bi bi-person-circle"
                       style={{fontSize: '2rem', marginRight: '25px', marginTop: '10px'}}></i>
                    <i className="bi bi-gear" style={{fontSize: '2rem', marginRight: '5px', marginTop: '10px'}}></i>
                </div>
                <h3 style={{marginTop: '30px'}}>Result</h3>
            </div>
            <div className="container-fluid"
                 style={{position: 'absolute', top: '220px', width: '50%', marginLeft: '590px'}}>
                <div className="row">
                    <div className="col">
                        <select className="form-select" aria-label="Default select example">
                            <option selected>input01_modified.c</option>
                            <option value="1">input02_modified.c</option>
                            <option value="2">input03_modified.c</option>
                            <option value="3">input04_modified.c</option>
                        </select>
                    </div>
                    <div className="col">
                        <button className="btn btn-primary" type="submit">Download.zip</button>
                    </div>
                </div>
            </div>
            <div className="card" style={{position: 'absolute', top: '280px', marginLeft: '430px', width: '50%'}}>
                <div className="card-header">
                    input01_modified.c
                </div>
                <div className="card-body">
                    <pre className="bg-light p-3" style={{height: '550px', overflowY: 'auto'}}>
                        <code>
                            {mutationResult}
                        </code>
                    </pre>
                    <a href="#" className="btn btn-primary">Edit</a>
                    <a href="#" className="btn btn-primary">Log Record</a>
                    <a href="#" className="btn btn-primary" style={{marginLeft: '500px'}}>Download</a>
                </div>
            </div>
        </div>

    );
}

export default Result;
