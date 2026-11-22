import React from 'react';
import Button from './Button';
import './Hero.scss';

const Hero = () => {
    return (
        <section className="hero" aria-labelledby="hero-title">
            <div className="container hero-inner">
                <p className="hero-org">United Muslim Community of America</p>
                <h1 id="hero-title" className="hero-title">
                    <span>Faith.</span>
                    <span>Identity.</span>
                    <span>Service.</span>
                </h1>
                <p className="hero-lead">
                    A faith-based nonprofit serving families and neighbors across America through
                    education, humanitarian relief, community support, and civic engagement.
                </p>
                <div className="hero-actions">
                    <Button to="/programs" variant="primary">Explore our programs</Button>
                    <Button to="/donate" variant="secondary">Donate</Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
