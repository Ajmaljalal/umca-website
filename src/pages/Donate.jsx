import React from 'react';
import PageHeader from '../components/PageHeader';
import './Donate.scss';

const donationPageUrl = 'https://www.zeffy.com/en-US/donation-form/support-umca-building-a-stronger-community-together';

const Donate = () => {
    return (
        <div className="donate-page">
            <PageHeader
                title="Donate"
                intro="Every gift helps us serve families through relief, education, and community programs. UMCA is a 501(c)(3) nonprofit, so your donation is tax-deductible."
            />

            <section className="section">
                <div className="container donate-grid">
                    <aside className="donate-notes">
                        <h2>Where your gift goes</h2>
                        <ul>
                            <li>Emergency relief and food for families in crisis</li>
                            <li>Education, youth development, and mentorship</li>
                            <li>Case management and wellness support</li>
                            <li>Community gatherings and interfaith programs</li>
                        </ul>
                        <p className="donate-secure">
                            Donations are processed securely by Zeffy.
                        </p>
                        <p className="donate-fallback">
                            Form not loading?{' '}
                            <a href={donationPageUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                                Open the donation page
                            </a>
                        </p>
                    </aside>

                    <div className="donate-form">
                        <iframe
                            title="Donation form powered and secured by Zeffy"
                            src="https://www.zeffy.com/embed/donation-form/support-umca-building-a-stronger-community-together"
                            allow="payment"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Donate;
