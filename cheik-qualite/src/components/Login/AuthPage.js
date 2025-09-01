import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css'; // Updated CSS import
import { FaFacebookF, FaGoogle, FaTwitter, FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaPhone } from 'react-icons/fa';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passwordShownLogin, setPasswordShownLogin] = useState(false);
  const [passwordShownRegister, setPasswordShownRegister] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const togglePasswordVisiblityLogin = () => setPasswordShownLogin(!passwordShownLogin);
  const togglePasswordVisiblityRegister = () => setPasswordShownRegister(!passwordShownRegister);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Échec de la connexion');
      }

      const { token } = await response.json();
      localStorage.setItem('token', token);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userRole = decodedToken.role || 'user';

      if (userRole === 'admin') {
        window.location.href = '/admin';
      } else if (userRole === 'agent') {
        window.location.href = '/agent-dashboard';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, phoneNumber }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Échec de l’inscription');
      }

      const { token } = await response.json(); // Assuming backend returns token on registration
      localStorage.setItem('token', token);
      window.location.href = '/profil'; // Redirect to profile page
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Connexion/Inscription avec ${provider} non implémentée.`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h2>{isLogin ? 'Bienvenue !' : 'Rejoignez-nous !'}</h2>
          <p>{isLogin ? 'Connectez-vous pour accéder à votre espace.' : 'Créez un compte pour profiter de nos services.'}</p>
          <button className={styles.switchBtn} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Créer un compte' : 'J’ai déjà un compte'}
          </button>
        </div>
        <div className={styles.right}>
          <h3>{isLogin ? 'Se connecter' : 'S’inscrire'}</h3>
          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            <div className={styles.inputGroup}>
              <FaUser className={styles.icon} />
              <input type="text" placeholder="Nom d’utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            {!isLogin && (
              <>
                <div className={styles.inputGroup}>
                  <FaEnvelope className={styles.icon} />
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className={styles.inputGroup}>
                  <FaPhone className={styles.icon} />
                  <input type="tel" placeholder="Téléphone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} pattern="[0-9]{9,15}" title="9 à 15 chiffres" required />
                </div>
              </>
            )}

            <div className={styles.inputGroup}>
              <FaLock className={styles.icon} />
              <input type={passwordShownLogin ? 'text' : 'password'} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={togglePasswordVisiblityLogin} className={styles.eye}>
                {passwordShownLogin ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {!isLogin && (
              <div className={styles.inputGroup}>
                <FaLock className={styles.icon} />
                <input type={passwordShownRegister ? 'text' : 'password'} placeholder="Confirmez le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="button" onClick={togglePasswordVisiblityRegister} className={styles.eye}>
                  {passwordShownRegister ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            )}

            <button type="submit" className={styles.submitBtn}>{isLogin ? 'Se connecter' : 'S’inscrire'}</button>
          </form>

          <div className={styles.divider}>OU</div>
          <div className={styles.socials}>
            <a onClick={() => handleSocialLogin('Facebook')}><FaFacebookF /></a>
            <a onClick={() => handleSocialLogin('Google')}><FaGoogle /></a>
            <a onClick={() => handleSocialLogin('Twitter')}><FaTwitter /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;