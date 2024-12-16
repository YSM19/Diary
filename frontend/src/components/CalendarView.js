import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';
import axios from "axios";
import AuthService from './Auth/AuthService';

// axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
});

// 감정별 색상 매핑
const EMOTION_COLORS = {
    verygood: '#C8E6C9',  // 밝은 초록
    good: '#DCEDC8',      // 연한 초록
    soso: '#FFE0B2',      // 연한 주황
    bad: '#FFCCBC',       // 연한 빨강
    verybad: '#FFCDD2'    // 빨강
};

const CalendarView = () => {
    const navigate = useNavigate();
    const [markedDates, setMarkedDates] = useState([]); // API로부터 받은 마킹된 날짜
    const [selectedDiary, setSelectedDiary] = useState(null); // 선택된 날짜의 일기
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
    const [markedEmotions, setMarkedEmotions] = useState({});  // 날짜별 감정 저장

    // API 호출: 마킹된 날짜 가져오기
    useEffect(() => {
        const fetchMarkedDates = async () => {
            const currentUser = AuthService.getCurrentUser();
            if (!currentUser) {
                return;  // 로그인하지 않은 경우 API 호출하지 않음
            }

            try {
                const today = new Date();
                const response = await axiosInstance.get(
                    `/api/diary/monthly/${today.getFullYear()}/${today.getMonth() + 1}`,  // +1 추가
                    {
                        params: { email: currentUser.email }
                    }
                );
                setMarkedDates(response.data);

                // 날짜별 감정 데이터 구성
                const emotions = {};
                response.data.forEach(diary => {
                    if (diary.date && diary.emotion) {
                        emotions[diary.date] = diary.emotion;
                    }
                });
                console.log('Marked emotions:', emotions); // 디버깅용 로그
                setMarkedEmotions(emotions);
            } catch (error) {
                console.error('Error fetching marked dates:', error);
            }
        };

        fetchMarkedDates();
    }, []);

    const handleDateClick = async (date) => {
        const currentUser = AuthService.getCurrentUser();
        
        if (!currentUser) {
            if (window.confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login');
            }
            return;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        setSelectedDate(formattedDate);

        try {
            const response = await axiosInstance.get(`/api/diary/${formattedDate}`, {
                params: { userEmail: currentUser.email }
            });
            
            console.log('Diary response:', response.data); 

            // 응답 데이터가 있고, content나 emotion이 있는 경우에만 일기가 있는 것으로 처리
            if (response.data && (response.data.content || response.data.emotion)) {
                setSelectedDiary(response.data);
            } else {
                setSelectedDiary(null);
            }
        } catch (error) {
            console.error('Error fetching diary:', error);
            if (error.response) {
                console.log('Error response:', error.response.data); 
            }
            setSelectedDiary(null);
        }
    };

    const handleCreateClick = () => {
        if (selectedDate) {
            navigate(`/diary/${selectedDate}`);
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            // 날짜를 YYYY-MM-DD 형식으로 직접 변환
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            
            const emotion = markedEmotions[formattedDate];
            
            let classes = [];
            
            if (date.toDateString() === new Date().toDateString()) {
                classes.push('today-highlight');
            }
            
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0) classes.push('sunday');
            if (dayOfWeek === 6) classes.push('saturday');
            
            if (emotion) {
                classes.push(`emotion-${emotion}`);
            }
            
            return classes.join(' ');
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            // 날짜를 YYYY-MM-DD 형식으로 직접 변환
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            
            const emotion = markedEmotions[formattedDate];
            
            if (emotion) {
                return (
                    <div className="emotion-indicator">
                        {getEmotionEmoji(emotion)}
                    </div>
                );
            }
        }
        return null;
    };

    // 날짜 숫자만 표시하는 함수 추가
    const formatDay = (locale, date) => {
        return date.getDate();
    };

    return (
        <div className="calendar-view">
            <h1>일기장</h1>
            <Calendar
                onClickDay={handleDateClick}
                locale="ko-KR"
                showNeighboringMonth={false}
                calendarType="gregory"
                tileClassName={tileClassName}
                tileContent={tileContent}
                formatDay={formatDay}  // 날짜 포맷팅 함수 추가
            />

            {selectedDate && (
                <div className="diary-preview">
                    <h2>{formatDateKorean(selectedDate)}</h2>
                    {selectedDiary && (selectedDiary.content || selectedDiary.emotion) ? (
                        <div className="diary-content">
                            <h3>{selectedDiary.title}</h3>
                            <p className="emotion">감정: {getEmotionLabel(selectedDiary.emotion)}</p>
                            <p className="content">{selectedDiary.content}</p>
                            {selectedDiary.imagePath && (
                                <div className="diary-image">
                                    <img 
                                        src={`http://localhost:8080${selectedDiary.imagePath}`}
                                        alt="일기 이미지" 
                                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                                    />
                                </div>
                            )}
                            <button 
                                onClick={() => navigate(`/diary/${selectedDate}`)}
                                className="edit-button"
                            >
                                수정하기
                            </button>
                        </div>
                    ) : (
                        <div className="no-diary">
                            <p>작성된 일기가 없습니다.</p>
                            <button 
                                onClick={handleCreateClick}
                                className="create-button"
                            >
                                일기 작성하기
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// 감정 라벨 변환 함수
const getEmotionLabel = (emotion) => {
    const labels = {
        verygood: '매우 좋음',
        good: '좋음',
        soso: '그냥 그럼',
        bad: '나쁨',
        verybad: '매우 나쁨'
    };
    return labels[emotion] || emotion;
};

// 날짜 포맷팅 함수
const formatDateKorean = (dateString) => {
    const dateObject = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(dateObject);
};

// 감정별 이모지 매핑
const getEmotionEmoji = (emotion) => {
    const emojis = {
        verygood: '😊',
        good: '🙂',
        soso: '😑',
        bad: '🙁',
        verybad: '😡'
    };
    return emojis[emotion] || '';
};

export default CalendarView;
