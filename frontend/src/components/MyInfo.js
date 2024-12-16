import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './Auth/AuthService';
import './MyInfo.css';

const MyInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const currentUser = AuthService.getCurrentUser();
            if (!currentUser) {
                setError('로그인이 필요한 서비스입니다. 잠시 후 로그인 페이지로 이동합니다.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
                return;
            }

            const fetchUserInfo = async () => {
                try {
                    const userData = await AuthService.getUserInfo(currentUser.email);
                    setUserInfo(userData);
                } catch (error) {
                    setError('사용자 정보를 불러오는데 실패했습니다.');
                }
            };

            fetchUserInfo();
        };

        checkAuth();
    }, [navigate]);

    if (error) {
        return (
            <div className="my-info-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="my-info-container">
            <h2>내 정보</h2>
            {userInfo ? (
                <div className="info-content">
                    <div className="info-item">
                        <label>이메일</label>
                        <p>{userInfo.email}</p>
                    </div>
                    <div className="info-item">
                        <label>사용자 이름</label>
                        <p>{userInfo.username}</p>
                    </div>
                    <div className="info-buttons">
                        <button 
                            onClick={() => navigate('/update-profile')}
                            className="update-button"
                        >
                            정보 수정
                        </button>
                        <button 
                            onClick={() => {
                                if (window.confirm('정말 탈퇴하시겠습니까?')) {
                                    AuthService.deleteUser(userInfo.email)
                                        .then(() => {
                                            AuthService.logout();
                                            navigate('/login');
                                        })
                                        .catch(err => {
                                            setError('회원 탈퇴에 실패했습니다.');
                                        });
                                }
                            }}
                            className="delete-button"
                        >
                            회원 탈퇴
                        </button>
                    </div>
                </div>
            ) : (
                <div className="loading">로딩 중...</div>
            )}
        </div>
    );
};

export default MyInfo;
