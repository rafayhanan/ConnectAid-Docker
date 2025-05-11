import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-16 bg-black border-b border-gray-200 flex items-center px-4 shadow-sm">
      <button className="mr-4 focus:outline-none" onClick={onToggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 className="text-xl font-bold text-white">ConnectAid</h1>
      <div className="ml-auto flex items-center space-x-4">
        <button className="text-white hover:text-blue-600 font-semibold focus:outline-none" onClick={()=>{navigate("/login")}}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
