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
        "passwordHash": "scrypt$fHf1q8AIRcCsbkygIcIbog==$kKil3ANNNO+aG4oaJ8ktKUJJ+gJPzSjv51GulzEMdjlmZt5zM8ks432H5y7GCe64Pa769mp6GVg2UBMdXTOxyg=="
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
