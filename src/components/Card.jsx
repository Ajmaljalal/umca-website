import React from 'react';
import { Link } from 'react-router-dom';
import './Card.scss';

// Simple image + text card. When `link` is set, the whole card is one link.
const Card = ({ title, description, image, link, meta }) => {
    const body = (
        <>
            <div className="card-media">
                <img src={image} alt="" loading="lazy" />
            </div>
            <div className="card-body">
                {meta && <p className="card-meta">{meta}</p>}
                <h3 className="card-title">{title}</h3>
                {description && <p className="card-text">{description}</p>}
            </div>
        </>
    );

    return link ? (
        <Link to={link} className="card card-link">{body}</Link>
    ) : (
        <article className="card">{body}</article>
    );
};

export default Card;
