import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import logo from '../assets/logo.png';
import './Login.scss';

const Login = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password) {
            setError('Enter both your username (or email) and password.');
            return;
        }

        setLoading(true);
        const res = await login(username, password);
        setLoading(false);
        if (res.success) {
            navigate('/news');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <img src={logo} alt="" className="login-logo" />

                {user ? (
                    <>
                        <h1>You are signed in</h1>
                        <p className="login-intro">
                            Signed in as <strong>{user.name}</strong> ({user.role}).
                        </p>
                        <div className="login-actions">
                            <Button to="/news" variant="primary">Manage news</Button>
                            <Button onClick={logout} variant="outline">Sign out</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Staff login</h1>
                        <p className="login-intro">Sign in to publish and edit news on the UMCA website.</p>

                        {error && (
                            <p className="login-error" role="alert">{error}</p>
                        )}

                        <form onSubmit={handleSubmit} className="login-form" noValidate>
                            <label htmlFor="username">Username or email</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                autoCapitalize="none"
                                spellCheck="false"
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />

                            <button type="submit" className="button primary login-submit" disabled={loading}>
                                {loading ? 'Signing in…' : 'Sign in'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
