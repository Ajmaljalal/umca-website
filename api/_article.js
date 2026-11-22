// Keeps only the article fields the site uses.
const FIELDS = ['title', 'date', 'author', 'readTime', 'summary', 'image', 'content', 'quote', 'relatedImages'];

export const cleanArticle = (input = {}, { partial = false } = {}) => {
    const out = {};
    FIELDS.forEach(key => {
        if (input[key] !== undefined) out[key] = input[key];
    });
    if (typeof out.title === 'string') out.title = out.title.trim();
    if (typeof out.content === 'string') {
        out.content = out.content.split('\n\n').map(p => p.trim()).filter(Boolean);
    }
    if (out.relatedImages !== undefined && !Array.isArray(out.relatedImages)) {
        out.relatedImages = [];
    }
    if (!partial) {
        out.date = out.date || new Date().toISOString().split('T')[0];
        out.author = out.author || 'UMCA Team';
        out.readTime = out.readTime || '3 min read';
        out.summary = out.summary || '';
        out.content = out.content || [];
        out.relatedImages = out.relatedImages || [];
        out.quote = out.quote || null;
    }
    return out;
};
