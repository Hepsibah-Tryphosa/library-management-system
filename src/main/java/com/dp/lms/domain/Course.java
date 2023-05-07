package com.dp.lms.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Course.
 */
@Entity
@Table(name = "course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 10)
    @Column(name = "name", length = 10, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "courses")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "courses", "bookHistories", "books" }, allowSetters = true)
    private Set<Student> students = new HashSet<>();

    @ManyToMany(mappedBy = "courses")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "courses", "students", "bookHistories" }, allowSetters = true)
    private Set<Book> books = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Course id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Course name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Student> getStudents() {
        return this.students;
    }

    public void setStudents(Set<Student> students) {
        if (this.students != null) {
            this.students.forEach(i -> i.removeCourse(this));
        }
        if (students != null) {
            students.forEach(i -> i.addCourse(this));
        }
        this.students = students;
    }

    public Course students(Set<Student> students) {
        this.setStudents(students);
        return this;
    }

    public Course addStudent(Student student) {
        this.students.add(student);
        student.getCourses().add(this);
        return this;
    }

    public Course removeStudent(Student student) {
        this.students.remove(student);
        student.getCourses().remove(this);
        return this;
    }

    public Set<Book> getBooks() {
        return this.books;
    }

    public void setBooks(Set<Book> books) {
        if (this.books != null) {
            this.books.forEach(i -> i.removeCourse(this));
        }
        if (books != null) {
            books.forEach(i -> i.addCourse(this));
        }
        this.books = books;
    }

    public Course books(Set<Book> books) {
        this.setBooks(books);
        return this;
    }

    public Course addBook(Book book) {
        this.books.add(book);
        book.getCourses().add(this);
        return this;
    }

    public Course removeBook(Book book) {
        this.books.remove(book);
        book.getCourses().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Course)) {
            return false;
        }
        return id != null && id.equals(((Course) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Course{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
