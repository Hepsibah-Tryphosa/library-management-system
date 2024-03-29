package com.dp.lms.web.rest;

import com.dp.lms.domain.Book;
import com.dp.lms.domain.BookHistory;
import com.dp.lms.domain.enumeration.BookState;
import com.dp.lms.repository.BookRepository;
import com.dp.lms.web.rest.dto.BookSummary;
import com.dp.lms.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.dp.lms.domain.Book}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BookResource {

    private final Logger log = LoggerFactory.getLogger(BookResource.class);

    private static final String ENTITY_NAME = "book";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookRepository bookRepository;
    private final SessionFactory sessionFactory;

    public BookResource(BookRepository bookRepository, SessionFactory sessionFactory) {
        this.bookRepository = bookRepository;
        this.sessionFactory = sessionFactory;
    }

    /**
     * {@code POST  /books} : Create a new book.
     *
     * @param book the book to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new book, or with status {@code 400 (Bad Request)} if the
     *         book has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/books")
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) throws URISyntaxException {
        log.debug("REST request to save Book : {}", book);
        if (book.getId() != null) {
            throw new BadRequestAlertException("A new book cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Book result = bookRepository.save(book);
        return ResponseEntity
            .created(new URI("/api/books/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /books/:id} : Updates an existing book.
     *
     * @param id   the id of the book to save.
     * @param book the book to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated book,
     *         or with status {@code 400 (Bad Request)} if the book is not valid,
     *         or with status {@code 500 (Internal Server Error)} if the book
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/books/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Book book)
        throws URISyntaxException {
        log.debug("REST request to update Book : {}, {}", id, book);
        if (book.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, book.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (book.getBookState() == BookState.ISSUED) {
            book.setIssuedDate(LocalDate.now());
        }

        if (book.getBookState() == BookState.AVAILABLE) {
            book.setReturnDate(LocalDate.now());
            // Set<BookHistory> bookHistories = book.getBookHistories();
            // BookHistory bh = new BookHistory();
            // bh.addStudent(book.getStudents().iterator().next());
            // bookHistories.add(bh);
        }

        if (!bookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Book result = bookRepository.save(book);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, book.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /books/:id} : Partial updates given fields of an existing book,
     * field will ignore if it is null
     *
     * @param id   the id of the book to save.
     * @param book the book to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated book,
     *         or with status {@code 400 (Bad Request)} if the book is not valid,
     *         or with status {@code 404 (Not Found)} if the book is not found,
     *         or with status {@code 500 (Internal Server Error)} if the book
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/books/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Book> partialUpdateBook(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Book book
    ) throws URISyntaxException {
        log.debug("REST request to partial update Book partially : {}, {}", id, book);
        if (book.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, book.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Book> result = bookRepository
            .findById(book.getId())
            .map(existingBook -> {
                if (book.getTitle() != null) {
                    existingBook.setTitle(book.getTitle());
                }
                if (book.getAuthor() != null) {
                    existingBook.setAuthor(book.getAuthor());
                }
                if (book.getIsbn() != null) {
                    existingBook.setIsbn(book.getIsbn());
                }
                if (book.getPublisher() != null) {
                    existingBook.setPublisher(book.getPublisher());
                }
                if (book.getPrice() != null) {
                    existingBook.setPrice(book.getPrice());
                }
                if (book.getBookState() != null) {
                    existingBook.setBookState(book.getBookState());
                }
                if (book.getIssuedDate() != null) {
                    existingBook.setIssuedDate(book.getIssuedDate());
                }
                if (book.getReturnDate() != null) {
                    existingBook.setReturnDate(book.getReturnDate());
                }
                if (book.getCreatedDate() != null) {
                    existingBook.setCreatedDate(book.getCreatedDate());
                }

                return existingBook;
            })
            .map(bookRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, book.getId().toString())
        );
    }

    /**
     * {@code GET  /books} : get all the books.
     *
     * @param eagerload flag to eager load entities from relationships (This is
     *                  applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of books in body.
     */
    @GetMapping("/books")
    public List<Book> getAllBooks(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Books");
        if (eagerload) {
            return bookRepository.findAllWithEagerRelationships();
        } else {
            return bookRepository.findAll();
        }
    }

    /**
     * {@code GET  /books/:id} : get the "id" book.
     *
     * @param id the id of the book to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the book, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        log.debug("REST request to get Book : {}", id);
        Optional<Book> book = bookRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(book);
    }

    /**
     * {@code DELETE  /books/:id} : delete the "id" book.
     *
     * @param id the id of the book to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        log.debug("REST request to delete Book : {}", id);
        bookRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/books/summary")
    public ResponseEntity<BookSummary> getBookSummary() {
        BookSummary bookSummary = new BookSummary();
        String sql =
            "SELECT sum(case when book_state = 'AVAILABLE' then 1 else 0 end ) as avaiable , sum(case when book_state = 'ISSUED' then 1 else 0 end ) as issued,     sum(case when book_state = 'REQUESTED' then 1 else 0 end ) as requested, count(*) as total FROM  book b ";
        Session session = sessionFactory.openSession();
        // List list = session.createQuery(sql).list();
        List<Object[]> list = (List<Object[]>) session.createNativeQuery(sql).list();
        for (Object[] obj : list) {
            int i = 0;
            bookSummary.setAvailable(Integer.parseInt(obj[i++].toString()));
            bookSummary.setIssued(Integer.parseInt(obj[i++].toString()));
            bookSummary.setRequested(Integer.parseInt(obj[i++].toString()));
            bookSummary.setTotal(Integer.parseInt(obj[i++].toString()));
            break;
        }
        session.close();

        return ResponseEntity.ok().body(bookSummary);
    }
}
