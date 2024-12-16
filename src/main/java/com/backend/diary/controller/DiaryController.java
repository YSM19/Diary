package com.backend.diary.controller;

import com.backend.diary.dto.DiaryRequest;
import com.backend.diary.dto.DiaryResponse;
import com.backend.diary.entity.DiaryEntity;
import com.backend.diary.entity.UserEntity;
import com.backend.diary.entity.Emotions;
import com.backend.diary.service.DiaryService;
import com.backend.diary.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {
    private final DiaryService diaryService;
    private final UserService userService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<?> createDiary(@ModelAttribute DiaryRequest diaryRequest,
                                       @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            // 사용자 검증
            String email = diaryRequest.getUserEmail();
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body("사용자 이메일이 필요합니다.");
            }

            UserEntity user = userService.findUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
            }

            // 이미지 처리
            if (image != null && !image.isEmpty()) {
                try {
                    handleImageUpload(image, diaryRequest);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("이미지 업로드 중 오류가 발생했습니다: " + e.getMessage());
                }
            }

            // 일기 저장
            DiaryEntity diary = diaryService.createDiary(user.getId(), diaryRequest);
            return ResponseEntity.ok(diaryService.toResponse(diary));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("일기 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/monthly/{year}/{month}") // 일기 월 단위로 조회
    public ResponseEntity<List<DiaryResponse>> getMonthlyDiaries(@RequestParam String email,
                                                                   @PathVariable int year, 
                                                                   @PathVariable int month) {
        try {
            UserEntity user = userService.findUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            List<DiaryEntity> diaries = diaryService.getMonthlyDiaries(user.getId(), year, month);

            List<DiaryResponse> response = diaries.stream()
                .map(diary -> diaryService.toResponse(diary))
                .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{date}") // 날짜 기준 일기 조회
    public ResponseEntity<?> getDiary(@PathVariable String date, @RequestParam String userEmail) {
        try {
            UserEntity user = userService.findUserByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
            }

            DiaryEntity diary = diaryService.getDiaryByDateAndUserId(date, user.getId());
            if (diary == null) {
                return ResponseEntity.ok(DiaryResponse.builder().build());
            }

            return ResponseEntity.ok(diaryService.toResponse(diary));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{diaryId}")
    public ResponseEntity<?> updateDiary(@PathVariable Long diaryId,
                                       @ModelAttribute DiaryRequest diaryRequest,
                                       @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            // 사용자 검증
            String email = diaryRequest.getUserEmail();
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body("사용자 이메일이 필요합니다.");
            }

            UserEntity user = userService.findUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
            }

            // 기존 일기 조회
            DiaryEntity existingDiary = diaryService.getDiaryById(diaryId);
            if (existingDiary == null) {
                return ResponseEntity.badRequest().body("수정할 일기를 찾을 수 없습니다.");
            }

            // 새 이미지가 없으면 기존 이미지 정보 유지
            if (image == null || image.isEmpty()) {
                diaryRequest.setImageName(existingDiary.getImageName());
                diaryRequest.setImagePath(existingDiary.getImagePath());
            } else {
                // 새 이미지가 있으면 업로드 처리
                handleImageUpload(image, diaryRequest);
            }

            DiaryEntity updatedDiary = diaryService.updateDiary(diaryId, diaryRequest);
            return ResponseEntity.ok(diaryService.toResponse(updatedDiary));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("일기 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @DeleteMapping("/{diaryId}/delete")
    public ResponseEntity<?> deleteDiary(@PathVariable Long diaryId, @RequestParam String userEmail) {
        try {
            UserEntity user = userService.findUserByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
            }

            diaryService.deleteById(diaryId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 이미지 처리 메서드
    private void handleImageUpload(MultipartFile image, DiaryRequest diaryRequest) throws IOException {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING); // 같은 이름의 파일이 있으면 덮어쓰기
        
        diaryRequest.setImageName(fileName);
        diaryRequest.setImagePath("/uploads/" + fileName);
    }

}
