import communitySupportImg from '../assets/programs/Community support.jpeg';
import educationImg from '../assets/programs/education.jpeg';
import humanitarianReliefImg from '../assets/programs/humanitarian relief.png';
import interfaithEngagementImg from '../assets/programs/interfaith engagement.png';
import communityGatheringsImg from '../assets/programs/community gatherings.jpeg';
import advocacyImg from '../assets/programs/advocacy.jpeg';

// `summary` is the short line used on the home page; `description` is the full text on Programs.
export const serviceAreas = [
    {
        id: 1,
        title: 'Community Support, Wellness & Case Management',
        summary: 'Case management, referrals, and wellness and mental health resources for individuals and families.',
        description: 'Providing support for individuals and families through case management, referrals, wellness initiatives, mental health resources, and social services that promote overall health, stability, and wellbeing.',
        image: communitySupportImg,
        link: '/programs'
    },
    {
        id: 2,
        title: 'Education, Training & Youth Development',
        summary: 'Islamic and contemporary education, vocational training, leadership, and mentorship.',
        description: 'Empowering youth and adults through Islamic and contemporary education, vocational training, leadership development, and mentorship opportunities.',
        image: educationImg,
        link: '/programs'
    },
    {
        id: 3,
        title: 'Humanitarian Relief & Emergency Assistance',
        summary: 'Emergency aid, food programs, and disaster response for families facing crisis.',
        description: 'Providing timely aid and compassionate support to individuals and families facing crises through emergency assistance, food programs, disaster response, and community-based relief efforts.',
        image: humanitarianReliefImg,
        link: '/programs'
    },
    {
        id: 4,
        title: 'Interfaith Engagement & Civic Participation',
        summary: 'Building understanding across faiths and helping members take part in civic life.',
        description: 'Building bridges of understanding, fostering meaningful relationships, and empowering community members to engage in service, leadership, and civic initiatives that strengthen our society and promote the common good.',
        image: interfaithEngagementImg,
        link: '/programs'
    },
    {
        id: 5,
        title: 'Community Gatherings, Cultural & Religious Programs',
        summary: 'Religious events, cultural programs, and family gatherings that bring the community together.',
        description: 'Creating meaningful opportunities for connection, learning, and celebration through religious events, cultural programs, family activities, and community gatherings that promote unity, belonging, and shared values.',
        image: communityGatheringsImg,
        link: '/programs'
    },
    {
        id: 6,
        title: 'Advocacy for Fairness & Civil Rights',
        summary: 'Advocacy and education for justice, equal rights, and an inclusive society.',
        description: 'Promoting justice, fairness, and equal rights through advocacy, education, and community empowerment, while fostering a more inclusive and equitable society for all.',
        image: advocacyImg,
        link: '/programs'
    }
];

export default serviceAreas;
