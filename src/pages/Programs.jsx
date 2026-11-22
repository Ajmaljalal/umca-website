import React from 'react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import serviceAreas from '../data/programs';
import './Programs.scss';

const umcaEntities = [
    { title: 'UMCA Relief', description: 'Humanitarian relief and emergency assistance, locally and globally.' },
    { title: 'UMCA Sisters', description: 'Programs and initiatives for women in our community.' },
    { title: 'UMCA Youth', description: 'Youth development, leadership, and engagement.' },
    { title: 'UMCA ASRA', description: 'Applied Social Research Association, supporting evidence-based programs.' },
    { title: 'UMCA Physicians', description: 'United Muslim Physicians of America, leading health and wellness initiatives.' },
    { title: 'UMCA Conventions', description: 'Community conventions and large gatherings.' },
    { title: 'UMCA Advocacy', description: 'Advocacy for fairness and civil rights.' },
    { title: 'UMCA Scholars', description: 'Scholarships and Islamic knowledge initiatives.' }
];

const Programs = () => {
    return (
        <div className="programs-page">
            <PageHeader
                title="Programs"
                intro="UMCA advances its mission through six service areas, carried out by dedicated entities for relief, women, youth, research, health, and more."
            />

            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <h2>Our service areas</h2>
                    </div>
                    <div className="program-list">
                        {serviceAreas.map(program => (
                            <article key={program.id} className="program-row">
                                <div className="program-media">
                                    <img src={program.image} alt="" loading="lazy" />
                                </div>
                                <div className="program-text">
                                    <h3>{program.title}</h3>
                                    <p>{program.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section section-tinted">
                <div className="container split">
                    <h2>UMCA entities</h2>
                    <div>
                        <p className="programs-lead">
                            UMCA establishes the following entities to carry out its mission.
                        </p>
                        <dl className="entity-list">
                            {umcaEntities.map(entity => (
                                <div key={entity.title}>
                                    <dt>{entity.title}</dt>
                                    <dd>{entity.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            <section className="cta-band">
                <div className="container cta-band-inner">
                    <div>
                        <h2>Take part or ask for help</h2>
                        <p>
                            Contact us to volunteer, partner on a program, or find support for yourself or your family.
                        </p>
                    </div>
                    <div className="cta-band-actions">
                        <Button to="/contact" variant="primary">Contact us</Button>
                        <Button to="/donate" variant="secondary">Donate</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Programs;
