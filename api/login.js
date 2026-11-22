// POST /api/login { username, password } -> { token, user }
import { login } from './_auth.js';

const send = (res, status, data) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(data));
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return send(res, 405, { error: 'Method not allowed' });
    }
    try {
        let body = req.body;
        if (typeof body === 'string') body = JSON.parse(body || '{}');
        const { username, password } = body || {};
        if (!username || !password) {
            return send(res, 400, { error: 'Please enter both username/email and password.' });
        }
        const session = login(username, password);
        if (!session) {
            return send(res, 401, { error: 'Invalid credentials. Please check your username and password.' });
        }
        return send(res, 200, session);
    } catch (err) {
        console.error('[api/login]', err);
        return send(res, 500, { error: 'Login failed. Please try again.' });
    }
}
