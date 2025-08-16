// RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

// Стили для страниц авторизации
const authStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },

  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    overflow: 'hidden'
  },

  decorativeElement: {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '100px',
    height: '100px',
    background: 'linear-gradient(45deg, #059669, #10b981)',
    borderRadius: '50%',
    opacity: '0.1'
  },

  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },

  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px'
  },

  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    fontWeight: '400'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  inputGroup: {
    position: 'relative'
  },

  inputLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  },

  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },

  input: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    outline: 'none',
    background: '#f9fafb',
    boxSizing: 'border-box'
  },

  inputFocus: {
    borderColor: '#059669',
    background: 'white',
    boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.1)'
  },

  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#9ca3af',
    zIndex: 1
  },

  passwordToggle: {
    position: 'absolute',
    right: '14px',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.2s',
    zIndex: 1
  },

  submitButton: (isLoading, isDisabled = false) => ({
    background: isLoading || isDisabled ? '#9ca3af' : 'linear-gradient(135deg, #059669, #047857)',
    color: 'white',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: isLoading || isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px'
  }),

  switchText: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#6b7280'
  },

  switchLink: {
    color: '#059669',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },

  errorMessage: {
    background: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  validationError: {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '4px'
  }
};

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Клиентская валидация
    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Пароль повинен містити щонайменше 6 символів');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', { 
        email, 
        password 
      });
      
      alert('Реєстрація успішна. Увійдіть в систему.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка реєстрації');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <div style={authStyles.decorativeElement}></div>
        
        <div style={authStyles.header}>
          <h2 style={authStyles.title}>Реєстрація</h2>
          <p style={authStyles.subtitle}>Створіть новий акаунт</p>
        </div>

        {error && (
          <div style={authStyles.errorMessage}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={authStyles.form}>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.inputLabel}>Email адреса</label>
            <div style={authStyles.inputContainer}>
              <Mail size={18} style={authStyles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
                placeholder="example@email.com"
                style={{
                  ...authStyles.input,
                  ...(focusedInput === 'email' ? authStyles.inputFocus : {})
                }}
                required
              />
            </div>
          </div>

          <div style={authStyles.inputGroup}>
            <label style={authStyles.inputLabel}>Пароль</label>
            <div style={authStyles.inputContainer}>
              <Lock size={18} style={authStyles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput('')}
                placeholder="Мінімум 6 символів"
                style={{
                  ...authStyles.input,
                  ...(focusedInput === 'password' ? authStyles.inputFocus : {})
                }}
                required
                minLength={6}
              />
              <div 
                style={authStyles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div style={authStyles.inputGroup}>
            <label style={authStyles.inputLabel}>Підтвердити пароль</label>
            <div style={authStyles.inputContainer}>
              <Lock size={18} style={authStyles.inputIcon} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput('')}
                placeholder="Повторіть пароль"
                style={{
                  ...authStyles.input,
                  ...(focusedInput === 'confirmPassword' ? authStyles.inputFocus : {}),
                  borderColor: confirmPassword && password !== confirmPassword ? '#dc2626' : 
                             (focusedInput === 'confirmPassword' ? '#059669' : '#e5e7eb')
                }}
                required
              />
              <div 
                style={authStyles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <div style={authStyles.validationError}>
                Паролі не співпадають
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || (confirmPassword && password !== confirmPassword)}
            style={authStyles.submitButton(
              isLoading, 
              confirmPassword && password !== confirmPassword
            )}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid #ffffff40',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Реєстрація...
              </>
            ) : (
              <>
                <User size={18} />
                Зареєструватися
              </>
            )}
          </button>
        </form>

        <div style={authStyles.switchText}>
          Вже маєте акаунт?{' '}
          <Link to="/login" style={authStyles.switchLink}>
            Увійти
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}