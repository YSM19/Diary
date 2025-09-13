package com.backend.diary.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;
import com.backend.diary.entity.DiaryEntity;

@Mapper
public interface StatisticsMapper {
    List<DiaryEntity> findDiariesByUserId(@Param("userId") Long userId);
    int countTotalDiaries(@Param("userId") Long userId);
    List<Map<String, Object>> countEmotionsByUser(@Param("userId") Long userId);
    List<Map<String, Object>> getMonthlyEmotionStats(@Param("userId") Long userId);
} 