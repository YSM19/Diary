package com.backend.diary.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.backend.diary.entity.DiaryEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Mapper
public interface DiaryMapper {
    List<DiaryEntity> findByUserAndDateBetween(@Param("userId") Long userId,
                                               @Param("startDate") String startDate,
                                               @Param("endDate") String endDate);
    Optional<DiaryEntity> findByDateAndUserId(@Param("date") String date, @Param("userId") Long userId);
    List<DiaryEntity> findByUserId(Long userId);
    Optional<DiaryEntity> findById(Long id);
    int save(DiaryEntity diary);
    int update(DiaryEntity diary);
    int deleteById(Long id);
}
