package com.backend.diary.controller;

import com.backend.diary.dto.UserDto;
import com.backend.diary.entity.UserEntity;
import com.backend.diary.repository.UserRepository;
import com.backend.diary.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/post")
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        // 요청 데이터 로깅
        System.out.println("Received user data: " + userDto);
        
        // null 체크 추가
        if (userDto.getRawPassword() == null) {
            return ResponseEntity.badRequest().body("Password cannot be null");
        }
        
        UserEntity user = userService.createUser(userDto.getEmail(), userDto.getRawPassword(), userDto.getUsername());

        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userEamil}")
    public ResponseEntity<UserEntity> findUser(@PathVariable String userEamil) {
        UserEntity user = userService.findUserByEmail(userEamil);

        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{userEamil}")
    public ResponseEntity<UserEntity> updateUser(@PathVariable String userEamil, @RequestBody UserDto userDto,
                                                 String rawPassword) {
        UserEntity updateUser = userService.updateUser(userEamil, rawPassword, userDto.getUsername());

        return ResponseEntity.ok(updateUser);
    }

    @DeleteMapping("/{userEamil}")
    public ResponseEntity<UserEntity> deleteUser(@PathVariable String userEamil) {
        userService.deleteUser(userEamil);
        return ResponseEntity.noContent().build();
    }
}
