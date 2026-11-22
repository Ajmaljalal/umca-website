import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';
import './Footer.scss';
import logo from '../assets/logo.png';
import { contactInfo, socialLinks } from '../data/contact';

const socialIcons = {
    facebook: FaFacebookF,
    x: FaXTwitter,
    instagram: FaInstagram,
    youtube: FaYoutube
};

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <img src={logo} alt="" />
                        <span>United Muslim Community of America</span>
                    </Link>
                    <p>
                        A faith-based nonprofit serving families and neighbors through education,
                        relief, community support, and civic engagement.
                    </p>
                    <ul className="footer-social" aria-label="UMCA on social media">
                        {socialLinks.map(({ id, label, url }) => {
                            const Icon = socialIcons[id];
                            return (
                                <li key={id}>
                                    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
                                        <Icon aria-hidden="true" />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <nav className="footer-col" aria-label="Footer">
                    <h2>Explore</h2>
                    <ul>
                        <li><Link to="/about">About UMCA</Link></li>
                        <li><Link to="/programs">Programs</Link></li>
                        <li><Link to="/our-team">Our team</Link></li>
                        <li><Link to="/news">News</Link></li>
                        <li><Link to="/donate">Donate</Link></li>
                    </ul>
                </nav>

                <div className="footer-col">
                    <h2>Contact</h2>
                    <address>
                        <a href={contactInfo.mapUrl} target="_blank" rel="noopener noreferrer">
                            {contactInfo.street}<br />{contactInfo.cityLine}
                        </a>
                        <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                        <a href={`tel:${contactInfo.phoneHref}`}>{contactInfo.phone}</a>
                    </address>
                </div>
            </div>

            <div className="container footer-bottom">
                <small>© {new Date().getFullYear()} United Muslim Community of America. A 501(c)(3) nonprofit organization.</small>
            </div>
        </footer>
    );
};

export default Footer;
