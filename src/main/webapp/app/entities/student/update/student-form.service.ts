import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type StudentFormDefaults = Pick<NewStudent, 'id' | 'courses' | 'bookHistories' | 'books'>;

type StudentFormGroupContent = {
  id: FormControl<IStudent['id'] | NewStudent['id']>;
  emailId: FormControl<IStudent['emailId']>;
  name: FormControl<IStudent['name']>;
  rollNo: FormControl<IStudent['rollNo']>;
  joiningDate: FormControl<IStudent['joiningDate']>;
  courses: FormControl<IStudent['courses']>;
  bookHistories: FormControl<IStudent['bookHistories']>;
  books: FormControl<IStudent['books']>;
};

export type StudentFormGroup = FormGroup<StudentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StudentFormService {
  createStudentFormGroup(student: StudentFormGroupInput = { id: null }): StudentFormGroup {
    const studentRawValue = {
      ...this.getFormDefaults(),
      ...student,
    };
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
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      rollNo: new FormControl(studentRawValue.rollNo, {
        validators: [Validators.maxLength(50)],
      }),
      joiningDate: new FormControl(studentRawValue.joiningDate),
      courses: new FormControl(studentRawValue.courses ?? []),
      bookHistories: new FormControl(studentRawValue.bookHistories ?? []),
      books: new FormControl(studentRawValue.books ?? []),
    });
  }

  getStudent(form: StudentFormGroup): IStudent | NewStudent {
    return form.getRawValue() as IStudent | NewStudent;
  }

  resetForm(form: StudentFormGroup, student: StudentFormGroupInput): void {
    const studentRawValue = { ...this.getFormDefaults(), ...student };
    form.reset(
      {
        ...studentRawValue,
        id: { value: studentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StudentFormDefaults {
    return {
      id: null,
      courses: [],
      bookHistories: [],
      books: [],
    };
  }
}
