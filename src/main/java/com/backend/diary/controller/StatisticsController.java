package com.backend.diary.controller;

import com.backend.diary.entity.UserEntity;
import com.backend.diary.service.StatisticsService;
import com.backend.diary.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StatisticsController {
    private final StatisticsService statisticsService;
    private final UserService userService;

    @GetMapping("/emotions")
    public ResponseEntity<?> getEmotionStatistics(@RequestParam String email) {
        try {
            UserEntity user = userService.findUserByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Map<String, Object> statistics = statisticsService.getEmotionStatistics(user.getId());
            System.out.println("Statistics data: " + statistics);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

} 