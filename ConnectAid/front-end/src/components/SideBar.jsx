import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  PlusIcon,
  HeartIcon,
  UserCircleIcon,
  XMarkIcon,
  Squares2X2Icon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import WalletPopup from './WalletPopup';

const Sidebar = ({ isOpen, onClose, userName }) => {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  return (
    <>
    <div
      className={`sidebar-container bg-white border-r border-gray-200 h-screen p-4 w-64 fixed top-0 left-0 z-50 flex flex-col 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}
    >
      <div className="sidebar-header mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-800 text-xl font-bold">Menu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">Welcome,</p>
          <p className="font-medium text-gray-800">{userName}</p>
        </div>
      </div>

      <nav className="space-y-4">
        {/* Browse Donations */}
        <NavLink
          to="/main"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </NavLink>

        {/* My Appeals */}
        <NavLink
          to="/main/my-appeals"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Squares2X2Icon className="h-5 w-5" />
          <span>My Donation Appeals</span>
        </NavLink>

        {/* My Contributions */}
        <NavLink
          to="/main/my-contributions"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <HeartIcon className="h-5 w-5" />
          <span>My Contributions</span>
        </NavLink>

        {/* Create Appeal */}
        <NavLink
          to="/main/add-donation"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Appeal</span>
        </NavLink>

        {/* Wallet */}
        <button
            onClick={()=>{setIsWalletOpen(true)}}
            className="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100 w-full"
          >
            <WalletIcon className="h-5 w-5" />
            <span>Wallet</span>
          </button>

        {/* Profile */}
        <NavLink
          to="/main/edit-profile"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <UserCircleIcon className="h-5 w-5" />
          <span>Edit Profile</span>
        </NavLink>
      </nav>
    </div>

    <WalletPopup 
    isOpen={isWalletOpen} 
    onClose={() => setIsWalletOpen(false)} 
    />
    </>
  );
};

export default Sidebar;
