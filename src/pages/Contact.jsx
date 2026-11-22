import React from 'react';
import { FaLocationDot, FaEnvelope, FaPhone, FaFacebookF, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';
import PageHeader from '../components/PageHeader';
import { contactInfo, socialLinks } from '../data/contact';
import './Contact.scss';

const socialIcons = {
    facebook: FaFacebookF,
    x: FaXTwitter,
    instagram: FaInstagram,
    youtube: FaYoutube
};

const Contact = () => {
    return (
        <div className="contact-page">
            <PageHeader
                title="Contact us"
                intro="We welcome your questions, feedback, and involvement. Reach us by email or phone, or visit our center in Arlington."
            />

            <section className="section">
                <div className="container contact-grid">
                    <div className="contact-details">
                        <ul className="contact-methods">
                            <li>
                                <span className="contact-icon" aria-hidden="true"><FaEnvelope /></span>
                                <div>
                                    <h2>Email</h2>
                                    <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                                </div>
                            </li>
                            <li>
                                <span className="contact-icon" aria-hidden="true"><FaPhone /></span>
                                <div>
                                    <h2>Phone</h2>
                                    <a href={`tel:${contactInfo.phoneHref}`}>{contactInfo.phone}</a>
                                </div>
                            </li>
                            <li>
                                <span className="contact-icon" aria-hidden="true"><FaLocationDot /></span>
                                <div>
                                    <h2>Address</h2>
                                    <address>
                                        {contactInfo.street}<br />{contactInfo.cityLine}
                                    </address>
                                    <a href={contactInfo.mapUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                                        Get directions
                                    </a>
                                </div>
                            </li>
                        </ul>

                        <div className="contact-social">
                            <h2>Follow UMCA</h2>
                            <ul>
                                {socialLinks.map(({ id, label, handle, url }) => {
                                    const Icon = socialIcons[id];
                                    return (
                                        <li key={id}>
                                            <a href={url} target="_blank" rel="noopener noreferrer">
                                                <Icon aria-hidden="true" />
                                                <span>{label}</span>
                                                <span className="contact-handle">{handle}</span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="contact-map">
                        <iframe
                            title="Map showing UMCA at 3434 Washington Blvd, Arlington, VA"
                            src={contactInfo.mapEmbedUrl}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
