import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css'; // Reusing styles

const AccountDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="account-menu-container">
      <button className="account-menu-button" onClick={() => setIsOpen(!isOpen)}>
        <span className="account-icon">{user?.name?.charAt(0)}</span>
        <span>{user?.name}</span>
        <span className="arrow">...</span>
      </button>
      {isOpen && (
        <div className="account-dropdown">
          <button onClick={logout} className="dropdown-item">Logout</button>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;