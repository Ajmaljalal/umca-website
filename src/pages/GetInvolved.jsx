import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import './GetInvolved.scss';

const ways = [
    { title: 'Become a member', desc: 'Join the UMCA community and take part in our programs and decisions.', to: '/contact', action: 'Contact us to join' },
    { title: 'Volunteer', desc: 'Give your time to relief drives, youth programs, and community events.', to: '/contact', action: 'Offer to volunteer' },
    { title: 'Donate', desc: 'Fund relief, education, and family support. Gifts are tax-deductible.', to: '/donate', action: 'Make a donation' },
    { title: 'Partner with us', desc: 'Organizations and mosques can collaborate with UMCA on programs and outreach.', to: '/contact', action: 'Start a partnership' }
];

const GetInvolved = () => {
    return (
        <div className="involved-page">
            <PageHeader
                title="Get involved"
                intro="UMCA’s strength is its people. Here is how you can take part in the work."
            />
            <section className="section">
                <div className="container">
                    <ul className="involved-list">
                        {ways.map(way => (
                            <li key={way.title}>
                                <h2>{way.title}</h2>
                                <p>{way.desc}</p>
                                <Link to={way.to} className="text-link">{way.action}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default GetInvolved;
