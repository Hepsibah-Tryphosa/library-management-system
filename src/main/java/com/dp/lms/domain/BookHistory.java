package com.dp.lms.domain;

import com.dp.lms.domain.enumeration.BookState;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BookHistory.
 */
@Entity
@Table(name = "book_history")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BookHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_state")
    private BookState bookState;

    @Column(name = "issued_date")
    private LocalDate issuedDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @ManyToMany(mappedBy = "bookHistories")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "courses", "students", "bookHistories" }, allowSetters = true)
    private Set<Book> books = new HashSet<>();

    @ManyToMany(mappedBy = "bookHistories")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "courses", "bookHistories", "books" }, allowSetters = true)
    private Set<Student> students = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BookHistory id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BookState getBookState() {
        return this.bookState;
    }

    public BookHistory bookState(BookState bookState) {
        this.setBookState(bookState);
        return this;
    }

    public void setBookState(BookState bookState) {
        this.bookState = bookState;
    }

    public LocalDate getIssuedDate() {
        return this.issuedDate;
    }

    public BookHistory issuedDate(LocalDate issuedDate) {
        this.setIssuedDate(issuedDate);
        return this;
    }

    public void setIssuedDate(LocalDate issuedDate) {
        this.issuedDate = issuedDate;
    }

    public LocalDate getReturnDate() {
        return this.returnDate;
    }

    public BookHistory returnDate(LocalDate returnDate) {
        this.setReturnDate(returnDate);
        return this;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public BookHistory createdDate(LocalDate createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Set<Book> getBooks() {
        return this.books;
    }

    public void setBooks(Set<Book> books) {
        if (this.books != null) {
            this.books.forEach(i -> i.removeBookHistory(this));
        }
        if (books != null) {
            books.forEach(i -> i.addBookHistory(this));
        }
        this.books = books;
    }

    public BookHistory books(Set<Book> books) {
        this.setBooks(books);
        return this;
    }

    public BookHistory addBook(Book book) {
        this.books.add(book);
        book.getBookHistories().add(this);
        return this;
    }

    public BookHistory removeBook(Book book) {
        this.books.remove(book);
        book.getBookHistories().remove(this);
        return this;
    }

    public Set<Student> getStudents() {
        return this.students;
    }

    public void setStudents(Set<Student> students) {
        if (this.students != null) {
            this.students.forEach(i -> i.removeBookHistory(this));
        }
        if (students != null) {
            students.forEach(i -> i.addBookHistory(this));
        }
        this.students = students;
    }

    public BookHistory students(Set<Student> students) {
        this.setStudents(students);
        return this;
    }

    public BookHistory addStudent(Student student) {
        this.students.add(student);
        student.getBookHistories().add(this);
        return this;
    }

    public BookHistory removeStudent(Student student) {
        this.students.remove(student);
        student.getBookHistories().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BookHistory)) {
            return false;
        }
        return id != null && id.equals(((BookHistory) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BookHistory{" +
            "id=" + getId() +
            ", bookState='" + getBookState() + "'" +
            ", issuedDate='" + getIssuedDate() + "'" +
            ", returnDate='" + getReturnDate() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
