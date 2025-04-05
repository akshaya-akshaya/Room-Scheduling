import React from 'react';
import { NavLink } from 'react-router-dom';
import {Clock, SquareStack, DoorOpen, Calendar } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <div className="w-56 min-h-screen bg-gray-800 text-white py-6">
      <div className="px-6 mb-8">
        <div className="h-20 w-full bg-gray-700 rounded-md"></div>
      </div>
      <nav className="space-y-1 px-3">
        <NavLink
          to="/shifts"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <Clock size={20} />
          <span>Shifts</span>
        </NavLink>
        
        <NavLink
          to="/blocks"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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