import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CreateProject from "./components/create_project";
import Result from "./components/result";

function App() {
   return (
       <BrowserRouter basename={process.env.PUBLIC_URL}>
           <Routes>
               <Route path="/SSE" element={<CreateProject />} />
               <Route path="/result" element={<Result />} />
           </Routes>
       </BrowserRouter>
   );
}

export default App;