import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import api from '../api';
import './Auth.css';

// 1. Configuramos el acceso a tu Cognito en AWS
const poolData = {
    UserPoolId: 'us-east-1_uyCELHdgp',
    ClientId: '91nln9bvj99r9oa5s6tc8ppud'
};
const userPool = new CognitoUserPool(poolData);

export default function Login() {
    // 2. Cambiamos RUT por email para coincidir con AWS Cognito
    const [gmail, setGmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // 3. Preparamos las credenciales para AWS
        const authenticationDetails = new AuthenticationDetails({
            Username: gmail,
            Password: password,
        });

        const cognitoUser = new CognitoUser({
            Username: gmail,
            Pool: userPool
        });

        // 4. Autenticamos directamente contra la nube
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: async (result) => {
                try {
                    // 1. Obtenemos el JWT oficial emitido por AWS
                    const token = result.getIdToken().getJwtToken();
                    localStorage.setItem('token', token);
                    
                    // 2. Buscamos el ID real en tu MySQL usando el endpoint del BFF
                    // Usamos la instancia 'api' que ya tienes importada para pasar por el Gateway
                    const respuesta = await api.get(`/usuarios/buscar?gmail=${gmail}`, {
                        headers: { Authorization: token }
                    });
                    
                    const usuarioReal = respuesta.data;
                    
                    // 3. Guardamos el ID numérico correcto y navegamos
                    localStorage.setItem('idUsuario', usuarioReal.id);
                    navigate(`/dashboard/${usuarioReal.id}`);
                    
                } catch (err) {
                    console.error("Error al buscar el ID en MySQL:", err);
                    setError("Cognito te aceptó, pero falló la conexión con tu base de datos.");
                }
            },
            onFailure: (err) => {
                console.error(err);
                setError('Credenciales incorrectas en AWS Cognito. Intenta de nuevo.');
            }
        });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-icon">☁️</span>
                    <h1>Banco Cloud</h1>
                </div>
                <p className="auth-subtitle">Ingresa a tu cuenta con AWS Cognito</p>

                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleLogin} className="auth-form">
                    <label className="auth-label">
                        Correo Electrónico
                        <input
                            type="email"
                            placeholder="admin@ejemplo.com"
                            value={gmail}
                            onChange={(e) => setGmail(e.target.value)}
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