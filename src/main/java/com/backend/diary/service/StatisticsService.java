package com.backend.diary.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import com.backend.diary.mapper.StatisticsMapper;
import com.backend.diary.mapper.UserMapper;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final StatisticsMapper statisticsMapper;
    private final UserMapper userMapper;

    public Map<String, Object> getEmotionStatistics(Long userId) {
        try {
            // 사용자 존재 여부 확인
            if (!userMapper.existsById(userId)) {
                throw new RuntimeException("User not found");
            }

            Map<String, Object> statistics = new HashMap<>();
            
            // 전체 일기 수
            int totalCount = statisticsMapper.countTotalDiaries(userId);
            statistics.put("totalCount", totalCount);
            
            // 감정별 통계
            List<Map<String, Object>> emotionCounts = statisticsMapper.countEmotionsByUser(userId);
            Map<String, Long> emotionCountMap = new HashMap<>();
            for (Map<String, Object> count : emotionCounts) {
                String emotion = (String) count.get("emotion");
                Long countValue = ((Number) count.get("count")).longValue();
                emotionCountMap.put(emotion, countValue);
            }
            statistics.put("emotionCounts", emotionCountMap);
            
            // 월별 감정 통계
            List<Map<String, Object>> monthlyStats = statisticsMapper.getMonthlyEmotionStats(userId);
            Map<String, Map<String, Long>> monthlyStatsMap = new HashMap<>();
            
            for (Map<String, Object> stat : monthlyStats) {
                String month = (String) stat.get("month");
                String emotion = (String) stat.get("emotion");
                Long count = ((Number) stat.get("count")).longValue();
                
                monthlyStatsMap.computeIfAbsent(month, k -> new HashMap<>())
                        .put(emotion, count);
            }
            statistics.put("monthlyStats", monthlyStatsMap);
            
            return statistics;
        } catch (Exception e) {
            throw new RuntimeException("통계 데이터 생성 중 오류 발생: " + e.getMessage());
        }
    }

    // 주간 감정 통계
} 