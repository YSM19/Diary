package com.backend.diary.dto;

import com.backend.diary.entity.Emotions;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DiaryRequest {
    private String userEmail;
    private String title;
    private String content;
    private Emotions emotion;
    private String imageName;
    private String imagePath;
    private String date;

    @Builder
    public DiaryRequest(String userEmail, String title, String content, Emotions emotion, String imageName, String imagePath, String date) {
        this.userEmail = userEmail;
        this.title = title;
        this.content = content;
        this.emotion = emotion;
        this.imageName = imageName;
        this.imagePath = imagePath;
        this.date = date;
    }
}
