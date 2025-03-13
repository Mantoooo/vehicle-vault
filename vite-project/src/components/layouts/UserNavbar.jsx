import React from 'react';
// import './Navbar.css'; // Import the CSS file
import { FaSearch, FaUser } from 'react-icons/fa'; // Import icons from react-icons
import"../../assets/CSS/Navbar.css"

const UserNavbar = () => {
  return (
    <nav className="navbar">
      {/* Left Side */}
      <div className="left-side">
        <h1 className="website-name">Vehicle Vault</h1>
        <div className="nav-links">
          {/* <a href="/home" className="nav-link">Home</a> */}
          <a href="/new-cars" className="nav-link">New Cars</a>
          {/* <a href="/used-cars" className="nav-link">Used Cars</a> */}
          <a href="/reviews-news" className="nav-link">Reviews & News</a>
        </div>
      </div>
      {/* Right Side */}
      <div className="right-side">
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <FaSearch className="search-icon" />
        </div>
        <div className="login-icon">
          <FaUser />
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;