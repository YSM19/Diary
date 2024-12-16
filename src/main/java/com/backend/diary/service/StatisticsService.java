package com.backend.diary.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;
import com.backend.diary.entity.DiaryEntity;
import com.backend.diary.entity.UserEntity;
import com.backend.diary.repository.DiaryRepository;
import com.backend.diary.repository.UserRepository;
import com.backend.diary.entity.Emotions;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getEmotionStatistics(Long userId) {
        try {
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<DiaryEntity> diaries = diaryRepository.findByUser(user);
            
            Map<String, Object> statistics = new HashMap<>();
            
            // 전체 일기 수
            statistics.put("totalCount", diaries.size());
            
            // 감정별 통계
            Map<String, Long> emotionCounts = diaries.stream()
                    .filter(diary -> diary.getEmotion() != null)
                    .collect(Collectors.groupingBy(
                        diary -> diary.getEmotion().name(),
                        Collectors.counting()
                    ));
            statistics.put("emotionCounts", emotionCounts);
            
            // 월별 감정 통계
            Map<String, Map<String, Long>> monthlyStats = diaries.stream()
                    .filter(diary -> diary.getEmotion() != null && diary.getDate() != null)
                    .collect(Collectors.groupingBy(
                        diary -> diary.getDate().substring(0, 7),
                        Collectors.groupingBy(
                            diary -> diary.getEmotion().name(),
                            Collectors.counting()
                        )
                    ));
            statistics.put("monthlyStats", monthlyStats);

            return statistics;
        } catch (Exception e) {
            throw new RuntimeException("통계 데이터 생성 중 오류 발생: " + e.getMessage());
        }
    }

    // 주간 감정 통계
} 