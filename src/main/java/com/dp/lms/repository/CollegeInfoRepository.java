package com.dp.lms.repository;

import com.dp.lms.domain.CollegeInfo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CollegeInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CollegeInfoRepository extends JpaRepository<CollegeInfo, Long> {}
