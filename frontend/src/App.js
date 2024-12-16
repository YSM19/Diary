import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import CalendarView from './components/CalendarView';
import DiaryForm from './components/DiaryForm';
import Statistics from './components/Statistics'; // 통계 컴포넌트
import MyInfo from './components/MyInfo'; // 내 정보 컴포넌트
import UserLogin from "./components/Auth/UserLogin"; // 로그인 컴포넌트
import EmotionStatistics from './components/EmotionStatistics';
import UpdateProfile from './components/UpdateProfile';
import './App.css';

function App() {
    const [tabWidth, setTabWidth] = useState(200);
    const [isResizing, setIsResizing] = useState(false);
    const tabsRef = useRef(null);

    const startResizing = (e) => {
        setIsResizing(true);
        e.preventDefault();
    };

    const stopResizing = () => {
        setIsResizing(false);
    };

    const resize = (e) => {
        if (isResizing) {
            const newWidth = e.clientX;
            if (newWidth >= 150 && newWidth <= 400) {
                setTabWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        }

        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing]);

    return (
        <Router>
            <div className="App">
                <div className="tabs-container">
                    <nav className="tabs" style={{ width: tabWidth + 'px' }}>
                        <NavLink
                            to="/"
                            className={({ isActive }) => (isActive ? "tab-link active" : "tab-link")}
                        >
                            일기장
                        </NavLink>
                        <NavLink
                            to="/statistics"
                            className={({ isActive }) => (isActive ? "tab-link active" : "tab-link")}
                        >
                            통계
                        </NavLink>
                        <NavLink
                            to="/myinfo"
                            className={({ isActive }) => (isActive ? "tab-link active" : "tab-link")}
                        >
                            내 정보
                        </NavLink>
                        <NavLink
                            to="/login"
                            className={({ isActive }) => (isActive ? "tab-link active" : "tab-link")}
                        >
                            로그인
                        </NavLink>
                    </nav>
                    <div 
                        className={`resize-handle ${isResizing ? 'resizing' : ''}`}
                        onMouseDown={startResizing}
                    />
                </div>

                <div className="tab-content" style={{ marginLeft: (tabWidth + 5) + 'px' }}>
                    <Routes>
                        {/* 기존 라우트 */}
                        <Route path="/" element={<CalendarView />} />
                        <Route path="/diary/:date" element={<DiaryForm />} />
                        <Route path="/statistics" element={<EmotionStatistics />} />
                        <Route path="/myinfo" element={<MyInfo />} />

                        {/* 로그인 및 회원가입 라우트 */}
                        <Route path="/login" element={<UserLogin />} />
                        <Route path="/update-profile" element={<UpdateProfile />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
