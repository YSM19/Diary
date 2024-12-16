import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthService from './Auth/AuthService';
import './EmotionStatistics.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
});

const EmotionStatistics = () => {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const emotionColors = {
        verygood: 'rgba(76, 175, 80, 0.8)',
        good: 'rgba(139, 195, 74, 0.8)',
        soso: 'rgba(255, 152, 0, 0.8)',
        bad: 'rgba(255, 87, 34, 0.8)',
        verybad: 'rgba(213, 0, 0, 0.8)'
    };

    const emotionHoverColors = {
        verygood: 'rgba(76, 175, 80, 1)',
        good: 'rgba(139, 195, 74, 1)',
        soso: 'rgba(255, 152, 0, 1)',
        bad: 'rgba(255, 87, 34, 1)',
        verybad: 'rgba(213, 0, 0, 1)'
    };

    const emotionLabels = {
        verygood: '매우 좋음',
        good: '좋음',
        soso: '그냥 그럼',
        bad: '나쁨',
        verybad: '매우 나쁨'
    };

    useEffect(() => {
        const fetchStatistics = async () => {
            const currentUser = AuthService.getCurrentUser();
            if (!currentUser) {
                navigate('/login');
                return;
            }

            try {
                const response = await axiosInstance.get('/api/statistics/emotions', {
                    params: { email: currentUser.email }
                });
                
                console.log('Statistics response:', response.data); // 디버깅용
                
                if (response.data) {
                    setStatistics({
                        totalCount: response.data.totalCount || 0,
                        emotionCounts: response.data.emotionCounts || {},
                        monthlyStats: response.data.monthlyStats || {}
                    });
                }
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError('통계 데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [navigate]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!statistics) return <div>데이터가 없습니다.</div>;

    const pieChartData = {
        labels: Object.keys(statistics.emotionCounts).map(key => emotionLabels[key]),
        datasets: [{
            data: Object.values(statistics.emotionCounts),
            backgroundColor: Object.keys(statistics.emotionCounts).map(key => emotionColors[key]),
            borderWidth: 1
        }]
    };

    const monthlyData = {
        labels: Object.keys(statistics.monthlyStats).sort().map(month => {
            const [year, monthNum] = month.split('-');
            return `${year}년 ${monthNum}월`;
        }),
        datasets: Object.keys(emotionLabels).map((emotion, index) => ({
            label: emotionLabels[emotion],
            data: Object.keys(statistics.monthlyStats).sort().map(month => 
                statistics.monthlyStats[month][emotion] || 0
            ),
            backgroundColor: emotionColors[emotion],
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.8
        }))
    };

    return (
        <div className="statistics-container">
            <h1>감정 통계</h1>
            
            <div className="total-count">
                <h2>전체 일기 수</h2>
                <p>{statistics.totalCount}개</p>
            </div>

            <div className="chart-container">
                <div className="pie-chart">
                    <h2>전체 감정 분포</h2>
                    <Pie 
                        data={pieChartData} 
                        options={{
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        font: {
                                            size: 14,
                                            family: "'Pretendard', sans-serif"
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </div>

                <div className="bar-chart">
                    <h2>월별 감정 추이</h2>
                    <Bar 
                        data={monthlyData}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    grid: {
                                        display: false
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1
                                    },
                                    grid: {
                                        color: 'rgba(0, 0, 0, 0.05)'
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        font: {
                                            size: 14,
                                            family: "'Pretendard', sans-serif"
                                        },
                                        padding: 20
                                    }
                                }
                            },
                            barThickness: 'flex',
                            maxBarThickness: 30,
                            minBarLength: 2
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmotionStatistics; 