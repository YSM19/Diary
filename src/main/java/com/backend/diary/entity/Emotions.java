package com.backend.diary.entity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public enum Emotions {
    verygood, // 매우 좋음
    good, // 좋음
    soso, // 그냥 그럼
    bad, // 나쁨
    verybad, // 매우나쁨
}