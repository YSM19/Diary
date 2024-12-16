package com.backend.diary.repository;

import com.backend.diary.entity.DiaryEntity;
import com.backend.diary.entity.UserEntity;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
//    UserEntity findByemail(String useremail);
    UserEntity findByEmail(String userEmail);
}