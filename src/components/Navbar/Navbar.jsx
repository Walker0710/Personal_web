import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

function Navbar() {

    return (
        <div className='full-nav'>
            <div className='navbar'>
                <div className='navbar-container'>
                    <Link to='/' className='navbar-logo'>
                        {/* <img className='logo-yoo' src={Logo} alt="logo" /> */}
                        <i class='fab fa-typo3' />
                    </Link>

                    <ul className='nav-menu'>
                        <li className='nav-item'>
                            <a href='#home-all' className='nav-links'>Home</a>
                        </li>
                        <li className='nav-item'>
                            <a href='#intro' className='nav-links'>About</a>
                        </li>
                        <li className='nav-item'>
                            <a href='#work' className='nav-links'>Projects</a>
                        </li>
                        <li className='nav-item'>
                            <a href='/projects' className='nav-links'>Blogs</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;



