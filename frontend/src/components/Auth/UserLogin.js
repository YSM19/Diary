import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';
import './UserLogin.css';

const UserLogin = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                const user = await AuthService.login(email, password);
                if (user) {
                    setCurrentUser(user);
                    navigate('/');
                }
            } else {
                if (password.length < 6) {
                    setError('비밀번호는 6자 이상이어야 합니다.');
                    return;
                }
                await AuthService.register(email, username, password);
                setIsLogin(true);
                setError('회원가입이 완료되었습니다. 로그인해주세요.');
                setPassword('');
            }
        } catch (error) {
            setError(
                error.response?.data?.message || 
                '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
            );
        }
    };

    const handleLogout = () => {
        AuthService.logout();
        setCurrentUser(null);
        navigate('/login');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setEmail('');
        setPassword('');
        setUsername('');
    };

    if (currentUser) {
        return (
            <div className="auth-container">
                <h2>로그인 정보</h2>
                <div className="user-info">
                    <p><strong>이메일:</strong> {currentUser.email}</p>
                    <p><strong>사용자 이름:</strong> {currentUser.username}</p>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    로그아웃
                </button>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <h2>{isLogin ? '로그인' : '회원가입'}</h2>
            {error && <div className={`message ${error.includes('완료') ? 'success' : 'error'}`}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>이메일:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {!isLogin && (
                    <div className="form-group">
                        <label>사용자 이름:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <button type="submit" className="submit-button">
                    {isLogin ? '로그인' : '회원가입'}
                </button>
            </form>
            <button onClick={toggleMode} className="toggle-button">
                {isLogin ? '회원가입으로 전환' : '로그인으로 전환'}
            </button>
        </div>
    );
};

export default UserLogin;
