import React from 'react';
import Home from './page/Home';
import FaceRecognition from './page/FaceRecoginition';
import Navbar from './Navbar';
import { Route, Routes } from 'react-router-dom';
import Registration from './page/Registration';
import AttendanceTable from './page/AttendanceTable';
import FaceMatching from './page/FaceMatching';
import AllStudents from './page/AllStudents';

function App() {
  return (
  <div >
    <Navbar />
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/face-recoginition" element={<FaceRecognition />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/attendance-table" element={<AttendanceTable />} />
        <Route path="/automatic-matching" element={<FaceMatching />} />
                <Route path="/all-student" element={<AllStudents/>} />




        {/* Catch-all route for 404 pages */}
      </Routes>
    </div>
  );
}

export default App;