package com.backend.diary.controller;

import com.backend.diary.dto.LoginDto;
import com.backend.diary.dto.UserDto;
import com.backend.diary.entity.UserEntity;
import com.backend.diary.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDto loginDto) {
        System.out.println("Received login request: " + loginDto);
        String token = userService.loginUser(loginDto);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/post")
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        System.out.println("Received user data: " + userDto);
        
        if (userDto.getRawPassword() == null) {
            return ResponseEntity.badRequest().body("Password cannot be null");
        }
        
        UserEntity user = userService.createUser(
            userDto.getEmail(), 
            userDto.getRawPassword(), 
            userDto.getUsername()
        );
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userEmail}")
    public ResponseEntity<UserEntity> findUser(@PathVariable String userEmail) {
        UserEntity user = userService.findUserByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{userEmail}")
    public ResponseEntity<UserEntity> updateUser(
            @PathVariable String userEmail, 
            @RequestBody UserDto userDto) {
        UserEntity updatedUser = userService.updateUser(
            userEmail, 
            userDto.getRawPassword(), 
            userDto.getUsername()
        );
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{userEmail}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userEmail) {
        userService.deleteUser(userEmail);
        return ResponseEntity.noContent().build();
    }
}
