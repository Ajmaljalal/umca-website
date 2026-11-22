import React from 'react';
import PageHeader from '../components/PageHeader';
import './OurTeam.scss';

import habibullah_ziar from '../assets/team/habbibullah_ziar.jpg';
import Naimatyar from '../assets/team/Naimatyar.png';
import Shafiq from '../assets/team/Shafiq.png';
import Mumtaz from '../assets/team/Mumtaz.jpeg';
import sahil from '../assets/team/sahil.png';
import Najib from '../assets/team/Najib.png';
import zakir from '../assets/team/zakir.png';
import anas from '../assets/team/anas.png';

const president = {
    name: 'Habibullah Ziar',
    position: 'President',
    photo: habibullah_ziar,
    desc: 'Provides strategic leadership, oversees organizational affairs, and guides UMCA in advancing its mission and vision.'
};

const groups = [
    {
        title: 'Officers and directors',
        members: [
            {
                name: 'Niamat Rasool Niamatyar',
                position: 'Vice President',
                photo: Naimatyar,
                desc: 'Supports the President, coordinates organizational priorities, and helps advance UMCA’s mission and programs.'
            },
            {
                name: 'Mohammad Shafiq Quraishi',
                position: 'General Secretary',
                photo: Shafiq,
                desc: 'Oversees administration, maintains organizational records, and coordinates official communications and meetings.'
            },
            {
                name: 'Fazal Wahab Mumtaz',
                position: 'Director of Outreach',
                photo: Mumtaz,
                desc: 'Builds community connections, leads outreach initiatives, and strengthens UMCA’s engagement with stakeholders and partners.'
            },
            {
                name: 'Rohullah Sahil',
                position: 'Director of Tarbiyya & Capacity Building',
                photo: sahil,
                desc: 'Leads Tarbiyya and capacity development programs, fostering personal and spiritual growth and strengthening members’ knowledge and character.'
            },
            {
                name: 'Najibullah Shukoor',
                position: 'Director of Northeast Region',
                photo: Najib,
                desc: 'Leads regional activities, strengthens community engagement, and supports UMCA’s growth across the Northeast Region.'
            }
        ]
    },
    {
        title: 'UMCA Relief',
        members: [
            {
                name: 'Zakirullah Safi',
                position: 'CEO, UMCA Relief',
                photo: zakir,
                desc: 'Leads UMCA Relief’s mission and strategy, oversees humanitarian initiatives, builds partnerships, and mobilizes resources.'
            },
            {
                name: 'Anas Safi',
                position: 'COO, UMCA Relief',
                photo: anas,
                desc: 'Oversees UMCA Relief’s day-to-day operations, ensuring effective program delivery, coordination, and efficiency.'
            }
        ]
    }
];

const Member = ({ member }) => (
    <li className="team-member">
        <div className="team-photo">
            <img src={member.photo} alt={`Portrait of ${member.name}`} loading="lazy" />
        </div>
        <h3>{member.name}</h3>
        <p className="team-role">{member.position}</p>
        <p className="team-desc">{member.desc}</p>
    </li>
);

const OurTeam = () => {
    return (
        <div className="team-page">
            <PageHeader
                title="Our team"
                intro="The leaders who guide UMCA’s work and programs."
            />

            <section className="section">
                <div className="container">
                    <article className="team-lead">
                        <div className="team-lead-photo">
                            <img src={president.photo} alt={`Portrait of ${president.name}`} />
                        </div>
                        <div className="team-lead-text">
                            <p className="team-role">{president.position}</p>
                            <h2>{president.name}</h2>
                            <p>{president.desc}</p>
                        </div>
                    </article>

                    {groups.map(group => (
                        <div key={group.title} className="team-group">
                            <h2 className="team-group-title">{group.title}</h2>
                            <ul className="team-grid">
                                {group.members.map(member => <Member key={member.name} member={member} />)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default OurTeam;
