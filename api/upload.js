// POST   /api/upload           { filename, data: "data:image/...;base64,..." } -> { url }  (admin only)
// DELETE /api/upload?url=...   delete a picture from storage (admin only)
import { requireUser } from './_auth.js';
import { savePicture, deletePictures, isStorePictureUrl, sendJson, readBody } from './_store.js';

export default async function handler(req, res) {
    try {
        if (!requireUser(req, res)) return;

        if (req.method === 'POST') {
            const body = await readBody(req);
            if (!body || !body.data) return sendJson(res, 400, { error: 'Missing picture data.' });
            const url = await savePicture({ filename: body.filename, dataUrl: body.data });
            return sendJson(res, 201, { success: true, url });
        }

        if (req.method === 'DELETE') {
            const url = String(req.query.url || '');
            if (!url) return sendJson(res, 400, { error: 'Missing picture url.' });
            if (isStorePictureUrl(url)) await deletePictures([url]);
            return sendJson(res, 200, { success: true, deleted: url });
        }

        res.setHeader('Allow', 'POST, DELETE');
        return sendJson(res, 405, { error: 'Method not allowed' });
    } catch (err) {
        console.error('[api/upload]', err);
        return sendJson(res, 500, { error: err.message || 'Server error' });
    }
}
