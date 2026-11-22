import React, { useEffect, useState } from 'react';
import { FaPlus, FaPen, FaTrashCan, FaDownload, FaCircleCheck } from 'react-icons/fa6';
import Card from '../components/Card';
import NewsModal from '../components/NewsModal';
import PageHeader from '../components/PageHeader';
import { fetchNews, createNews, updateNews, deleteNews, exportNewsData } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/format';
import './News.scss';

const News = () => {
    const { user } = useAuth();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchNews()
            .then(setNews)
            .catch(error => console.error('Failed to fetch news', error))
            .finally(() => setLoading(false));
    }, []);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleOpenAdd = () => {
        setEditingArticle(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (article) => {
        setEditingArticle(article);
        setModalOpen(true);
    };

    // Errors are thrown back to the modal so it can show them next to the form
    const handleSaveArticle = async (formData) => {
        if (editingArticle) {
            const updated = await updateNews(editingArticle.id, formData);
            setNews(prev => prev.map(item => item.id === updated.id ? updated : item));
            showToast('Article updated');
        } else {
            const created = await createNews(formData);
            setNews(prev => [created, ...prev]);
            showToast('Article published');
        }
    };

    const handleDelete = async (id, title) => {
        const confirmed = window.confirm(`Delete "${title}"? This also removes its photos and cannot be undone.`);
        if (!confirmed) return;
        try {
            await deleteNews(id);
            setNews(prev => prev.filter(item => item.id !== id));
            showToast('Article deleted');
        } catch (err) {
            alert('Could not delete the article: ' + err.message);
        }
    };

    return (
        <div className="news-page">
            <PageHeader
                title="News"
                intro="Reports from our relief work, programs, and community events."
            />

            {toastMessage && (
                <div className="news-toast" role="status">
                    <FaCircleCheck aria-hidden="true" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <section className="section">
                <div className="container">
                    {user && (
                        <div className="news-admin-bar">
                            <p>
                                Signed in as <strong>{user.name}</strong>. Changes you publish appear on the site within a minute.
                            </p>
                            <div className="news-admin-actions">
                                <button type="button" className="button outline" onClick={() => exportNewsData()}>
                                    <FaDownload aria-hidden="true" /> Download backup
                                </button>
                                <button type="button" className="button primary" onClick={handleOpenAdd}>
                                    <FaPlus aria-hidden="true" /> New article
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <p className="news-status">Loading news…</p>
                    ) : news.length === 0 ? (
                        <div className="news-empty">
                            <h2>No news yet</h2>
                            <p>
                                {user
                                    ? 'Publish the first article with the New article button.'
                                    : 'Check back soon for updates from UMCA.'}
                            </p>
                        </div>
                    ) : (
                        <ul className="news-grid">
                            {news.map(item => (
                                <li key={item.id} className="news-item">
                                    <Card
                                        title={item.title}
                                        description={item.summary}
                                        image={item.image}
                                        meta={formatDate(item.date)}
                                        link={`/news/${item.id}`}
                                    />
                                    {user && (
                                        <div className="news-item-admin">
                                            <button type="button" onClick={() => handleOpenEdit(item)}>
                                                <FaPen aria-hidden="true" /> Edit
                                            </button>
                                            <button type="button" className="is-danger" onClick={() => handleDelete(item.id, item.title)}>
                                                <FaTrashCan aria-hidden="true" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            <NewsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveArticle}
                initialData={editingArticle}
                currentUser={user}
            />
        </div>
    );
};

export default News;
