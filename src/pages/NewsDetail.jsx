import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaXmark, FaChevronLeft, FaChevronRight, FaLink, FaCheck, FaPen, FaTrashCan } from 'react-icons/fa6';
import { fetchNewsById, fetchNews, updateNews, deleteNews } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import NewsModal from '../components/NewsModal';
import { formatDate } from '../utils/format';
import './NewsDetail.scss';

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [article, setArticle] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        (async () => {
            try {
                const data = await fetchNewsById(id);
                if (!active) return;
                setArticle(data);
                const allNews = await fetchNews();
                if (active) setRelatedNews(allNews.filter(item => String(item.id) !== String(id)).slice(0, 3));
            } catch (err) {
                if (active) setError('This article could not be found. It may have been removed.');
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, [id]);

    const photos = article?.relatedImages || [];

    useEffect(() => {
        if (lightboxIndex === null) return undefined;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setLightboxIndex(null);
            if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev + 1) % photos.length);
            if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev - 1 + photos.length) % photos.length);
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightboxIndex, photos.length]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (e) {
            window.prompt('Copy this link:', window.location.href);
        }
    };

    // Errors are thrown back to the modal so it can show them next to the form
    const handleSaveEdit = async (formData) => {
        const updated = await updateNews(article.id, formData);
        setArticle(updated);
    };

    const handleDeleteArticle = async () => {
        const confirmed = window.confirm(`Delete "${article.title}"? This also removes its photos and cannot be undone.`);
        if (!confirmed) return;
        try {
            await deleteNews(article.id);
            navigate('/news');
        } catch (err) {
            alert('Could not delete the article: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="container article-status">
                <p>Loading article…</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="container article-status">
                <h1>Article not found</h1>
                <p>{error}</p>
                <Button to="/news" variant="outline">Back to news</Button>
            </div>
        );
    }

    return (
        <article className="article-page">
            <header className="article-header">
                <div className="container article-wide">
                    <Link to="/news" className="article-back">
                        <FaArrowLeft aria-hidden="true" /> All news
                    </Link>
                    <h1>{article.title}</h1>
                    {article.summary && <p className="article-summary">{article.summary}</p>}
                    <div className="article-byline">
                        <p>
                            <span>{article.author || 'UMCA Team'}</span>
                            <time dateTime={article.date}>{formatDate(article.date)}</time>
                        </p>
                        <div className="article-tools">
                            {user && (
                                <>
                                    <button type="button" onClick={() => setEditModalOpen(true)}>
                                        <FaPen aria-hidden="true" /> Edit
                                    </button>
                                    <button type="button" className="is-danger" onClick={handleDeleteArticle}>
                                        <FaTrashCan aria-hidden="true" /> Delete
                                    </button>
                                </>
                            )}
                            <button type="button" onClick={handleCopyLink} aria-live="polite">
                                {copied
                                    ? <><FaCheck aria-hidden="true" /> Link copied</>
                                    : <><FaLink aria-hidden="true" /> Copy link</>}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container article-cover-wrap">
                <img src={article.image} alt="" className="article-cover" />
            </div>

            <div className="container article-narrow article-body">
                {article.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}

                {article.quote && article.quote.text && (
                    <blockquote className="article-quote">
                        <p>{article.quote.text}</p>
                        {article.quote.author && (
                            <footer>
                                <cite>{article.quote.author}</cite>
                                {article.quote.role && <span>, {article.quote.role}</span>}
                            </footer>
                        )}
                    </blockquote>
                )}
            </div>

            {photos.length > 1 && (
                <section className="container article-gallery" aria-labelledby="gallery-title">
                    <h2 id="gallery-title">Photos</h2>
                    <ul>
                        {photos.map((photo, idx) => (
                            <li key={`${photo.url}-${idx}`}>
                                <button type="button" onClick={() => setLightboxIndex(idx)} aria-label={`Open photo ${idx + 1} of ${photos.length}`}>
                                    <img src={photo.url} alt="" loading="lazy" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="cta-band article-cta">
                <div className="container cta-band-inner">
                    <div>
                        <h2>Help us do more of this work</h2>
                        <p>Your donation funds relief, education, and support for families.</p>
                    </div>
                    <div className="cta-band-actions">
                        <Button to="/donate" variant="primary">Donate</Button>
                        <Button to="/contact" variant="secondary">Get involved</Button>
                    </div>
                </div>
            </section>

            {relatedNews.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="section-head">
                            <h2>More news</h2>
                        </div>
                        <div className="article-related">
                            {relatedNews.map(item => (
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

            {lightboxIndex !== null && photos[lightboxIndex] && (
                <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLightboxIndex(null)}>
                    <button type="button" className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close photo viewer">
                        <FaXmark />
                    </button>
                    <img
                        src={photos[lightboxIndex].url}
                        alt={photos[lightboxIndex].title || ''}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {photos.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="lightbox-nav is-prev"
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + photos.length) % photos.length); }}
                                aria-label="Previous photo"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                type="button"
                                className="lightbox-nav is-next"
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % photos.length); }}
                                aria-label="Next photo"
                            >
                                <FaChevronRight />
                            </button>
                            <p className="lightbox-count">{lightboxIndex + 1} / {photos.length}</p>
                        </>
                    )}
                </div>
            )}

            <NewsModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleSaveEdit}
                initialData={article}
                currentUser={user}
            />
        </article>
    );
};

export default NewsDetail;
