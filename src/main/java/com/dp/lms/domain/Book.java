package com.dp.lms.domain;

import com.dp.lms.domain.enumeration.BookState;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Book.
 */
@Entity
@Table(name = "book")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Book implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Pattern(regexp = "^[A-Za-z0-9? ]+$")
    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @NotNull
    @Size(max = 50)
    @Pattern(regexp = "^[A-Za-z0-9? ]+$")
    @Column(name = "author", length = 50, nullable = false)
    private String author;

    @Size(max = 13)
    @Pattern(regexp = "^[A-Za-z0-9? ]+$")
    @Column(name = "isbn", length = 13)
    private String isbn;

    @NotNull
    @Size(max = 50)
    @Pattern(regexp = "^[A-Za-z0-9? ]+$")
    @Column(name = "publisher", length = 50, nullable = false)
    private String publisher;

    @Column(name = "price")
    private Integer price;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_state")
    private BookState bookState;

    @Column(name = "issued_date")
    private LocalDate issuedDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @ManyToMany
    @JoinTable(name = "rel_book__course", joinColumns = @JoinColumn(name = "book_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "students", "books" }, allowSetters = true)
    private Set<Course> courses = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_book__student",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "courses", "bookHistories", "books" }, allowSetters = true)
    private Set<Student> students = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_book__book_history",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "book_history_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "books", "students" }, allowSetters = true)
    private Set<BookHistory> bookHistories = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Book id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Book title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return this.author;
    }

    public Book author(String author) {
        this.setAuthor(author);
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return this.isbn;
    }

    public Book isbn(String isbn) {
        this.setIsbn(isbn);
        return this;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getPublisher() {
        return this.publisher;
    }

    public Book publisher(String publisher) {
        this.setPublisher(publisher);
        return this;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public Integer getPrice() {
        return this.price;
    }

    public Book price(Integer price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public BookState getBookState() {
        return this.bookState;
    }

    public Book bookState(BookState bookState) {
        this.setBookState(bookState);
        return this;
    }

    public void setBookState(BookState bookState) {
        this.bookState = bookState;
    }

    public LocalDate getIssuedDate() {
        return this.issuedDate;
    }

    public Book issuedDate(LocalDate issuedDate) {
        this.setIssuedDate(issuedDate);
        return this;
    }

    public void setIssuedDate(LocalDate issuedDate) {
        this.issuedDate = issuedDate;
    }

    public LocalDate getReturnDate() {
        return this.returnDate;
    }

    public Book returnDate(LocalDate returnDate) {
        this.setReturnDate(returnDate);
        return this;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public Book createdDate(LocalDate createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Set<Course> getCourses() {
        return this.courses;
    }

    public void setCourses(Set<Course> courses) {
        this.courses = courses;
    }

    public Book courses(Set<Course> courses) {
        this.setCourses(courses);
        return this;
    }

    public Book addCourse(Course course) {
        this.courses.add(course);
        course.getBooks().add(this);
        return this;
    }

    public Book removeCourse(Course course) {
        this.courses.remove(course);
        course.getBooks().remove(this);
        return this;
    }

    public Set<Student> getStudents() {
        return this.students;
    }

    public void setStudents(Set<Student> students) {
        this.students = students;
    }

    public Book students(Set<Student> students) {
        this.setStudents(students);
        return this;
    }

    public Book addStudent(Student student) {
        this.students.add(student);
        student.getBooks().add(this);
        return this;
    }

    public Book removeStudent(Student student) {
        this.students.remove(student);
        student.getBooks().remove(this);
        return this;
    }

    public Set<BookHistory> getBookHistories() {
        return this.bookHistories;
    }

    public void setBookHistories(Set<BookHistory> bookHistories) {
        this.bookHistories = bookHistories;
    }

    public Book bookHistories(Set<BookHistory> bookHistories) {
        this.setBookHistories(bookHistories);
        return this;
    }

    public Book addBookHistory(BookHistory bookHistory) {
        this.bookHistories.add(bookHistory);
        bookHistory.getBooks().add(this);
        return this;
    }

    public Book removeBookHistory(BookHistory bookHistory) {
        this.bookHistories.remove(bookHistory);
        bookHistory.getBooks().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Book)) {
            return false;
        }
        return id != null && id.equals(((Book) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Book{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", author='" + getAuthor() + "'" +
            ", isbn='" + getIsbn() + "'" +
            ", publisher='" + getPublisher() + "'" +
            ", price=" + getPrice() +
            ", bookState='" + getBookState() + "'" +
            ", issuedDate='" + getIssuedDate() + "'" +
            ", returnDate='" + getReturnDate() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
