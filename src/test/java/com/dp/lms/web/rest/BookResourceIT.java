package com.dp.lms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dp.lms.IntegrationTest;
import com.dp.lms.domain.Book;
import com.dp.lms.domain.enumeration.BookState;
import com.dp.lms.repository.BookRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BookResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BookResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_ISBN = "AAAAAAAAAA";
    private static final String UPDATED_ISBN = "BBBBBBBBBB";

    private static final String DEFAULT_PUBLISHER = "AAAAAAAAAA";
    private static final String UPDATED_PUBLISHER = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRICE = 1;
    private static final Integer UPDATED_PRICE = 2;

    private static final BookState DEFAULT_BOOK_STATE = BookState.AVAILABLE;
    private static final BookState UPDATED_BOOK_STATE = BookState.ISSUED;

    private static final LocalDate DEFAULT_ISSUED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_ISSUED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_RETURN_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_RETURN_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/books";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BookRepository bookRepository;

    @Mock
    private BookRepository bookRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBookMockMvc;

    private Book book;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Book createEntity(EntityManager em) {
        Book book = new Book()
            .title(DEFAULT_TITLE)
            .author(DEFAULT_AUTHOR)
            .isbn(DEFAULT_ISBN)
            .publisher(DEFAULT_PUBLISHER)
            .price(DEFAULT_PRICE)
            .bookState(DEFAULT_BOOK_STATE)
            .issuedDate(DEFAULT_ISSUED_DATE)
            .returnDate(DEFAULT_RETURN_DATE)
            .createdDate(DEFAULT_CREATED_DATE);
        return book;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Book createUpdatedEntity(EntityManager em) {
        Book book = new Book()
            .title(UPDATED_TITLE)
            .author(UPDATED_AUTHOR)
            .isbn(UPDATED_ISBN)
            .publisher(UPDATED_PUBLISHER)
            .price(UPDATED_PRICE)
            .bookState(UPDATED_BOOK_STATE)
            .issuedDate(UPDATED_ISSUED_DATE)
            .returnDate(UPDATED_RETURN_DATE)
            .createdDate(UPDATED_CREATED_DATE);
        return book;
    }

    @BeforeEach
    public void initTest() {
        book = createEntity(em);
    }

    @Test
    @Transactional
    void createBook() throws Exception {
        int databaseSizeBeforeCreate = bookRepository.findAll().size();
        // Create the Book
        restBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(book)))
            .andExpect(status().isCreated());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeCreate + 1);
        Book testBook = bookList.get(bookList.size() - 1);
        assertThat(testBook.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testBook.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testBook.getIsbn()).isEqualTo(DEFAULT_ISBN);
        assertThat(testBook.getPublisher()).isEqualTo(DEFAULT_PUBLISHER);
        assertThat(testBook.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testBook.getBookState()).isEqualTo(DEFAULT_BOOK_STATE);
        assertThat(testBook.getIssuedDate()).isEqualTo(DEFAULT_ISSUED_DATE);
        assertThat(testBook.getReturnDate()).isEqualTo(DEFAULT_RETURN_DATE);
        assertThat(testBook.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void createBookWithExistingId() throws Exception {
        // Create the Book with an existing ID
        book.setId(1L);

        int databaseSizeBeforeCreate = bookRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(book)))
            .andExpect(status().isBadRequest());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = bookRepository.findAll().size();
        // set the field null
        book.setTitle(null);

        // Create the Book, which fails.

        restBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(book)))
            .andExpect(status().isBadRequest());

        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAuthorIsRequired() throws Exception {
        int databaseSizeBeforeTest = bookRepository.findAll().size();
        // set the field null
        book.setAuthor(null);

        // Create the Book, which fails.

        restBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(book)))
            .andExpect(status().isBadRequest());

        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPublisherIsRequired() throws Exception {
        int databaseSizeBeforeTest = bookRepository.findAll().size();
        // set the field null
        book.setPublisher(null);

        // Create the Book, which fails.

        restBookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(book)))
            .andExpect(status().isBadRequest());

        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBooks() throws Exception {
        // Initialize the database
        bookRepository.saveAndFlush(book);

        // Get all the bookList
        restBookMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(book.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR)))
            .andExpect(jsonPath("$.[*].isbn").value(hasItem(DEFAULT_ISBN)))
            .andExpect(jsonPath("$.[*].publisher").value(hasItem(DEFAULT_PUBLISHER)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.[*].bookState").value(hasItem(DEFAULT_BOOK_STATE.toString())))
            .andExpect(jsonPath("$.[*].issuedDate").value(hasItem(DEFAULT_ISSUED_DATE.toString())))
            .andExpect(jsonPath("$.[*].returnDate").value(hasItem(DEFAULT_RETURN_DATE.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBooksWithEagerRelationshipsIsEnabled() throws Exception {
        when(bookRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBookMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(bookRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBooksWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(bookRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBookMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(bookRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getBook() throws Exception {
        // Initialize the database
        bookRepository.saveAndFlush(book);

        // Get the book
        restBookMockMvc
            .perform(get(ENTITY_API_URL_ID, book.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(book.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR))
            .andExpect(jsonPath("$.isbn").value(DEFAULT_ISBN))
            .andExpect(jsonPath("$.publisher").value(DEFAULT_PUBLISHER))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE))
            .andExpect(jsonPath("$.bookState").value(DEFAULT_BOOK_STATE.toString()))
            .andExpect(jsonPath("$.issuedDate").value(DEFAULT_ISSUED_DATE.toString()))
            .andExpect(jsonPath("$.returnDate").value(DEFAULT_RETURN_DATE.toString()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBook() throws Exception {
        // Get the book
        restBookMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBook() throws Exception {
        // Initialize the database
        bookRepository.saveAndFlush(book);

        int databaseSizeBeforeUpdate = bookRepository.findAll().size();

        // Update the book
        Book updatedBook = bookRepository.findById(book.getId()).get();
        // Disconnect from session so that the updates on updatedBook are not directly saved in db
        em.detach(updatedBook);
        updatedBook
            .title(UPDATED_TITLE)
            .author(UPDATED_AUTHOR)
            .isbn(UPDATED_ISBN)
            .publisher(UPDATED_PUBLISHER)
            .price(UPDATED_PRICE)
            .bookState(UPDATED_BOOK_STATE)
            .issuedDate(UPDATED_ISSUED_DATE)
            .returnDate(UPDATED_RETURN_DATE)
            .createdDate(UPDATED_CREATED_DATE);

        restBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBook.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBook))
            )
            .andExpect(status().isOk());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate);
        Book testBook = bookList.get(bookList.size() - 1);
        assertThat(testBook.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBook.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testBook.getIsbn()).isEqualTo(UPDATED_ISBN);
        assertThat(testBook.getPublisher()).isEqualTo(UPDATED_PUBLISHER);
        assertThat(testBook.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testBook.getBookState()).isEqualTo(UPDATED_BOOK_STATE);
        assertThat(testBook.getIssuedDate()).isEqualTo(UPDATED_ISSUED_DATE);
        assertThat(testBook.getReturnDate()).isEqualTo(UPDATED_RETURN_DATE);
        assertThat(testBook.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingBook() throws Exception {
        int databaseSizeBeforeUpdate = bookRepository.findAll().size();
        book.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, book.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(book))
            )
            .andExpect(status().isBadRequest());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBook() throws Exception {
        int databaseSizeBeforeUpdate = bookRepository.findAll().size();
        book.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(book))
            )
            .andExpect(status().isBadRequest());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBook() throws Exception {
        int databaseSizeBeforeUpdate = bookRepository.findAll().size();
        book.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(book)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBookWithPatch() throws Exception {
        // Initialize the database
        bookRepository.saveAndFlush(book);

        int databaseSizeBeforeUpdate = bookRepository.findAll().size();

        // Update the book using partial update
        Book partialUpdatedBook = new Book();
        partialUpdatedBook.setId(book.getId());

        partialUpdatedBook.price(UPDATED_PRICE).returnDate(UPDATED_RETURN_DATE);

        restBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBook))
            )
            .andExpect(status().isOk());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate);
        Book testBook = bookList.get(bookList.size() - 1);
        assertThat(testBook.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testBook.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testBook.getIsbn()).isEqualTo(DEFAULT_ISBN);
        assertThat(testBook.getPublisher()).isEqualTo(DEFAULT_PUBLISHER);
        assertThat(testBook.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testBook.getBookState()).isEqualTo(DEFAULT_BOOK_STATE);
        assertThat(testBook.getIssuedDate()).isEqualTo(DEFAULT_ISSUED_DATE);
        assertThat(testBook.getReturnDate()).isEqualTo(UPDATED_RETURN_DATE);
        assertThat(testBook.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateBookWithPatch() throws Exception {
        // Initialize the database
        bookRepository.saveAndFlush(book);

        int databaseSizeBeforeUpdate = bookRepository.findAll().size();

        // Update the book using partial update
        Book partialUpdatedBook = new Book();
        partialUpdatedBook.setId(book.getId());

        partialUpdatedBook
            .title(UPDATED_TITLE)
            .author(UPDATED_AUTHOR)
            .isbn(UPDATED_ISBN)
            .publisher(UPDATED_PUBLISHER)
            .price(UPDATED_PRICE)
            .bookState(UPDATED_BOOK_STATE)
            .issuedDate(UPDATED_ISSUED_DATE)
            .returnDate(UPDATED_RETURN_DATE)
            .createdDate(UPDATED_CREATED_DATE);

        restBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBook))
            )
            .andExpect(status().isOk());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate);
        Book testBook = bookList.get(bookList.size() - 1);
        assertThat(testBook.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBook.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testBook.getIsbn()).isEqualTo(UPDATED_ISBN);
        assertThat(testBook.getPublisher()).isEqualTo(UPDATED_PUBLISHER);
        assertThat(testBook.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testBook.getBookState()).isEqualTo(UPDATED_BOOK_STATE);
        assertThat(testBook.getIssuedDate()).isEqualTo(UPDATED_ISSUED_DATE);
        assertThat(testBook.getReturnDate()).isEqualTo(UPDATED_RETURN_DATE);
        assertThat(testBook.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingBook() throws Exception {
        int databaseSizeBeforeUpdate = bookRepository.findAll().size();
        book.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, book.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(book))
            )
            .andExpect(status().isBadRequest());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBook() throws Exception {
        int databaseSizeBeforeUpdate = bookRepository.findAll().size();
        book.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(book))
            )
            .andExpect(status().isBadRequest());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBook() throws Exception {
        int databaseSizeBeforeUpdate = bookRepository.findAll().size();
        book.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(book)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Book in the database
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBook() throws Exception {
        // Initialize the database
        bookRepository.saveAndFlush(book);

        int databaseSizeBeforeDelete = bookRepository.findAll().size();

        // Delete the book
        restBookMockMvc
            .perform(delete(ENTITY_API_URL_ID, book.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Book> bookList = bookRepository.findAll();
        assertThat(bookList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
