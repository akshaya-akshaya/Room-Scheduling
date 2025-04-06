import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, SquareStack, DoorOpen, Clock } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <div className="w-56 min-h-screen bg-[#2B2730] text-white py-6">
      <div className="px-6 mb-8">
        <div className="h-20 w-full bg-gray-700 rounded-md"></div>
      </div>
      <nav className="space-y-1 px-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-white text-[#9575DE]'
                : 'text-gray-300 hover:bg-white hover:text-[#9575DE]'
            }`
          }
        >
          <Calendar size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink
          to="/shifts"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-white text-[#9575DE]'
                : 'text-gray-300 hover:bg-white hover:text-[#9575DE]'
            }`
          }
        >
          <Clock size={20} />
          <span>Shift</span>
        </NavLink>
        
        <NavLink
          to="/blocks"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-white text-[#9575DE]'
                : 'text-gray-300 hover:bg-white hover:text-[#9575DE]'
            }`
          }
        >
          <SquareStack size={20} />
          <span>Blocks</span>
        </NavLink>
        
        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-white text-[#9575DE]'
                : 'text-gray-300 hover:bg-white hover:text-[#9575DE]'
            }`
          }
        >
          <DoorOpen size={20} />
          <span>Rooms</span>
        </NavLink>
        
        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-white text-[#9575DE]'
                : 'text-gray-300 hover:bg-white hover:text-[#9575DE]'
            }`
          }
        >
          <Calendar size={20} />
          <span>Room Schedule</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;