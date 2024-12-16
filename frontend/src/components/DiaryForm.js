import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmotionSelector from './EmotionSelector';
import './DiaryForm.css';
import axios from "axios";
import AuthService from './Auth/AuthService';

// axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
});

const DiaryForm = () => {
    const { date } = useParams(); // URL에서 날짜 가져오기
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        content: '',
        emotion: '', // 감정 선택
    });
    const [image, setImage] = useState(null); // 이미지 상태
    const [error, setError] = useState('');
    const [existingDiary, setExistingDiary] = useState(null);  // 기존 일기 존재 여부
    const [existingImage, setExistingImage] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // 해당 날짜의 일기 존재 여부 확인
        const fetchDiary = async () => {
            try {
                const response = await axiosInstance.get(`/api/diary/${date}`, {
                    params: { userEmail: currentUser.email }
                });
                
                // 응답이 있고 id가 있는 경우 (기존 일기)
                if (response.data && response.data.id) {
                    setExistingDiary(response.data);
                    setForm({
                        title: response.data.title || '',
                        content: response.data.content || '',
                        emotion: response.data.emotion || '',
                    });
                    if (response.data.imagePath) {
                        const currentUser = AuthService.getCurrentUser();
                        const imageUrl = `http://localhost:8080${response.data.imagePath}?token=${currentUser.token}`;
                        setExistingImage(imageUrl);
                    }
                } else {
                    // 새 일기 작성을 위한 초기화
                    setForm({
                        title: '',
                        content: '',
                        emotion: ''
                    });
                    setExistingDiary(null);
                }
            } catch (error) {
                console.error('Error fetching diary:', error);
                // 에러 발생 시 폼 초기화
                setForm({
                    title: '',
                    content: '',
                    emotion: ''
                });
                setExistingDiary(null);
            }
        };

        fetchDiary();
    }, [date, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEmotionSelect = (emotion) => {
        setForm((prev) => ({
            ...prev,
            emotion,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file); // 이미지 파일 저장
        }
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

    // API 호출: 일기 저장하기
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        
        try {
            const formData = new FormData();
            
            // 각 필드를 개별적으로 추가
            formData.append('userEmail', currentUser.email);
            formData.append('date', date);
            formData.append('title', form.title);
            formData.append('content', form.content);
            formData.append('emotion', form.emotion);
            
            if (image) {
                formData.append('image', image);
            }

            // FormData 내용 확인 (디버깅용)
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            let response;
            if (existingDiary) {
                // 기존 일기가 있으면 PUT 요청
                response = await axiosInstance.put(`/api/diary/${existingDiary.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('일기가 수정되었습니다.');
            } else {
                // 새로운 일기면 POST 요청
                response = await axiosInstance.post('/api/diary', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('일기가 저장되었습니다.');
            }

            if (response.status === 200) {
                alert('일기가 저장되었습니다.');
                navigate('/');
            }
        } catch (error) {
            console.error('Error saving diary:', error.response || error);
            alert(error.response?.data || '일기 저장에 실패했습니다.');
        }
    };

    // 삭제 핸들러 추가
    const handleDelete = async () => {
        if (!existingDiary || !window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/api/diary/${existingDiary.id}/delete`, {
                params: { userEmail: AuthService.getCurrentUser().email }
            });
            alert('일기가 삭제되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('Error deleting diary:', error);
            setError('일기 삭제에 실패했습니다.');
        }
    };

    return (
        <div className="diary-form">
            <h2>{formatDateKorean(date)} <br /> 일기</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="제목"
                    required
                />
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="내용을 입력하세요"
                    required
                    style={{ width: '100%', height: '200px' }} // 스타일 추가
                />
                <EmotionSelector onSelect={handleEmotionSelect} selectedEmotion={form.emotion} />

                {/* 이미지 업로드 필드 */}
                <div className="image-upload">
                    <label htmlFor="image">사진 첨부</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {/* 이미지 미리보기 */}
                {(image || existingImage) && (
                    <div className="image-preview">
                        <img
                            src={image ? URL.createObjectURL(image) : existingImage}
                            alt="미리보기"
                            style={{ width: '40%', maxHeight: '1000px', objectFit: 'cover' }}
                        />
                    </div>
                )}

                <div className="button-group">
                    <button type="submit" className="save-button">저장</button>
                    {existingDiary && (
                        <button 
                            type="button" 
                            onClick={handleDelete}
                            className="delete-button"
                        >
                            삭제
                        </button>
                    )}
                </div>
            </form>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default DiaryForm;
