import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <i className="fas fa-terminal"></i>
          <span>LazyVim Polls</span>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link active">Dashboard</a>
          <a href="#" className="nav-link">My Polls</a>
          <a href="#" className="nav-link">Analytics</a>
          <a href="#" className="nav-link">Settings</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
