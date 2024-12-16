import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';
import './UserLogin.css';

const UserRegistration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !username) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        if (password.length < 6) {
            setError('비밀번호는 6자 이상이어야 합니다.');
            return;
        }

        if (!email.includes('@')) {
            setError('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        try {
            await AuthService.register(email, password, username);
            navigate('/login', { 
                state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' } 
            });
        } catch (error) {
            setError(
                error.response?.data?.message || 
                `회원가입에 실패했습니다. (${error.message})`
            );
            console.error('Registration error:', error.response || error);
        }
    };

    return (
        <div className="login-container">
            <h2>회원가입</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>이메일:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <label>사용자 이름:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default UserRegistration;
