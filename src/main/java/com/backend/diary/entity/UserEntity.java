package com.backend.diary.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Table(name = "user")
@Entity
@Getter
@NoArgsConstructor
public class UserEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String username;

//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    private List<DiaryEntity> diaries = new ArrayList<>();

    @Builder
    public UserEntity(String email, String password, String username) {
        this.email = email;
        this.password = password;
        this.username = username;
    }
}