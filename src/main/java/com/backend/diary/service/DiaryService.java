package com.backend.diary.service;

import com.backend.diary.dto.DiaryRequest;
import com.backend.diary.dto.DiaryResponse;
import com.backend.diary.entity.DiaryEntity;
import com.backend.diary.entity.UserEntity;
import com.backend.diary.mapper.DiaryMapper;
import com.backend.diary.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryService {
    private final DiaryMapper diaryMapper;
    private final UserMapper userMapper;

    public DiaryEntity createDiary(Long userId, DiaryRequest request) {
        UserEntity user = userMapper.findById(userId)
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

        diaryMapper.save(diary);
        return diary;
    }

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

    public List<DiaryEntity> getMonthlyDiaries(Long userId, int year, int month) {
        UserEntity user = userMapper.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1).minusSeconds(1);

        return diaryMapper.findByUserAndUpdatedAtBetween(userId, start, end);
    }

    public DiaryEntity updateDiary(Long diaryId, DiaryRequest request) {
        DiaryEntity existingDiary = diaryMapper.findById(diaryId)
                .orElseThrow(() -> new RuntimeException("Diary not found"));

        DiaryEntity diary = DiaryEntity.builder()
                .id(diaryId)
                .title(request.getTitle())
                .content(request.getContent())
                .emotion(request.getEmotion())
                .imageName(request.getImageName())
                .imagePath(request.getImagePath())
                .date(request.getDate())
                .user(existingDiary.getUser())
                .build();

        diaryMapper.update(diary);
        return diary;
    }

    public void deleteById(Long diaryId) {
        diaryMapper.deleteById(diaryId);
    }

    public List<DiaryEntity> getDiariesByUserId(Long userId) {
        return diaryMapper.findByUserId(userId);
    }

    public DiaryEntity getDiaryByDateAndUserId(String date, Long userId) {
        return diaryMapper.findByDateAndUserId(date, userId)
            .orElse(null);
    }

    public DiaryEntity getDiaryById(Long diaryId) {
        return diaryMapper.findById(diaryId).orElse(null);
    }
}