import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Button from '../components/Button';
import serviceAreas from '../data/programs';
import { fetchNews } from '../services/api';
import { formatDate } from '../utils/format';
import './Home.scss';

const Home = () => {
    const [latestNews, setLatestNews] = useState([]);

    useEffect(() => {
        let active = true;
        fetchNews()
            .then(items => { if (active) setLatestNews(items.slice(0, 3)); })
            .catch(() => {});
        return () => { active = false; };
    }, []);

    return (
        <>
            <Hero />

            <section className="section">
                <div className="container split">
                    <h2>Our mission</h2>
                    <div>
                        <p className="home-mission-statement">
                            To seek the pleasure of Allah (SWT) by serving humanity with compassion, dignity,
                            justice, and excellence, guided by the Qur'an and Sunnah, collective decision-making,
                            transparency, accountability, and service to the broader society.
                        </p>
                        <Link to="/about" className="text-link">Learn about UMCA</Link>
                    </div>
                </div>
            </section>

            <section className="section section-tinted">
                <div className="container">
                    <div className="home-section-head">
                        <div className="section-head">
                            <h2>Where we serve</h2>
                            <p>Six service areas carry our mission into the community, from case management to civil rights.</p>
                        </div>
                        <Link to="/programs" className="text-link">See all programs</Link>
                    </div>
                    <div className="home-programs-grid">
                        {serviceAreas.map(program => (
                            <Card
                                key={program.id}
                                title={program.title}
                                description={program.summary}
                                image={program.image}
                                link="/programs"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {latestNews.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="home-section-head">
                            <div className="section-head">
                                <h2>Latest news</h2>
                                <p>Reports from our relief work, programs, and community events.</p>
                            </div>
                            <Link to="/news" className="text-link">All news</Link>
                        </div>
                        <div className="home-news-grid">
                            {latestNews.map(item => (
                                <Card
                                    key={item.id}
                                    title={item.title}
                                    description={item.summary}
                                    image={item.image}
                                    meta={formatDate(item.date)}
                                    link={`/news/${item.id}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="cta-band">
                <div className="container cta-band-inner">
                    <div>
                        <h2>Support the work</h2>
                        <p>
                            Your gift funds emergency relief, education, and family support.
                            UMCA is a 501(c)(3) nonprofit, so donations are tax-deductible.
                        </p>
                    </div>
                    <div className="cta-band-actions">
                        <Button to="/donate" variant="primary">Donate</Button>
                        <Button to="/contact" variant="secondary">Contact us</Button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
