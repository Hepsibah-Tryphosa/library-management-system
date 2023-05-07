import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IStudent, NewStudent } from '../student.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStudent for edit and NewStudentFormGroupInput for create.
 */
type StudentFormGroupInput = IStudent | PartialWithRequiredKeyOf<NewStudent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IStudent | NewStudent> = Omit<T, 'joiningDate'> & {
  joiningDate?: string | null;
};

type StudentFormRawValue = FormValueOf<IStudent>;

type NewStudentFormRawValue = FormValueOf<NewStudent>;

type StudentFormDefaults = Pick<NewStudent, 'id' | 'joiningDate'>;

type StudentFormGroupContent = {
  id: FormControl<StudentFormRawValue['id'] | NewStudent['id']>;
  emailId: FormControl<StudentFormRawValue['emailId']>;
  name: FormControl<StudentFormRawValue['name']>;
  rollNo: FormControl<StudentFormRawValue['rollNo']>;
  joiningDate: FormControl<StudentFormRawValue['joiningDate']>;
};

export type StudentFormGroup = FormGroup<StudentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StudentFormService {
  createStudentFormGroup(student: StudentFormGroupInput = { id: null }): StudentFormGroup {
    const studentRawValue = this.convertStudentToStudentRawValue({
      ...this.getFormDefaults(),
      ...student,
    });
    return new FormGroup<StudentFormGroupContent>({
      id: new FormControl(
        { value: studentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      emailId: new FormControl(studentRawValue.emailId, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      name: new FormControl(studentRawValue.name, {
        validators: [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9? ]+$')],
      }),
      rollNo: new FormControl(studentRawValue.rollNo, {
        validators: [Validators.maxLength(50)],
      }),
      joiningDate: new FormControl(studentRawValue.joiningDate),
    });
  }

  getStudent(form: StudentFormGroup): IStudent | NewStudent {
    return this.convertStudentRawValueToStudent(form.getRawValue() as StudentFormRawValue | NewStudentFormRawValue);
  }

  resetForm(form: StudentFormGroup, student: StudentFormGroupInput): void {
    const studentRawValue = this.convertStudentToStudentRawValue({ ...this.getFormDefaults(), ...student });
    form.reset(
      {
        ...studentRawValue,
        id: { value: studentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StudentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      joiningDate: currentTime,
    };
  }

  private convertStudentRawValueToStudent(rawStudent: StudentFormRawValue | NewStudentFormRawValue): IStudent | NewStudent {
    return {
      ...rawStudent,
      joiningDate: dayjs(rawStudent.joiningDate, DATE_TIME_FORMAT),
    };
  }

  private convertStudentToStudentRawValue(
    student: IStudent | (Partial<NewStudent> & StudentFormDefaults)
  ): StudentFormRawValue | PartialWithRequiredKeyOf<NewStudentFormRawValue> {
    return {
      ...student,
      joiningDate: student.joiningDate ? student.joiningDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
