import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import './Navbar.scss';
import logo from '../assets/logo.png';

const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/programs', label: 'Programs' },
    { to: '/our-team', label: 'Our Team' },
    { to: '/news', label: 'News' },
    { to: '/contact', label: 'Contact' }
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    // Close the mobile menu and return to the top on every page change
    useEffect(() => {
        setIsOpen(false);
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const linkClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`;

    return (
        <header className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo" aria-label="UMCA home">
                    <img src={logo} alt="" className="nav-logo-img" />
                    <span className="nav-logo-text">UMCA</span>
                </Link>

                <button
                    type="button"
                    className="nav-toggle"
                    onClick={() => setIsOpen(open => !open)}
                    aria-expanded={isOpen}
                    aria-controls="site-menu"
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>

                <nav id="site-menu" className={`nav-menu${isOpen ? ' is-open' : ''}`} aria-label="Main">
                    <ul className="nav-links">
                        {links.map(link => (
                            <li key={link.to}>
                                <NavLink to={link.to} end={link.end} className={linkClass}>{link.label}</NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="nav-actions">
                        {user ? (
                            <div className="nav-user">
                                <span className="nav-user-name" title={`Signed in as ${user.name} (${user.role})`}>
                                    {user.name}
                                </span>
                                <button type="button" onClick={logout} className="nav-signout">Sign out</button>
                            </div>
                        ) : (
                            <NavLink to="/login" className={linkClass}>Staff login</NavLink>
                        )}
                        <Button to="/donate" variant="primary" className="nav-donate">Donate</Button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
