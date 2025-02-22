package com.backend.diary.dto;

import lombok.Data;

@Data
public class LoginDto {
    private String email;
    private String rawPassword;
}