import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BookFormService } from './book-form.service';
import { BookService } from '../service/book.service';
import { IBook } from '../book.model';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IBookHistory } from 'app/entities/book-history/book-history.model';
import { BookHistoryService } from 'app/entities/book-history/service/book-history.service';

import { BookUpdateComponent } from './book-update.component';

describe('Book Management Update Component', () => {
  let comp: BookUpdateComponent;
  let fixture: ComponentFixture<BookUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookFormService: BookFormService;
  let bookService: BookService;
  let courseService: CourseService;
  let studentService: StudentService;
  let bookHistoryService: BookHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BookUpdateComponent],
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
      .overrideTemplate(BookUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookFormService = TestBed.inject(BookFormService);
    bookService = TestBed.inject(BookService);
    courseService = TestBed.inject(CourseService);
    studentService = TestBed.inject(StudentService);
    bookHistoryService = TestBed.inject(BookHistoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Course query and add missing value', () => {
      const book: IBook = { id: 456 };
      const courses: ICourse[] = [{ id: 90887 }];
      book.courses = courses;

      const courseCollection: ICourse[] = [{ id: 77213 }];
      jest.spyOn(courseService, 'query').mockReturnValue(of(new HttpResponse({ body: courseCollection })));
      const additionalCourses = [...courses];
      const expectedCollection: ICourse[] = [...additionalCourses, ...courseCollection];
      jest.spyOn(courseService, 'addCourseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(courseService.query).toHaveBeenCalled();
      expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(
        courseCollection,
        ...additionalCourses.map(expect.objectContaining)
      );
      expect(comp.coursesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Student query and add missing value', () => {
      const book: IBook = { id: 456 };
      const students: IStudent[] = [{ id: 81395 }];
      book.students = students;

      const studentCollection: IStudent[] = [{ id: 88962 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [...students];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining)
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BookHistory query and add missing value', () => {
      const book: IBook = { id: 456 };
      const bookHistories: IBookHistory[] = [{ id: 90217 }];
      book.bookHistories = bookHistories;

      const bookHistoryCollection: IBookHistory[] = [{ id: 28844 }];
      jest.spyOn(bookHistoryService, 'query').mockReturnValue(of(new HttpResponse({ body: bookHistoryCollection })));
      const additionalBookHistories = [...bookHistories];
      const expectedCollection: IBookHistory[] = [...additionalBookHistories, ...bookHistoryCollection];
      jest.spyOn(bookHistoryService, 'addBookHistoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(bookHistoryService.query).toHaveBeenCalled();
      expect(bookHistoryService.addBookHistoryToCollectionIfMissing).toHaveBeenCalledWith(
        bookHistoryCollection,
        ...additionalBookHistories.map(expect.objectContaining)
      );
      expect(comp.bookHistoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const book: IBook = { id: 456 };
      const course: ICourse = { id: 82074 };
      book.courses = [course];
      const student: IStudent = { id: 24220 };
      book.students = [student];
      const bookHistory: IBookHistory = { id: 13049 };
      book.bookHistories = [bookHistory];

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(comp.coursesSharedCollection).toContain(course);
      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.bookHistoriesSharedCollection).toContain(bookHistory);
      expect(comp.book).toEqual(book);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: 123 };
      jest.spyOn(bookFormService, 'getBook').mockReturnValue(book);
      jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: book }));
      saveSubject.complete();

      // THEN
      expect(bookFormService.getBook).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookService.update).toHaveBeenCalledWith(expect.objectContaining(book));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: 123 };
      jest.spyOn(bookFormService, 'getBook').mockReturnValue({ id: null });
      jest.spyOn(bookService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: book }));
      saveSubject.complete();

      // THEN
      expect(bookFormService.getBook).toHaveBeenCalled();
      expect(bookService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: 123 };
      jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookService.update).toHaveBeenCalled();
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

    describe('compareStudent', () => {
      it('Should forward to studentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(studentService, 'compareStudent');
        comp.compareStudent(entity, entity2);
        expect(studentService.compareStudent).toHaveBeenCalledWith(entity, entity2);
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
