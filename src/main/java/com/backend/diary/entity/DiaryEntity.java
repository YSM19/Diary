package com.backend.diary.entity;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Table(name = "diary")
@EntityListeners(AuditingEntityListener.class)
@Entity
@Getter
@NoArgsConstructor
public class DiaryEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;

    @Enumerated(EnumType.STRING)
    private Emotions emotion;

    private String imageName;
    private String imagePath;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "date")
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