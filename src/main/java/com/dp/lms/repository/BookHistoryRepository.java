package com.dp.lms.repository;

import com.dp.lms.domain.BookHistory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BookHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookHistoryRepository extends JpaRepository<BookHistory, Long> {}
