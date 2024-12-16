package com.backend.diary.service;

import com.backend.diary.entity.UserEntity;
import com.backend.diary.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // 유저 생성
    public UserEntity createUser(String email, String rawPassword, String username) {
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is null");
        }

        UserEntity user = UserEntity.builder()
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .username(username)
                .build();
        return userRepository.save(user);
    }

    // user 검색 / By email
    public UserEntity findUserByEmail(String useremail) {
        return userRepository.findByEmail(useremail);
    }

    // user 검색 / By id
    public UserEntity findUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    // 유저 수정
    public UserEntity updateUser(String email, String rawPassword, String username) {
        UserEntity user = userRepository.findByEmail(email);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        user = UserEntity.builder()
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .username(username)
                .build();
        return userRepository.save(user);
    }

    // user 삭제
    public void deleteUser(String email) {
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        UserEntity user = userRepository.findByEmail(email);
        userRepository.delete(user);
    }
}
