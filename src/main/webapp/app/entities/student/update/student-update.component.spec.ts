import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StudentFormService } from './student-form.service';
import { StudentService } from '../service/student.service';
import { IStudent } from '../student.model';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { IBookHistory } from 'app/entities/book-history/book-history.model';
import { BookHistoryService } from 'app/entities/book-history/service/book-history.service';

import { StudentUpdateComponent } from './student-update.component';

describe('Student Management Update Component', () => {
  let comp: StudentUpdateComponent;
  let fixture: ComponentFixture<StudentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studentFormService: StudentFormService;
  let studentService: StudentService;
  let courseService: CourseService;
  let bookHistoryService: BookHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StudentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(StudentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studentFormService = TestBed.inject(StudentFormService);
    studentService = TestBed.inject(StudentService);
    courseService = TestBed.inject(CourseService);
    bookHistoryService = TestBed.inject(BookHistoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Course query and add missing value', () => {
      const student: IStudent = { id: 456 };
      const courses: ICourse[] = [{ id: 41397 }];
      student.courses = courses;

      const courseCollection: ICourse[] = [{ id: 92109 }];
      jest.spyOn(courseService, 'query').mockReturnValue(of(new HttpResponse({ body: courseCollection })));
      const additionalCourses = [...courses];
      const expectedCollection: ICourse[] = [...additionalCourses, ...courseCollection];
      jest.spyOn(courseService, 'addCourseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(courseService.query).toHaveBeenCalled();
      expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(
        courseCollection,
        ...additionalCourses.map(expect.objectContaining)
      );
      expect(comp.coursesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BookHistory query and add missing value', () => {
      const student: IStudent = { id: 456 };
      const bookHistories: IBookHistory[] = [{ id: 11908 }];
      student.bookHistories = bookHistories;

      const bookHistoryCollection: IBookHistory[] = [{ id: 78548 }];
      jest.spyOn(bookHistoryService, 'query').mockReturnValue(of(new HttpResponse({ body: bookHistoryCollection })));
      const additionalBookHistories = [...bookHistories];
      const expectedCollection: IBookHistory[] = [...additionalBookHistories, ...bookHistoryCollection];
      jest.spyOn(bookHistoryService, 'addBookHistoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(bookHistoryService.query).toHaveBeenCalled();
      expect(bookHistoryService.addBookHistoryToCollectionIfMissing).toHaveBeenCalledWith(
        bookHistoryCollection,
        ...additionalBookHistories.map(expect.objectContaining)
      );
      expect(comp.bookHistoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const student: IStudent = { id: 456 };
      const course: ICourse = { id: 40043 };
      student.courses = [course];
      const bookHistory: IBookHistory = { id: 31026 };
      student.bookHistories = [bookHistory];

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(comp.coursesSharedCollection).toContain(course);
      expect(comp.bookHistoriesSharedCollection).toContain(bookHistory);
      expect(comp.student).toEqual(student);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentFormService, 'getStudent').mockReturnValue(student);
      jest.spyOn(studentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: student }));
      saveSubject.complete();

      // THEN
      expect(studentFormService.getStudent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(studentService.update).toHaveBeenCalledWith(expect.objectContaining(student));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentFormService, 'getStudent').mockReturnValue({ id: null });
      jest.spyOn(studentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: student }));
      saveSubject.complete();

      // THEN
      expect(studentFormService.getStudent).toHaveBeenCalled();
      expect(studentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudent>>();
      const student = { id: 123 };
      jest.spyOn(studentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(studentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCourse', () => {
      it('Should forward to courseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(courseService, 'compareCourse');
        comp.compareCourse(entity, entity2);
        expect(courseService.compareCourse).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareBookHistory', () => {
      it('Should forward to bookHistoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(bookHistoryService, 'compareBookHistory');
        comp.compareBookHistory(entity, entity2);
        expect(bookHistoryService.compareBookHistory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
