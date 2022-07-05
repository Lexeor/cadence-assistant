import React from 'react';
import 'remixicon/fonts/remixicon.css';

function Navbar() {
  return (
    <div className="container container-navbar">
        <div className="navbar-left">
            <div className="btn-icon btn-menu">
                <i className="ri-menu-line"></i>
            </div>
        </div>
        <div className="navbar-center">
            Center
        </div>
        <div className="navbar-right">
            <button className="btn btn-login"><i className="ri-user-3-line"></i>Login</button>
            <div className="btn-icon">
                <i className="ri-search-line"></i>
            </div>
            <div className="btn-icon">
                <i className="ri-notification-4-line"></i>
            </div>
            <div className="btn-icon">
                <i className="ri-shopping-cart-2-line"></i>
            </div>
        </div>
    </div>
  )
}

export default Navbar