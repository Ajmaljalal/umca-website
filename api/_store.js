// News storage on Vercel Blob: the article list lives in one JSON file
// (news/news.json) and pictures live under news-images/.
import fs from 'node:fs';
import path from 'node:path';
import { put, del } from '@vercel/blob';

const NEWS_PATH = 'news/news.json';
const token = () => process.env.BLOB_READ_WRITE_TOKEN;

const storeBaseUrl = () => {
    let id = process.env.BLOB_STORE_ID || '';
    if (!id) {
        const match = /^vercel_blob_rw_([^_]+)_/.exec(token() || '');
        if (match) id = match[1];
    }
    id = id.replace(/^store_/, '').toLowerCase();
    if (!id) throw new Error('Blob storage is not configured for this project.');
    return `https://${id}.public.blob.vercel-storage.com`;
};

export const isStorePictureUrl = (url) => {
    try {
        return new URL(url).host === new URL(storeBaseUrl()).host;
    } catch (e) {
        return false;
    }
};

// Articles bundled with the site; used until the first save creates news/news.json
const bundledNews = () => {
    try {
        const file = path.join(process.cwd(), 'src', 'data', 'news.json');
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return [];
    }
};

/**
 * fresh=true skips the CDN cache so admins and writes always see the latest list.
 */
export const readNews = async ({ fresh = false } = {}) => {
    const url = `${storeBaseUrl()}/${NEWS_PATH}${fresh ? `?v=${Date.now()}` : ''}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (response.status === 404) return bundledNews();
    if (!response.ok) throw new Error(`Could not load news (status ${response.status}).`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
};

export const writeNews = async (articles) => {
    await put(NEWS_PATH, JSON.stringify(articles, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        cacheControlMaxAge: 60,
        token: token()
    });
};

export const savePicture = async ({ filename, dataUrl }) => {
    const match = /^data:([A-Za-z0-9.+/-]+);base64,(.+)$/s.exec(String(dataUrl || ''));
    if (!match) throw new Error('Invalid picture data.');
    const contentType = match[1];
    if (!contentType.startsWith('image/')) throw new Error('Only picture files can be uploaded.');
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length > 4 * 1024 * 1024) throw new Error('Picture is too large (max 4 MB after compression).');

    const ext = (contentType.split('/')[1] || 'jpg').replace('jpeg', 'jpg').replace('+xml', '');
    const base = String(filename || 'photo')
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9-]/g, '_')
        .slice(0, 60) || 'photo';

    const blob = await put(`news-images/${base}.${ext}`, buffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType,
        token: token()
    });
    return blob.url;
};

export const deletePictures = async (urls) => {
    const ours = Array.from(new Set((urls || []).filter(u => typeof u === 'string' && isStorePictureUrl(u))));
    if (ours.length === 0) return;
    try {
        await del(ours, { token: token() });
    } catch (e) {
        console.error('Failed to delete pictures', e);
    }
};

export const picturesOf = (article) => {
    if (!article) return [];
    const list = [];
    if (article.image) list.push(article.image);
    (article.relatedImages || []).forEach(item => {
        if (typeof item === 'string') list.push(item);
        else if (item && item.url) list.push(item.url);
    });
    return list;
};

export const sendJson = (res, status, data, cacheControl = 'no-store') => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', cacheControl);
    res.end(JSON.stringify(data));
};

export const readBody = async (req) => {
    if (req.body && typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    return raw ? JSON.parse(raw) : {};
};
