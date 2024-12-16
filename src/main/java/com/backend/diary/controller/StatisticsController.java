package com.backend.diary.controller;

import com.backend.diary.entity.UserEntity;
import com.backend.diary.service.StatisticsService;
import com.backend.diary.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {
    private final StatisticsService statisticsService;
    private final UserService userService;

    @GetMapping("/emotions")
    public ResponseEntity<?> getEmotionStatistics(@RequestParam String email) {
        try {
            UserEntity user = userService.findUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("user is null");
            }

            Map<String, Object> statistics = statisticsService.getEmotionStatistics(user.getId());
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

} 