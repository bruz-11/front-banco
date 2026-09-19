import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Auth.css';

export default function Register() {
    const [formData, setFormData] = useState({ nombre: '', rut: '', gmail: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/register', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('idUsuario', data.idUsuario);
            navigate(`/dashboard/${data.idUsuario}`);
        } catch (err) {
            console.error(err);
            setError('Error al registrar. Revisa los datos.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-icon">☁️</span>
                    <h1>Banco Cloud</h1>
                </div>
                <p className="auth-subtitle">Crea tu cuenta</p>

                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleRegister} className="auth-form">
                    <label className="auth-label">
                        Nombre completo
                        <input type="text" name="nombre" placeholder="Tu nombre" onChange={handleChange} required />
                    </label>
                    <label className="auth-label">
                        RUT
                        <input type="text" name="rut" placeholder="12345678-9" onChange={handleChange} required />
                    </label>
                    <label className="auth-label">
                        Correo electrónico
                        <input type="email" name="gmail" placeholder="tucorreo@gmail.com" onChange={handleChange} required />
                    </label>
                    <label className="auth-label">
                        Contraseña
                        <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
                    </label>
                    <button type="submit" className="auth-btn-primary">
                        Registrarme
                    </button>
                </form>

                <p className="auth-footer">
                    ¿Ya tienes cuenta? <Link to="/">Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
}