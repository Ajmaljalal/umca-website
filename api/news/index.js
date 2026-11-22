// GET  /api/news          list articles (public, cached ~1 minute)
// GET  /api/news?fresh=1  list articles without cache (used by signed-in admins)
// POST /api/news          create an article (admin only)
import { requireUser } from '../_auth.js';
import { readNews, writeNews, sendJson, readBody } from '../_store.js';
import { cleanArticle } from '../_article.js';

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const fresh = String(req.query.fresh || '') === '1';
            const articles = await readNews({ fresh });
            return sendJson(res, 200, articles,
                fresh ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=300');
        }

        if (req.method === 'POST') {
            const user = requireUser(req, res);
            if (!user) return;
            const fields = cleanArticle(await readBody(req));
            if (!fields.title) return sendJson(res, 400, { error: 'A title is required.' });

            const articles = await readNews({ fresh: true });
            const article = { id: Date.now(), ...fields, createdBy: user.username };
            await writeNews([article, ...articles]);
            return sendJson(res, 201, article);
        }

        res.setHeader('Allow', 'GET, POST');
        return sendJson(res, 405, { error: 'Method not allowed' });
    } catch (err) {
        console.error('[api/news]', err);
        return sendJson(res, 500, { error: err.message || 'Server error' });
    }
}
