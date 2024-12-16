package com.backend.diary.service;

import com.backend.diary.dto.DiaryRequest;
import com.backend.diary.dto.DiaryResponse;
import com.backend.diary.entity.DiaryEntity;
import com.backend.diary.entity.UserEntity;
import com.backend.diary.repository.DiaryRepository;
import com.backend.diary.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    // 일기장 샏성 create
    public DiaryEntity createDiary(Long userId, DiaryRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DiaryEntity diary = DiaryEntity.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .emotion(request.getEmotion())
                .imageName(request.getImageName())
                .imagePath(request.getImagePath())
                .date(request.getDate())
                .user(user)
                .build();

        System.out.println("Saved diary");
        
        return diaryRepository.save(diary);
    }

    // Entity -> DTO 변환
    public DiaryResponse toResponse(DiaryEntity diary) {
        return DiaryResponse.builder()
                .id(diary.getId())
                .title(diary.getTitle())
                .content(diary.getContent())
                .emotion(diary.getEmotion())
                .imageName(diary.getImageName())
                .imagePath(diary.getImagePath())
                .date(diary.getDate())
                .build();
    }

    // 월별로 조회 read
    public List<DiaryEntity> getMonthlyDiaries(Long userId, int year, int month) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1).minusSeconds(1);

        return diaryRepository.findByUserAndUpdatedAtBetween(user, start, end);
    }

    public DiaryEntity updateDiary(Long diaryId, DiaryRequest request) {
        DiaryEntity diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new RuntimeException("Diary not found"));

        // 기존 엔티티의 정보를 유지하면서 업데이트
        diary = DiaryEntity.builder()
                .id(diaryId)  // ID 설정 추가
                .title(request.getTitle())
                .content(request.getContent())
                .emotion(request.getEmotion())
                .imageName(request.getImageName())
                .imagePath(request.getImagePath())
                .date(request.getDate())
                .user(diary.getUser())  // 기존 사용자 정보 유지
                .build();

        return diaryRepository.save(diary);
    }

    // 일기장 삭제 delte
    public void deleteById(Long diaryId) {
        diaryRepository.deleteById(diaryId);
    }

    public DiaryEntity getDiaryByDateAndUserId(String date, Long userId) {
        return diaryRepository.findByDateAndUserId(date, userId)
            .orElse(null);
    }

    public DiaryEntity getDiaryById(Long diaryId) {
        return diaryRepository.findById(diaryId).orElse(null);
    }
}