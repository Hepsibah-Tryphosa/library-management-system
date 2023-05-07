import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BookHistoryFormService } from './book-history-form.service';
import { BookHistoryService } from '../service/book-history.service';
import { IBookHistory } from '../book-history.model';

import { BookHistoryUpdateComponent } from './book-history-update.component';

describe('BookHistory Management Update Component', () => {
  let comp: BookHistoryUpdateComponent;
  let fixture: ComponentFixture<BookHistoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookHistoryFormService: BookHistoryFormService;
  let bookHistoryService: BookHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BookHistoryUpdateComponent],
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
      .overrideTemplate(BookHistoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookHistoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookHistoryFormService = TestBed.inject(BookHistoryFormService);
    bookHistoryService = TestBed.inject(BookHistoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const bookHistory: IBookHistory = { id: 456 };

      activatedRoute.data = of({ bookHistory });
      comp.ngOnInit();

      expect(comp.bookHistory).toEqual(bookHistory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookHistory>>();
      const bookHistory = { id: 123 };
      jest.spyOn(bookHistoryFormService, 'getBookHistory').mockReturnValue(bookHistory);
      jest.spyOn(bookHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookHistory }));
      saveSubject.complete();

      // THEN
      expect(bookHistoryFormService.getBookHistory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookHistoryService.update).toHaveBeenCalledWith(expect.objectContaining(bookHistory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookHistory>>();
      const bookHistory = { id: 123 };
      jest.spyOn(bookHistoryFormService, 'getBookHistory').mockReturnValue({ id: null });
      jest.spyOn(bookHistoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookHistory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookHistory }));
      saveSubject.complete();

      // THEN
      expect(bookHistoryFormService.getBookHistory).toHaveBeenCalled();
      expect(bookHistoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookHistory>>();
      const bookHistory = { id: 123 };
      jest.spyOn(bookHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookHistoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
