// GET    /api/news/:id   one article (public)
// PUT    /api/news/:id   update (admin only); deletes pictures that were removed
// DELETE /api/news/:id   delete (admin only) together with its pictures
import { requireUser } from '../_auth.js';
import { readNews, writeNews, sendJson, readBody, deletePictures, picturesOf } from '../_store.js';
import { cleanArticle } from '../_article.js';

export default async function handler(req, res) {
    const id = String(req.query.id || '');
    try {
        if (req.method === 'GET') {
            const fresh = String(req.query.fresh || '') === '1';
            const articles = await readNews({ fresh });
            const article = articles.find(a => String(a.id) === id);
            if (!article) return sendJson(res, 404, { error: 'Article not found' });
            return sendJson(res, 200, article,
                fresh ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=300');
        }

        if (req.method === 'PUT') {
            if (!requireUser(req, res)) return;
            const fields = cleanArticle(await readBody(req), { partial: true });
            const articles = await readNews({ fresh: true });
            const idx = articles.findIndex(a => String(a.id) === id);
            if (idx === -1) return sendJson(res, 404, { error: 'Article not found' });

            const before = articles[idx];
            const updated = { ...before, ...fields, id: before.id, updatedAt: new Date().toISOString() };
            articles[idx] = updated;
            await writeNews(articles);

            const stillUsed = new Set(picturesOf(updated));
            await deletePictures(picturesOf(before).filter(url => !stillUsed.has(url)));
            return sendJson(res, 200, updated);
        }

        if (req.method === 'DELETE') {
            if (!requireUser(req, res)) return;
            const articles = await readNews({ fresh: true });
            const target = articles.find(a => String(a.id) === id);
            if (!target) return sendJson(res, 404, { error: 'Article not found' });

            const remaining = articles.filter(a => String(a.id) !== id);
            await writeNews(remaining);
            await deletePictures(picturesOf(target));
            return sendJson(res, 200, { success: true, removedId: id, remaining: remaining.length });
        }

        res.setHeader('Allow', 'GET, PUT, DELETE');
        return sendJson(res, 405, { error: 'Method not allowed' });
    } catch (err) {
        console.error('[api/news/:id]', err);
        return sendJson(res, 500, { error: err.message || 'Server error' });
    }
}
