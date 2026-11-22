// Server-side login and session tokens. Files starting with "_" in /api are
// helpers only; Vercel does not expose them as endpoints.
import crypto from 'node:crypto';
import { users } from './_users.js';

const SESSION_DAYS = 7;

const signingKey = () => {
    const base = process.env.SESSION_SECRET
        || process.env.BLOB_READ_WRITE_TOKEN
        || (process.env.VERCEL ? '' : 'umca-local-development-only');
    if (!base) throw new Error('Server is missing its session secret.');
    return crypto.createHash('sha256').update(`umca-session:${base}`).digest();
};

const sign = (body) => crypto.createHmac('sha256', signingKey()).update(body).digest('base64url');

export const hashPassword = (password) => {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(String(password), salt, 64);
    return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
};

export const verifyPassword = (password, stored) => {
    const [scheme, saltB64, hashB64] = String(stored || '').split('$');
    if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false;
    const expected = Buffer.from(hashB64, 'base64');
    const actual = crypto.scryptSync(String(password), Buffer.from(saltB64, 'base64'), expected.length);
    return expected.length > 0 && crypto.timingSafeEqual(actual, expected);
};

const findUser = (identifier) => {
    const q = String(identifier || '').trim().toLowerCase();
    if (!q) return null;
    return users.find(u =>
        u.username.toLowerCase() === q || (u.email && u.email.toLowerCase() === q)
    ) || null;
};

export const publicUser = (u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    email: u.email || '',
    role: u.role,
    avatar: u.avatar || '👤'
});

export const login = (identifier, password) => {
    const user = findUser(identifier);
    // Always run one hash so response time doesn't reveal which usernames exist
    const ok = verifyPassword(password, user ? user.passwordHash : 'scrypt$AAAAAAAAAAAAAAAAAAAAAA==$AAAA');
    if (!user || !ok) return null;
    const payload = {
        sub: user.username,
        role: user.role,
        exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
    };
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return { token: `${body}.${sign(body)}`, user: publicUser(user) };
};

export const verifyToken = (token) => {
    const [body, sig] = String(token || '').split('.');
    if (!body || !sig) return null;
    const expected = Buffer.from(sign(body));
    const given = Buffer.from(sig);
    if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
    try {
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
        if (!payload.exp || payload.exp < Date.now()) return null;
        return findUser(payload.sub);
    } catch (e) {
        return null;
    }
};

const bearer = (req) => {
    const header = req.headers.authorization || req.headers.Authorization || '';
    return header.startsWith('Bearer ') ? header.slice(7) : '';
};

/** Returns the signed-in user, or sends 401 and returns null. */
export const requireUser = (req, res) => {
    const user = verifyToken(bearer(req));
    if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Your session has expired. Please log in again.' }));
        return null;
    }
    return user;
};
