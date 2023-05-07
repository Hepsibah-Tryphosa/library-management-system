package com.dp.lms.web.rest;

import com.dp.lms.domain.BookHistory;
import com.dp.lms.repository.BookHistoryRepository;
import com.dp.lms.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.dp.lms.domain.BookHistory}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BookHistoryResource {

    private final Logger log = LoggerFactory.getLogger(BookHistoryResource.class);

    private static final String ENTITY_NAME = "bookHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookHistoryRepository bookHistoryRepository;

    public BookHistoryResource(BookHistoryRepository bookHistoryRepository) {
        this.bookHistoryRepository = bookHistoryRepository;
    }

    /**
     * {@code POST  /book-histories} : Create a new bookHistory.
     *
     * @param bookHistory the bookHistory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bookHistory, or with status {@code 400 (Bad Request)} if the bookHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/book-histories")
    public ResponseEntity<BookHistory> createBookHistory(@RequestBody BookHistory bookHistory) throws URISyntaxException {
        log.debug("REST request to save BookHistory : {}", bookHistory);
        if (bookHistory.getId() != null) {
            throw new BadRequestAlertException("A new bookHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BookHistory result = bookHistoryRepository.save(bookHistory);
        return ResponseEntity
            .created(new URI("/api/book-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /book-histories/:id} : Updates an existing bookHistory.
     *
     * @param id the id of the bookHistory to save.
     * @param bookHistory the bookHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookHistory,
     * or with status {@code 400 (Bad Request)} if the bookHistory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bookHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/book-histories/{id}")
    public ResponseEntity<BookHistory> updateBookHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BookHistory bookHistory
    ) throws URISyntaxException {
        log.debug("REST request to update BookHistory : {}, {}", id, bookHistory);
        if (bookHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookHistory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookHistoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BookHistory result = bookHistoryRepository.save(bookHistory);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookHistory.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /book-histories/:id} : Partial updates given fields of an existing bookHistory, field will ignore if it is null
     *
     * @param id the id of the bookHistory to save.
     * @param bookHistory the bookHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookHistory,
     * or with status {@code 400 (Bad Request)} if the bookHistory is not valid,
     * or with status {@code 404 (Not Found)} if the bookHistory is not found,
     * or with status {@code 500 (Internal Server Error)} if the bookHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/book-histories/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BookHistory> partialUpdateBookHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BookHistory bookHistory
    ) throws URISyntaxException {
        log.debug("REST request to partial update BookHistory partially : {}, {}", id, bookHistory);
        if (bookHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookHistory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookHistoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BookHistory> result = bookHistoryRepository
            .findById(bookHistory.getId())
            .map(existingBookHistory -> {
                if (bookHistory.getBookState() != null) {
                    existingBookHistory.setBookState(bookHistory.getBookState());
                }
                if (bookHistory.getIssuedDate() != null) {
                    existingBookHistory.setIssuedDate(bookHistory.getIssuedDate());
                }
                if (bookHistory.getReturnDate() != null) {
                    existingBookHistory.setReturnDate(bookHistory.getReturnDate());
                }
                if (bookHistory.getCreatedDate() != null) {
                    existingBookHistory.setCreatedDate(bookHistory.getCreatedDate());
                }

                return existingBookHistory;
            })
            .map(bookHistoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookHistory.getId().toString())
        );
    }

    /**
     * {@code GET  /book-histories} : get all the bookHistories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bookHistories in body.
     */
    @GetMapping("/book-histories")
    public List<BookHistory> getAllBookHistories() {
        log.debug("REST request to get all BookHistories");
        return bookHistoryRepository.findAll();
    }

    /**
     * {@code GET  /book-histories/:id} : get the "id" bookHistory.
     *
     * @param id the id of the bookHistory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bookHistory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/book-histories/{id}")
    public ResponseEntity<BookHistory> getBookHistory(@PathVariable Long id) {
        log.debug("REST request to get BookHistory : {}", id);
        Optional<BookHistory> bookHistory = bookHistoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bookHistory);
    }

    /**
     * {@code DELETE  /book-histories/:id} : delete the "id" bookHistory.
     *
     * @param id the id of the bookHistory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/book-histories/{id}")
    public ResponseEntity<Void> deleteBookHistory(@PathVariable Long id) {
        log.debug("REST request to delete BookHistory : {}", id);
        bookHistoryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
