import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../college-info.test-samples';

import { CollegeInfoFormService } from './college-info-form.service';

describe('CollegeInfo Form Service', () => {
  let service: CollegeInfoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollegeInfoFormService);
  });

  describe('Service methods', () => {
    describe('createCollegeInfoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCollegeInfoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            contactNo: expect.any(Object),
            address: expect.any(Object),
            city: expect.any(Object),
          })
        );
      });

      it('passing ICollegeInfo should create a new form with FormGroup', () => {
        const formGroup = service.createCollegeInfoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            contactNo: expect.any(Object),
            address: expect.any(Object),
            city: expect.any(Object),
          })
        );
      });
    });

    describe('getCollegeInfo', () => {
      it('should return NewCollegeInfo for default CollegeInfo initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCollegeInfoFormGroup(sampleWithNewData);

        const collegeInfo = service.getCollegeInfo(formGroup) as any;

        expect(collegeInfo).toMatchObject(sampleWithNewData);
      });

      it('should return NewCollegeInfo for empty CollegeInfo initial value', () => {
        const formGroup = service.createCollegeInfoFormGroup();

        const collegeInfo = service.getCollegeInfo(formGroup) as any;

        expect(collegeInfo).toMatchObject({});
      });

      it('should return ICollegeInfo', () => {
        const formGroup = service.createCollegeInfoFormGroup(sampleWithRequiredData);

        const collegeInfo = service.getCollegeInfo(formGroup) as any;

        expect(collegeInfo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICollegeInfo should not enable id FormControl', () => {
        const formGroup = service.createCollegeInfoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCollegeInfo should disable id FormControl', () => {
        const formGroup = service.createCollegeInfoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
