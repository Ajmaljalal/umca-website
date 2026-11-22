// Admin accounts. Passwords are stored only as scrypt hashes, never in plain text.
// Change or add a password with: npm run set-password -- <username>
export const users = [
    {
        "id": 1,
        "username": "admin",
        "name": "Administrator",
        "email": "admin@umca.org",
        "role": "Admin",
        "avatar": "🛡️",
        "passwordHash": "scrypt$bC0fu4DYrpKaNIBR9amtPg==$dU704iPB17NxU+7/SNyACJQbdDQMkFFoAm5JCCoBtCs3oDtlmvM5GJpicsDn+TMk28uE6RCubeDRXQFZhTldbg=="
    },
    {
        "id": 2,
        "username": "sahil",
        "name": "Sahil",
        "email": "sarah.j@umca.org",
        "role": "Editor",
        "avatar": "✍️",
        "passwordHash": "scrypt$+01CjOMPgKAcSO576y8Eag==$vzXiy41Gaoc47vc/qC57m/+eaJgNZ8zETq7UTCyULuvFthNO/gK/6e35VUmnVLv7AY5GUwyaYlbmLiwiwlf/oQ=="
    },
    {
        "id": 3,
        "username": "ajmal",
        "name": "Ajmal",
        "email": "",
        "role": "Admin",
        "avatar": "🛡️",
        "passwordHash": "scrypt$NsWCpAclT2oO2QY/lnwwFw==$9CTI5NILfTTFBAEYowwajmEeap0PJagPYy58MwcPrjSz2u8DnXhWCiidnzprBqzEOEhRFzeGYujoB8NaZ4o9zg=="
    }
];
