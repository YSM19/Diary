package com.backend.diary.repository;

import com.backend.diary.entity.DiaryEntity;
import com.backend.diary.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<DiaryEntity, Long> {
    List<DiaryEntity> findByUserAndUpdatedAtBetween(UserEntity user, LocalDateTime start, LocalDateTime end);
    Optional<DiaryEntity> findByDateAndUserId(String date, Long userId);
    List<DiaryEntity> findByUser(UserEntity user);
    Optional<DiaryEntity> findFirstByDateAndUserIdOrderByIdDesc(String date, Long userId);
}