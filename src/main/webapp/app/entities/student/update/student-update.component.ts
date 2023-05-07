import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { StudentFormService, StudentFormGroup } from './student-form.service';
import { IStudent } from '../student.model';
import { StudentService } from '../service/student.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { IBookHistory } from 'app/entities/book-history/book-history.model';
import { BookHistoryService } from 'app/entities/book-history/service/book-history.service';

@Component({
  selector: 'jhi-student-update',
  templateUrl: './student-update.component.html',
})
export class StudentUpdateComponent implements OnInit {
  isSaving = false;
  student: IStudent | null = null;

  coursesSharedCollection: ICourse[] = [];
  bookHistoriesSharedCollection: IBookHistory[] = [];

  editForm: StudentFormGroup = this.studentFormService.createStudentFormGroup();

  constructor(
    protected studentService: StudentService,
    protected studentFormService: StudentFormService,
    protected courseService: CourseService,
    protected bookHistoryService: BookHistoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCourse = (o1: ICourse | null, o2: ICourse | null): boolean => this.courseService.compareCourse(o1, o2);

  compareBookHistory = (o1: IBookHistory | null, o2: IBookHistory | null): boolean => this.bookHistoryService.compareBookHistory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      this.student = student;
      if (student) {
        this.updateForm(student);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const student = this.studentFormService.getStudent(this.editForm);
    if (student.id !== null) {
      this.subscribeToSaveResponse(this.studentService.update(student));
    } else {
      this.subscribeToSaveResponse(this.studentService.create(student));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudent>>): void {
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

  protected updateForm(student: IStudent): void {
    this.student = student;
    this.studentFormService.resetForm(this.editForm, student);

    this.coursesSharedCollection = this.courseService.addCourseToCollectionIfMissing<ICourse>(
      this.coursesSharedCollection,
      ...(student.courses ?? [])
    );
    this.bookHistoriesSharedCollection = this.bookHistoryService.addBookHistoryToCollectionIfMissing<IBookHistory>(
      this.bookHistoriesSharedCollection,
      ...(student.bookHistories ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.courseService
      .query()
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(
        map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing<ICourse>(courses, ...(this.student?.courses ?? [])))
      )
      .subscribe((courses: ICourse[]) => (this.coursesSharedCollection = courses));

    this.bookHistoryService
      .query()
      .pipe(map((res: HttpResponse<IBookHistory[]>) => res.body ?? []))
      .pipe(
        map((bookHistories: IBookHistory[]) =>
          this.bookHistoryService.addBookHistoryToCollectionIfMissing<IBookHistory>(bookHistories, ...(this.student?.bookHistories ?? []))
        )
      )
      .subscribe((bookHistories: IBookHistory[]) => (this.bookHistoriesSharedCollection = bookHistories));
  }
}
