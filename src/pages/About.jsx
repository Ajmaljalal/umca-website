import React from 'react';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import aboutUsLogo from '../assets/aboutUsLogo.png';
import './About.scss';

const missionGoals = [
    'Promote Islamic education, moral development, and spiritual growth',
    'Strengthen families and communities through support, empowerment, and service',
    'Advance social justice, civil liberties, and human dignity',
    'Provide humanitarian relief and charitable services locally and globally',
    'Foster unity within the Ummah and cooperation with broader society'
];

const coreValues = [
    { title: 'Faith & guidance', desc: "The Qur'an and Sunnah as our foundation." },
    { title: 'Collective leadership', desc: 'Consultation (Shura) and shared responsibility.' },
    { title: 'Integrity', desc: 'Transparency, accountability, and ethical conduct.' },
    { title: 'Justice & compassion', desc: 'Standing with the vulnerable and oppressed.' },
    { title: 'Service excellence', desc: 'Professional, culturally responsive, and impact-driven work.' },
    { title: 'Community outreach', desc: 'Building bridges through interfaith dialogue and engagement.' }
];

const governance = [
    { title: 'Board of Trustees', desc: 'The highest governing authority, with full fiduciary, strategic, and oversight powers.' },
    { title: 'Council of Directors', desc: 'Serves as the Board of Directors for U.S. nonprofit law and regulatory compliance.' },
    { title: 'Central Executive Council', desc: 'The policy-making body that advises the President and sets working procedures.' },
    { title: 'Officers', desc: 'President (Board Chair), Vice Presidents, General Secretary, and Treasurer.' },
    { title: 'General Assembly', desc: 'The highest representative and consultative body of UMCA.' },
    { title: 'Regional Organizations', desc: 'UMCA operates in the Northeast, South, Mid-West, and West regions.' }
];

const About = () => {
    return (
        <div className="about-page">
            <PageHeader
                title="About UMCA"
                intro="A faith-based nonprofit serving humanity with compassion, dignity, justice, and excellence."
            >
                <img src={aboutUsLogo} alt="" className="about-header-logo" />
            </PageHeader>

            <section className="section">
                <div className="container split">
                    <h2>Who we are</h2>
                    <div>
                        <div className="prose">
                            <p>
                                The United Muslim Community of America (UMCA) is a faith-based nonprofit organization
                                organized exclusively for religious, educational, charitable, and social purposes under
                                Section 501(c)(3) of the Internal Revenue Code. Established in 2025, UMCA seeks the
                                pleasure of Allah (SWT) by serving humanity with compassion, dignity, justice, and excellence.
                            </p>
                            <p>
                                Guided by the Qur'an and Sunnah, UMCA is committed to collective decision-making,
                                transparency, accountability, and service to the broader society. We serve all people
                                regardless of faith, ethnicity, or background, with a special focus on our neighborhoods
                                across America.
                            </p>
                        </div>
                        <dl className="about-facts">
                            <div>
                                <dt>Established</dt>
                                <dd>2025</dd>
                            </div>
                            <div>
                                <dt>Status</dt>
                                <dd>501(c)(3) nonprofit</dd>
                            </div>
                            <div>
                                <dt>Regions</dt>
                                <dd>Northeast, South, Mid-West, West</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            <section className="section section-tinted">
                <div className="container about-vm">
                    <div className="about-vision">
                        <h2>Our vision</h2>
                        <p>
                            To seek the pleasure of Allah (SWT) by building compassionate, just, and resilient
                            communities, rooted in Islamic values and committed to the well-being of humanity.
                        </p>
                    </div>
                    <div className="about-mission">
                        <h2>Our mission</h2>
                        <ul className="about-goals">
                            {missionGoals.map(goal => <li key={goal}>{goal}</li>)}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <h2>Our core values</h2>
                        <p>The principles that guide our work and our community.</p>
                    </div>
                    <ul className="about-values">
                        {coreValues.map(value => (
                            <li key={value.title}>
                                <h3>{value.title}</h3>
                                <p>{value.desc}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="section section-tinted">
                <div className="container split">
                    <h2>How UMCA is governed</h2>
                    <div>
                        <p className="about-lead">
                            A structured leadership system keeps UMCA accountable and transparent.
                        </p>
                        <dl className="about-governance">
                            {governance.map(item => (
                                <div key={item.title}>
                                    <dt>{item.title}</dt>
                                    <dd>{item.desc}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container split">
                    <h2>Our commitment to inclusion</h2>
                    <div className="prose">
                        <p>
                            UMCA does not discriminate on the basis of race, color, ethnicity, national origin, gender,
                            age, disability, or any other characteristic protected by law in its programs, services, or
                            activities. Our religious principles are carried out in a manner consistent with the laws of
                            the United States, and we do not restrict access to our charitable services based on faith,
                            ethnicity, or belief.
                        </p>
                    </div>
                </div>
            </section>

            <section className="cta-band">
                <div className="container cta-band-inner">
                    <div>
                        <h2>Join our community</h2>
                        <p>
                            Whether you are looking for spiritual guidance, educational programs, or community
                            support, UMCA welcomes you.
                        </p>
                    </div>
                    <div className="cta-band-actions">
                        <Button to="/contact" variant="primary">Get in touch</Button>
                        <Button to="/programs" variant="secondary">Explore our programs</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
