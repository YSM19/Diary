import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './Auth/AuthService';
import './UpdateProfile.css';

const UpdateProfile = () => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        username: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const userData = await AuthService.getUserInfo(currentUser.email);
                setUserInfo(prev => ({
                    ...prev,
                    email: userData.email,
                    username: userData.username
                }));
            } catch (error) {
                setError('사용자 정보를 불러오는데 실패했습니다.');
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!window.confirm('사용자 정보를 수정하시겠습니까?')) {
            return;
        }

        setError('');
        setSuccessMessage('');

        try {
            await AuthService.updateUser({
                email: userInfo.email,
                username: userInfo.username
            });
            setSuccessMessage('사용자 정보가 성공적으로 수정되었습니다.');
            setTimeout(() => {
                navigate('/myinfo');
            }, 2000);
        } catch (error) {
            console.error('Update error:', error);
            setError(error.response?.data?.message || '정보 수정에 실패했습니다.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (!window.confirm('비밀번호를 변경하시겠습니까?')) {
            return;
        }

        setError('');
        setSuccessMessage('');

        if (userInfo.newPassword !== userInfo.confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (userInfo.newPassword.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        try {
            await AuthService.updatePassword({
                email: userInfo.email,
                newPassword: userInfo.newPassword
            });
            setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
            setUserInfo(prev => ({
                ...prev,
                newPassword: '',
                confirmPassword: ''
            }));
            setTimeout(() => {
                navigate('/myinfo');
            }, 2000);
        } catch (error) {
            setError('비밀번호 변경에 실패했습니다.');
        }
    };

    return (
        <div className="update-profile-container">
            <h2>정보 수정</h2>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <div className="form-section">
                <h3>기본 정보 수정</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>이메일</label>
                        <input
                            type="email"
                            value={userInfo.email}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>사용자 이름</label>
                        <input
                            type="text"
                            value={userInfo.username}
                            onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">정보 수정</button>
                    </div>
                </form>
            </div>

            <div className="form-section">
                <h3>비밀번호 변경</h3>
                <form onSubmit={handlePasswordChange}>
                    <div className="form-group">
                        <label>새 비밀번호</label>
                        <input
                            type="password"
                            value={userInfo.newPassword}
                            onChange={(e) => setUserInfo({...userInfo, newPassword: e.target.value})}
                            required
                            minLength="6"
                            placeholder="최소 6자 이상 입력해주세요"
                        />
                    </div>
                    <div className="form-group">
                        <label>새 비밀번호 확인</label>
                        <input
                            type="password"
                            value={userInfo.confirmPassword}
                            onChange={(e) => setUserInfo({...userInfo, confirmPassword: e.target.value})}
                            required
                            minLength="6"
                            placeholder="비밀번호를 다시 입력해주세요"
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">비밀번호 변경</button>
                    </div>
                </form>
            </div>

            <div className="button-group center">
                <button type="button" onClick={() => navigate('/myinfo')} className="cancel-button">
                    돌아가기
                </button>
            </div>
        </div>
    );
};

export default UpdateProfile; 