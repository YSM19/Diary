package com.backend.diary.service;

import com.backend.diary.dto.LoginDto;
import com.backend.diary.entity.UserEntity;
import com.backend.diary.mapper.UserMapper;
//import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

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
                
        userMapper.save(user);
        return user;
    }

    // user 검색 / By email
    public Optional<UserEntity> findUserByEmail(String useremail) {
        return userMapper.findByEmail(useremail);
    }

    // user 검색 / By id
    public UserEntity findUserById(Long userId) {
        return userMapper.findById(userId).orElse(null);
    }

    // 유저 수정
    public UserEntity updateUser(String email, String rawPassword, String username) {
        UserEntity user = userMapper.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user = UserEntity.builder()
                .id(user.getId())
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .username(username)
                .build();

        userMapper.update(user);
        return user;
    }

    // user 삭제
    public void deleteUser(String email) {
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        
        userMapper.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        userMapper.delete(email);
    }

    public String loginUser(LoginDto loginDto) {
        UserEntity user = userMapper.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginDto.getRawPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return generateToken(user);
    }
    

    private String generateToken(UserEntity user) {
        return "token-for-user-" + user.getId();
    }
}

