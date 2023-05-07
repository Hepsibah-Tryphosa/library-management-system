package com.dp.lms.domain;

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
 * A Student.
 */
@Entity
@Table(name = "student")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Student implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "email_id", length = 50, nullable = false, unique = true)
    private String emailId;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Size(max = 50)
    @Column(name = "roll_no", length = 50)
    private String rollNo;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @ManyToMany
    @JoinTable(
        name = "rel_student__course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "students", "books" }, allowSetters = true)
    private Set<Course> courses = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_student__book_history",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "book_history_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "books", "students" }, allowSetters = true)
    private Set<BookHistory> bookHistories = new HashSet<>();

    @ManyToMany(mappedBy = "students")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "courses", "students", "bookHistories" }, allowSetters = true)
    private Set<Book> books = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Student id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmailId() {
        return this.emailId;
    }

    public Student emailId(String emailId) {
        this.setEmailId(emailId);
        return this;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getName() {
        return this.name;
    }

    public Student name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRollNo() {
        return this.rollNo;
    }

    public Student rollNo(String rollNo) {
        this.setRollNo(rollNo);
        return this;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public LocalDate getJoiningDate() {
        return this.joiningDate;
    }

    public Student joiningDate(LocalDate joiningDate) {
        this.setJoiningDate(joiningDate);
        return this;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public Set<Course> getCourses() {
        return this.courses;
    }

    public void setCourses(Set<Course> courses) {
        this.courses = courses;
    }

    public Student courses(Set<Course> courses) {
        this.setCourses(courses);
        return this;
    }

    public Student addCourse(Course course) {
        this.courses.add(course);
        course.getStudents().add(this);
        return this;
    }

    public Student removeCourse(Course course) {
        this.courses.remove(course);
        course.getStudents().remove(this);
        return this;
    }

    public Set<BookHistory> getBookHistories() {
        return this.bookHistories;
    }

    public void setBookHistories(Set<BookHistory> bookHistories) {
        this.bookHistories = bookHistories;
    }

    public Student bookHistories(Set<BookHistory> bookHistories) {
        this.setBookHistories(bookHistories);
        return this;
    }

    public Student addBookHistory(BookHistory bookHistory) {
        this.bookHistories.add(bookHistory);
        bookHistory.getStudents().add(this);
        return this;
    }

    public Student removeBookHistory(BookHistory bookHistory) {
        this.bookHistories.remove(bookHistory);
        bookHistory.getStudents().remove(this);
        return this;
    }

    public Set<Book> getBooks() {
        return this.books;
    }

    public void setBooks(Set<Book> books) {
        if (this.books != null) {
            this.books.forEach(i -> i.removeStudent(this));
        }
        if (books != null) {
            books.forEach(i -> i.addStudent(this));
        }
        this.books = books;
    }

    public Student books(Set<Book> books) {
        this.setBooks(books);
        return this;
    }

    public Student addBook(Book book) {
        this.books.add(book);
        book.getStudents().add(this);
        return this;
    }

    public Student removeBook(Book book) {
        this.books.remove(book);
        book.getStudents().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Student)) {
            return false;
        }
        return id != null && id.equals(((Student) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Student{" +
            "id=" + getId() +
            ", emailId='" + getEmailId() + "'" +
            ", name='" + getName() + "'" +
            ", rollNo='" + getRollNo() + "'" +
            ", joiningDate='" + getJoiningDate() + "'" +
            "}";
    }
}
