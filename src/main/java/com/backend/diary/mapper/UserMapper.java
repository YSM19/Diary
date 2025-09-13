package com.backend.diary.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.backend.diary.entity.UserEntity;
import java.util.Optional;

@Mapper
public interface UserMapper {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findById(Long id);
    int save(UserEntity user);
    int update(UserEntity user);
    int delete(String email);
    boolean existsById(Long id);
} 