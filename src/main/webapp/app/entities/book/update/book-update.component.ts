import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BookFormService, BookFormGroup } from './book-form.service';
import { IBook } from '../book.model';
import { BookService } from '../service/book.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IBookHistory } from 'app/entities/book-history/book-history.model';
import { BookHistoryService } from 'app/entities/book-history/service/book-history.service';
import { BookState } from 'app/entities/enumerations/book-state.model';

@Component({
  selector: 'jhi-book-update',
  templateUrl: './book-update.component.html',
})
export class BookUpdateComponent implements OnInit {
  isSaving = false;
  book: IBook | null = null;
  bookStateValues = Object.keys(BookState);

  coursesSharedCollection: ICourse[] = [];
  studentsSharedCollection: IStudent[] = [];
  bookHistoriesSharedCollection: IBookHistory[] = [];

  editForm: BookFormGroup = this.bookFormService.createBookFormGroup();

  constructor(
    protected bookService: BookService,
    protected bookFormService: BookFormService,
    protected courseService: CourseService,
    protected studentService: StudentService,
    protected bookHistoryService: BookHistoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCourse = (o1: ICourse | null, o2: ICourse | null): boolean => this.courseService.compareCourse(o1, o2);

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  compareBookHistory = (o1: IBookHistory | null, o2: IBookHistory | null): boolean => this.bookHistoryService.compareBookHistory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ book }) => {
      this.book = book;
      if (book) {
        this.updateForm(book);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const book = this.bookFormService.getBook(this.editForm);
    if (book.id !== null) {
      this.subscribeToSaveResponse(this.bookService.update(book));
    } else {
      this.subscribeToSaveResponse(this.bookService.create(book));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(book: IBook): void {
    this.book = book;
    this.bookFormService.resetForm(this.editForm, book);

    this.coursesSharedCollection = this.courseService.addCourseToCollectionIfMissing<ICourse>(
      this.coursesSharedCollection,
      ...(book.courses ?? [])
    );
    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      ...(book.students ?? [])
    );
    this.bookHistoriesSharedCollection = this.bookHistoryService.addBookHistoryToCollectionIfMissing<IBookHistory>(
      this.bookHistoriesSharedCollection,
      ...(book.bookHistories ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.courseService
      .query()
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing<ICourse>(courses, ...(this.book?.courses ?? []))))
      .subscribe((courses: ICourse[]) => (this.coursesSharedCollection = courses));

    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) =>
          this.studentService.addStudentToCollectionIfMissing<IStudent>(students, ...(this.book?.students ?? []))
        )
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));

    this.bookHistoryService
      .query()
      .pipe(map((res: HttpResponse<IBookHistory[]>) => res.body ?? []))
      .pipe(
        map((bookHistories: IBookHistory[]) =>
          this.bookHistoryService.addBookHistoryToCollectionIfMissing<IBookHistory>(bookHistories, ...(this.book?.bookHistories ?? []))
        )
      )
      .subscribe((bookHistories: IBookHistory[]) => (this.bookHistoriesSharedCollection = bookHistories));
  }
}
