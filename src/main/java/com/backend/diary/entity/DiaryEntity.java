package com.backend.diary.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class DiaryEntity {
    private Long id;
    private String title;
    private String content;
    private Emotions emotion;
    private String imageName;
    private String imagePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserEntity user;
    private String date;

    @Builder
    public DiaryEntity(Long id, String title, String content, Emotions emotion,
                      String imageName, String imagePath, UserEntity user, String date) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.emotion = emotion;
        this.imageName = imageName;
        this.imagePath = imagePath;
        this.user = user;
        this.date = date;
    }
}