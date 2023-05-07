import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBookHistory } from '../book-history.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../book-history.test-samples';

import { BookHistoryService, RestBookHistory } from './book-history.service';

const requireRestSample: RestBookHistory = {
  ...sampleWithRequiredData,
  issuedDate: sampleWithRequiredData.issuedDate?.format(DATE_FORMAT),
  returnDate: sampleWithRequiredData.returnDate?.format(DATE_FORMAT),
  createdDate: sampleWithRequiredData.createdDate?.format(DATE_FORMAT),
};

describe('BookHistory Service', () => {
  let service: BookHistoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IBookHistory | IBookHistory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BookHistoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a BookHistory', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const bookHistory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bookHistory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BookHistory', () => {
      const bookHistory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bookHistory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BookHistory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BookHistory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BookHistory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBookHistoryToCollectionIfMissing', () => {
      it('should add a BookHistory to an empty array', () => {
        const bookHistory: IBookHistory = sampleWithRequiredData;
        expectedResult = service.addBookHistoryToCollectionIfMissing([], bookHistory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bookHistory);
      });

      it('should not add a BookHistory to an array that contains it', () => {
        const bookHistory: IBookHistory = sampleWithRequiredData;
        const bookHistoryCollection: IBookHistory[] = [
          {
            ...bookHistory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBookHistoryToCollectionIfMissing(bookHistoryCollection, bookHistory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BookHistory to an array that doesn't contain it", () => {
        const bookHistory: IBookHistory = sampleWithRequiredData;
        const bookHistoryCollection: IBookHistory[] = [sampleWithPartialData];
        expectedResult = service.addBookHistoryToCollectionIfMissing(bookHistoryCollection, bookHistory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bookHistory);
      });

      it('should add only unique BookHistory to an array', () => {
        const bookHistoryArray: IBookHistory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bookHistoryCollection: IBookHistory[] = [sampleWithRequiredData];
        expectedResult = service.addBookHistoryToCollectionIfMissing(bookHistoryCollection, ...bookHistoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bookHistory: IBookHistory = sampleWithRequiredData;
        const bookHistory2: IBookHistory = sampleWithPartialData;
        expectedResult = service.addBookHistoryToCollectionIfMissing([], bookHistory, bookHistory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bookHistory);
        expect(expectedResult).toContain(bookHistory2);
      });

      it('should accept null and undefined values', () => {
        const bookHistory: IBookHistory = sampleWithRequiredData;
        expectedResult = service.addBookHistoryToCollectionIfMissing([], null, bookHistory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bookHistory);
      });

      it('should return initial array if no BookHistory is added', () => {
        const bookHistoryCollection: IBookHistory[] = [sampleWithRequiredData];
        expectedResult = service.addBookHistoryToCollectionIfMissing(bookHistoryCollection, undefined, null);
        expect(expectedResult).toEqual(bookHistoryCollection);
      });
    });

    describe('compareBookHistory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBookHistory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBookHistory(entity1, entity2);
        const compareResult2 = service.compareBookHistory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBookHistory(entity1, entity2);
        const compareResult2 = service.compareBookHistory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBookHistory(entity1, entity2);
        const compareResult2 = service.compareBookHistory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
