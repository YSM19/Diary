import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios import

const Statistics = () => {
    const [stats, setStats] = useState(null);

    // API 호출: 통계 데이터 가져오기
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get('/api/statistics'); // 통계 데이터 API 호출
                setStats(response.data); // 통계 데이터 설정
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div>
            <h2>통계</h2>
            {stats ? (
                <div>
                    <p>총 작성된 일기 수: {stats.totalDiaries}</p>
                    <p>가장 많이 작성된 감정: {stats.mostFrequentEmotion}</p>
                </div>
            ) : (
                <p>통계를 불러오는 중...</p>
            )}
        </div>
    );
};

export default Statistics;
