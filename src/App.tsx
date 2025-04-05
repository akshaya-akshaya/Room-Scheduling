import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScheduleProvider } from './context/ScheduleContext';
import Navbar from './components/Navbar';
import ShiftPage from './pages/ShiftPage';
import BlockPage from './pages/BlockPage';
import RoomPage from './pages/RoomPage';
import RoomSchedulePage from './pages/RoomSchedulePage';

function App() {
  return (
    <Router>
      <ScheduleProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/shifts" replace />} />
              <Route path="/shifts" element={<ShiftPage />} />
              <Route path="/blocks" element={<BlockPage />} />
              <Route path="/rooms" element={<RoomPage />} />
              <Route path="/schedule" element={<RoomSchedulePage />} />
            </Routes>
          </div>
        </div>
      </ScheduleProvider>
    </Router>
  );
}

export default App;