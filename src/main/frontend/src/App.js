import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
/* import { BrowserRouter as Router, Route, Routes } */ // github.io 배포시
import CreateProject from "./components/create_project";
import Result from "./components/result";

function App() {
   return (
       /*<BrowserRouter basename={process.env.PUBLIC_URL}>*/ // github.io 배포시
       <Router>
           <Routes>
               <Route path="/" element={<CreateProject />} />
               <Route path="/result" element={<Result />} />
           </Routes>
       </Router>
   );
}

export default App;