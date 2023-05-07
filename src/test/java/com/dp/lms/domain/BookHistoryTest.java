package com.dp.lms.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.dp.lms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BookHistoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BookHistory.class);
        BookHistory bookHistory1 = new BookHistory();
        bookHistory1.setId(1L);
        BookHistory bookHistory2 = new BookHistory();
        bookHistory2.setId(bookHistory1.getId());
        assertThat(bookHistory1).isEqualTo(bookHistory2);
        bookHistory2.setId(2L);
        assertThat(bookHistory1).isNotEqualTo(bookHistory2);
        bookHistory1.setId(null);
        assertThat(bookHistory1).isNotEqualTo(bookHistory2);
    }
}
