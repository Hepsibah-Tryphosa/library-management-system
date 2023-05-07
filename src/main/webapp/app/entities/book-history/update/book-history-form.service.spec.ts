import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../book-history.test-samples';

import { BookHistoryFormService } from './book-history-form.service';

describe('BookHistory Form Service', () => {
  let service: BookHistoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookHistoryFormService);
  });

  describe('Service methods', () => {
    describe('createBookHistoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBookHistoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            bookState: expect.any(Object),
            issuedDate: expect.any(Object),
            returnDate: expect.any(Object),
            createdDate: expect.any(Object),
            books: expect.any(Object),
            students: expect.any(Object),
          })
        );
      });

      it('passing IBookHistory should create a new form with FormGroup', () => {
        const formGroup = service.createBookHistoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            bookState: expect.any(Object),
            issuedDate: expect.any(Object),
            returnDate: expect.any(Object),
            createdDate: expect.any(Object),
            books: expect.any(Object),
            students: expect.any(Object),
          })
        );
      });
    });

    describe('getBookHistory', () => {
      it('should return NewBookHistory for default BookHistory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBookHistoryFormGroup(sampleWithNewData);

        const bookHistory = service.getBookHistory(formGroup) as any;

        expect(bookHistory).toMatchObject(sampleWithNewData);
      });

      it('should return NewBookHistory for empty BookHistory initial value', () => {
        const formGroup = service.createBookHistoryFormGroup();

        const bookHistory = service.getBookHistory(formGroup) as any;

        expect(bookHistory).toMatchObject({});
      });

      it('should return IBookHistory', () => {
        const formGroup = service.createBookHistoryFormGroup(sampleWithRequiredData);

        const bookHistory = service.getBookHistory(formGroup) as any;

        expect(bookHistory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBookHistory should not enable id FormControl', () => {
        const formGroup = service.createBookHistoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBookHistory should disable id FormControl', () => {
        const formGroup = service.createBookHistoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
