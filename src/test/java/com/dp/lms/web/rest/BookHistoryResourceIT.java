package com.dp.lms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dp.lms.IntegrationTest;
import com.dp.lms.domain.BookHistory;
import com.dp.lms.domain.enumeration.BookState;
import com.dp.lms.repository.BookHistoryRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BookHistoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BookHistoryResourceIT {

    private static final BookState DEFAULT_BOOK_STATE = BookState.AVAILABLE;
    private static final BookState UPDATED_BOOK_STATE = BookState.ISSUED;

    private static final LocalDate DEFAULT_ISSUED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_ISSUED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_RETURN_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_RETURN_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/book-histories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BookHistoryRepository bookHistoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBookHistoryMockMvc;

    private BookHistory bookHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookHistory createEntity(EntityManager em) {
        BookHistory bookHistory = new BookHistory()
            .bookState(DEFAULT_BOOK_STATE)
            .issuedDate(DEFAULT_ISSUED_DATE)
            .returnDate(DEFAULT_RETURN_DATE)
            .createdDate(DEFAULT_CREATED_DATE);
        return bookHistory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookHistory createUpdatedEntity(EntityManager em) {
        BookHistory bookHistory = new BookHistory()
            .bookState(UPDATED_BOOK_STATE)
            .issuedDate(UPDATED_ISSUED_DATE)
            .returnDate(UPDATED_RETURN_DATE)
            .createdDate(UPDATED_CREATED_DATE);
        return bookHistory;
    }

    @BeforeEach
    public void initTest() {
        bookHistory = createEntity(em);
    }

    @Test
    @Transactional
    void createBookHistory() throws Exception {
        int databaseSizeBeforeCreate = bookHistoryRepository.findAll().size();
        // Create the BookHistory
        restBookHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookHistory)))
            .andExpect(status().isCreated());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        BookHistory testBookHistory = bookHistoryList.get(bookHistoryList.size() - 1);
        assertThat(testBookHistory.getBookState()).isEqualTo(DEFAULT_BOOK_STATE);
        assertThat(testBookHistory.getIssuedDate()).isEqualTo(DEFAULT_ISSUED_DATE);
        assertThat(testBookHistory.getReturnDate()).isEqualTo(DEFAULT_RETURN_DATE);
        assertThat(testBookHistory.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void createBookHistoryWithExistingId() throws Exception {
        // Create the BookHistory with an existing ID
        bookHistory.setId(1L);

        int databaseSizeBeforeCreate = bookHistoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBookHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookHistory)))
            .andExpect(status().isBadRequest());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBookHistories() throws Exception {
        // Initialize the database
        bookHistoryRepository.saveAndFlush(bookHistory);

        // Get all the bookHistoryList
        restBookHistoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bookHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].bookState").value(hasItem(DEFAULT_BOOK_STATE.toString())))
            .andExpect(jsonPath("$.[*].issuedDate").value(hasItem(DEFAULT_ISSUED_DATE.toString())))
            .andExpect(jsonPath("$.[*].returnDate").value(hasItem(DEFAULT_RETURN_DATE.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }

    @Test
    @Transactional
    void getBookHistory() throws Exception {
        // Initialize the database
        bookHistoryRepository.saveAndFlush(bookHistory);

        // Get the bookHistory
        restBookHistoryMockMvc
            .perform(get(ENTITY_API_URL_ID, bookHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bookHistory.getId().intValue()))
            .andExpect(jsonPath("$.bookState").value(DEFAULT_BOOK_STATE.toString()))
            .andExpect(jsonPath("$.issuedDate").value(DEFAULT_ISSUED_DATE.toString()))
            .andExpect(jsonPath("$.returnDate").value(DEFAULT_RETURN_DATE.toString()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBookHistory() throws Exception {
        // Get the bookHistory
        restBookHistoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBookHistory() throws Exception {
        // Initialize the database
        bookHistoryRepository.saveAndFlush(bookHistory);

        int databaseSizeBeforeUpdate = bookHistoryRepository.findAll().size();

        // Update the bookHistory
        BookHistory updatedBookHistory = bookHistoryRepository.findById(bookHistory.getId()).get();
        // Disconnect from session so that the updates on updatedBookHistory are not directly saved in db
        em.detach(updatedBookHistory);
        updatedBookHistory
            .bookState(UPDATED_BOOK_STATE)
            .issuedDate(UPDATED_ISSUED_DATE)
            .returnDate(UPDATED_RETURN_DATE)
            .createdDate(UPDATED_CREATED_DATE);

        restBookHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBookHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBookHistory))
            )
            .andExpect(status().isOk());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeUpdate);
        BookHistory testBookHistory = bookHistoryList.get(bookHistoryList.size() - 1);
        assertThat(testBookHistory.getBookState()).isEqualTo(UPDATED_BOOK_STATE);
        assertThat(testBookHistory.getIssuedDate()).isEqualTo(UPDATED_ISSUED_DATE);
        assertThat(testBookHistory.getReturnDate()).isEqualTo(UPDATED_RETURN_DATE);
        assertThat(testBookHistory.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingBookHistory() throws Exception {
        int databaseSizeBeforeUpdate = bookHistoryRepository.findAll().size();
        bookHistory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bookHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bookHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBookHistory() throws Exception {
        int databaseSizeBeforeUpdate = bookHistoryRepository.findAll().size();
        bookHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bookHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBookHistory() throws Exception {
        int databaseSizeBeforeUpdate = bookHistoryRepository.findAll().size();
        bookHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookHistoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookHistory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBookHistoryWithPatch() throws Exception {
        // Initialize the database
        bookHistoryRepository.saveAndFlush(bookHistory);

        int databaseSizeBeforeUpdate = bookHistoryRepository.findAll().size();

        // Update the bookHistory using partial update
        BookHistory partialUpdatedBookHistory = new BookHistory();
        partialUpdatedBookHistory.setId(bookHistory.getId());

        partialUpdatedBookHistory.bookState(UPDATED_BOOK_STATE).issuedDate(UPDATED_ISSUED_DATE).returnDate(UPDATED_RETURN_DATE);

        restBookHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBookHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBookHistory))
            )
            .andExpect(status().isOk());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeUpdate);
        BookHistory testBookHistory = bookHistoryList.get(bookHistoryList.size() - 1);
        assertThat(testBookHistory.getBookState()).isEqualTo(UPDATED_BOOK_STATE);
        assertThat(testBookHistory.getIssuedDate()).isEqualTo(UPDATED_ISSUED_DATE);
        assertThat(testBookHistory.getReturnDate()).isEqualTo(UPDATED_RETURN_DATE);
        assertThat(testBookHistory.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateBookHistoryWithPatch() throws Exception {
        // Initialize the database
        bookHistoryRepository.saveAndFlush(bookHistory);

        int databaseSizeBeforeUpdate = bookHistoryRepository.findAll().size();

        // Update the bookHistory using partial update
        BookHistory partialUpdatedBookHistory = new BookHistory();
        partialUpdatedBookHistory.setId(bookHistory.getId());

        partialUpdatedBookHistory
            .bookState(UPDATED_BOOK_STATE)
            .issuedDate(UPDATED_ISSUED_DATE)
            .returnDate(UPDATED_RETURN_DATE)
            .createdDate(UPDATED_CREATED_DATE);

        restBookHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBookHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBookHistory))
            )
            .andExpect(status().isOk());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeUpdate);
        BookHistory testBookHistory = bookHistoryList.get(bookHistoryList.size() - 1);
        assertThat(testBookHistory.getBookState()).isEqualTo(UPDATED_BOOK_STATE);
        assertThat(testBookHistory.getIssuedDate()).isEqualTo(UPDATED_ISSUED_DATE);
        assertThat(testBookHistory.getReturnDate()).isEqualTo(UPDATED_RETURN_DATE);
        assertThat(testBookHistory.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingBookHistory() throws Exception {
        int databaseSizeBeforeUpdate = bookHistoryRepository.findAll().size();
        bookHistory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bookHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bookHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBookHistory() throws Exception {
        int databaseSizeBeforeUpdate = bookHistoryRepository.findAll().size();
        bookHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bookHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBookHistory() throws Exception {
        int databaseSizeBeforeUpdate = bookHistoryRepository.findAll().size();
        bookHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bookHistory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BookHistory in the database
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBookHistory() throws Exception {
        // Initialize the database
        bookHistoryRepository.saveAndFlush(bookHistory);

        int databaseSizeBeforeDelete = bookHistoryRepository.findAll().size();

        // Delete the bookHistory
        restBookHistoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, bookHistory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BookHistory> bookHistoryList = bookHistoryRepository.findAll();
        assertThat(bookHistoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
