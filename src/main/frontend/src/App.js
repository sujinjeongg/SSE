import React from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import CreateProject from "./components/create_project";
import Result from "./components/result";

function App() {
   return (
       <Router>
           <Routes>
               <Route path="/" element={<CreateProject />} />
               <Route path="/result" element={<Result />} />
           </Routes>
       </Router>
   );
}

export default App;