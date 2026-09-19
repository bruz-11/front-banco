import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Auth.css';

export default function Login() {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/login', { rut, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('idUsuario', data.idUsuario);
            navigate(`/dashboard/${data.idUsuario}`);
        } catch (err) {
            console.error(err);
            setError('Credenciales incorrectas. Intenta de nuevo.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-icon">☁️</span>
                    <h1>Banco Cloud</h1>
                </div>
                <p className="auth-subtitle">Ingresa a tu cuenta</p>

                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleLogin} className="auth-form">
                    <label className="auth-label">
                        RUT
                        <input
                            type="text"
                            placeholder="12345678-9"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            required
                        />
                    </label>
                    <label className="auth-label">
                        Contraseña
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit" className="auth-btn-primary">
                        Entrar a mi cuenta
                    </button>
                </form>

                <p className="auth-footer">
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
}