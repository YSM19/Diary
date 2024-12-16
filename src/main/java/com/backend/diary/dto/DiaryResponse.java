package com.backend.diary.dto;

import com.backend.diary.entity.Emotions;
import lombok.Builder;
import lombok.Getter;

@Getter
public class DiaryResponse {
    private Long id;
    private String title;
    private String content;
    private Emotions emotion;
    private String imageName;
    private String imagePath;
    private String date;
    @Builder
    public DiaryResponse(Long id, String title, String content,
                         Emotions emotion, String imageName,
                         String imagePath, String date) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.emotion = emotion;
        this.imageName = imageName;
        this.imagePath = imagePath;
        this.date = date;
    }
}