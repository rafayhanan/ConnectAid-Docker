import React from "react";
import './NavBar.css';
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navbar bg-black text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-black lg:text-[20px] sm:text-[20px] xs:text-[20px] text-[20px] lg:leading-[30px] mt-2 text-white hover:cursor-pointer">ConnectAid</h1>
          <ul className="flex space-x-8">
            <li className="nav-item">
              <Link to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

export default NavBar;