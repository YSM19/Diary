package com.backend.diary.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
public class UserDto {
    private String email;
    private String username;
    private String rawPassword;

    @Builder
    public UserDto(String email, String username, String rawPassword) {
        this.email = email;
        this.rawPassword = rawPassword;
        this.username = username;
    }
}
