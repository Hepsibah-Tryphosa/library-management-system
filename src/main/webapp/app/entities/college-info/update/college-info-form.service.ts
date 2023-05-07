import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICollegeInfo, NewCollegeInfo } from '../college-info.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICollegeInfo for edit and NewCollegeInfoFormGroupInput for create.
 */
type CollegeInfoFormGroupInput = ICollegeInfo | PartialWithRequiredKeyOf<NewCollegeInfo>;

type CollegeInfoFormDefaults = Pick<NewCollegeInfo, 'id'>;

type CollegeInfoFormGroupContent = {
  id: FormControl<ICollegeInfo['id'] | NewCollegeInfo['id']>;
  name: FormControl<ICollegeInfo['name']>;
  contactNo: FormControl<ICollegeInfo['contactNo']>;
  address: FormControl<ICollegeInfo['address']>;
  city: FormControl<ICollegeInfo['city']>;
};

export type CollegeInfoFormGroup = FormGroup<CollegeInfoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CollegeInfoFormService {
  createCollegeInfoFormGroup(collegeInfo: CollegeInfoFormGroupInput = { id: null }): CollegeInfoFormGroup {
    const collegeInfoRawValue = {
      ...this.getFormDefaults(),
      ...collegeInfo,
    };
    return new FormGroup<CollegeInfoFormGroupContent>({
      id: new FormControl(
        { value: collegeInfoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(collegeInfoRawValue.name, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      contactNo: new FormControl(collegeInfoRawValue.contactNo, {
        validators: [Validators.required, Validators.maxLength(10)],
      }),
      address: new FormControl(collegeInfoRawValue.address, {
        validators: [Validators.maxLength(100)],
      }),
      city: new FormControl(collegeInfoRawValue.city, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
    });
  }

  getCollegeInfo(form: CollegeInfoFormGroup): ICollegeInfo | NewCollegeInfo {
    return form.getRawValue() as ICollegeInfo | NewCollegeInfo;
  }

  resetForm(form: CollegeInfoFormGroup, collegeInfo: CollegeInfoFormGroupInput): void {
    const collegeInfoRawValue = { ...this.getFormDefaults(), ...collegeInfo };
    form.reset(
      {
        ...collegeInfoRawValue,
        id: { value: collegeInfoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CollegeInfoFormDefaults {
    return {
      id: null,
    };
  }
}
