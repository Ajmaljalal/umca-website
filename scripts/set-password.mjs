#!/usr/bin/env node
// Set or change an admin password (stored only as a hash in api/_users.js).
//
//   npm run set-password -- <username>
//   npm run set-password -- <username> --name "Full Name" --role Editor --email me@example.org
//
// A new username creates a new account. Commit and push afterwards to apply it to the live site.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { hashPassword } from '../api/_auth.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const usersFile = path.join(root, 'api', '_users.js');

const args = process.argv.slice(2);
const username = args.find(a => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--'));
const flag = (name) => {
    const i = args.indexOf(`--${name}`);
    return i !== -1 ? args[i + 1] : undefined;
};

if (!username) {
    console.error('Usage: npm run set-password -- <username> [--name "Full Name"] [--role Admin|Editor] [--email address]');
    process.exit(1);
}

const askHidden = (question) => new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) process.stdout.write(s); };
    rl.question(question, (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer); });
});

const { users } = await import(pathToFileURL(usersFile).href);
const list = users.map(u => ({ ...u }));

const password = await askHidden(`New password for "${username}": `);
const confirm = await askHidden('Repeat password: ');
if (password !== confirm) { console.error('Passwords do not match.'); process.exit(1); }
if (password.length < 10) { console.error('Use at least 10 characters.'); process.exit(1); }

let user = list.find(u => u.username.toLowerCase() === username.toLowerCase());
if (!user) {
    user = {
        id: Math.max(0, ...list.map(u => Number(u.id) || 0)) + 1,
        username,
        name: flag('name') || username,
        email: flag('email') || '',
        role: flag('role') || 'Editor',
        avatar: '👤'
    };
    list.push(user);
    console.log(`Created new account "${username}" (${user.role}).`);
}
if (flag('name')) user.name = flag('name');
if (flag('role')) user.role = flag('role');
if (flag('email') !== undefined) user.email = flag('email');
user.passwordHash = hashPassword(password);

fs.writeFileSync(usersFile,
    '// Admin accounts. Passwords are stored only as scrypt hashes, never in plain text.\n' +
    '// Change or add a password with: npm run set-password -- <username>\n' +
    `export const users = ${JSON.stringify(list, null, 4)};\n`);
console.log(`Password updated for "${user.username}". Commit and push api/_users.js to apply it to the live site.`);
