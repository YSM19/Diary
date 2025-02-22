package com.backend.diary.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserEntity {
    private Long id;
    private String email;
    private String password;
    private String username;

    @Builder
    public UserEntity(Long id, String email, String password, String username) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
    }
}