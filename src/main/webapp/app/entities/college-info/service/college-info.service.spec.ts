import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICollegeInfo } from '../college-info.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../college-info.test-samples';

import { CollegeInfoService } from './college-info.service';

const requireRestSample: ICollegeInfo = {
  ...sampleWithRequiredData,
};

describe('CollegeInfo Service', () => {
  let service: CollegeInfoService;
  let httpMock: HttpTestingController;
  let expectedResult: ICollegeInfo | ICollegeInfo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CollegeInfoService);
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

    it('should create a CollegeInfo', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const collegeInfo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(collegeInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CollegeInfo', () => {
      const collegeInfo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(collegeInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CollegeInfo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CollegeInfo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CollegeInfo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCollegeInfoToCollectionIfMissing', () => {
      it('should add a CollegeInfo to an empty array', () => {
        const collegeInfo: ICollegeInfo = sampleWithRequiredData;
        expectedResult = service.addCollegeInfoToCollectionIfMissing([], collegeInfo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(collegeInfo);
      });

      it('should not add a CollegeInfo to an array that contains it', () => {
        const collegeInfo: ICollegeInfo = sampleWithRequiredData;
        const collegeInfoCollection: ICollegeInfo[] = [
          {
            ...collegeInfo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCollegeInfoToCollectionIfMissing(collegeInfoCollection, collegeInfo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CollegeInfo to an array that doesn't contain it", () => {
        const collegeInfo: ICollegeInfo = sampleWithRequiredData;
        const collegeInfoCollection: ICollegeInfo[] = [sampleWithPartialData];
        expectedResult = service.addCollegeInfoToCollectionIfMissing(collegeInfoCollection, collegeInfo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(collegeInfo);
      });

      it('should add only unique CollegeInfo to an array', () => {
        const collegeInfoArray: ICollegeInfo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const collegeInfoCollection: ICollegeInfo[] = [sampleWithRequiredData];
        expectedResult = service.addCollegeInfoToCollectionIfMissing(collegeInfoCollection, ...collegeInfoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const collegeInfo: ICollegeInfo = sampleWithRequiredData;
        const collegeInfo2: ICollegeInfo = sampleWithPartialData;
        expectedResult = service.addCollegeInfoToCollectionIfMissing([], collegeInfo, collegeInfo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(collegeInfo);
        expect(expectedResult).toContain(collegeInfo2);
      });

      it('should accept null and undefined values', () => {
        const collegeInfo: ICollegeInfo = sampleWithRequiredData;
        expectedResult = service.addCollegeInfoToCollectionIfMissing([], null, collegeInfo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(collegeInfo);
      });

      it('should return initial array if no CollegeInfo is added', () => {
        const collegeInfoCollection: ICollegeInfo[] = [sampleWithRequiredData];
        expectedResult = service.addCollegeInfoToCollectionIfMissing(collegeInfoCollection, undefined, null);
        expect(expectedResult).toEqual(collegeInfoCollection);
      });
    });

    describe('compareCollegeInfo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCollegeInfo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCollegeInfo(entity1, entity2);
        const compareResult2 = service.compareCollegeInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCollegeInfo(entity1, entity2);
        const compareResult2 = service.compareCollegeInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCollegeInfo(entity1, entity2);
        const compareResult2 = service.compareCollegeInfo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
