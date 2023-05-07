package com.dp.lms.domain;

import java.io.Serializable;
import java.time.Instant;
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
    @Pattern(regexp = "^[A-Za-z0-9? ]+$")
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Size(max = 50)
    @Column(name = "roll_no", length = 50)
    private String rollNo;

    @Column(name = "joining_date")
    private Instant joiningDate;

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

    public Instant getJoiningDate() {
        return this.joiningDate;
    }

    public Student joiningDate(Instant joiningDate) {
        this.setJoiningDate(joiningDate);
        return this;
    }

    public void setJoiningDate(Instant joiningDate) {
        this.joiningDate = joiningDate;
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
