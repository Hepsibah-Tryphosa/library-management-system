import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBookHistory, NewBookHistory } from '../book-history.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBookHistory for edit and NewBookHistoryFormGroupInput for create.
 */
type BookHistoryFormGroupInput = IBookHistory | PartialWithRequiredKeyOf<NewBookHistory>;

type BookHistoryFormDefaults = Pick<NewBookHistory, 'id' | 'books' | 'students'>;

type BookHistoryFormGroupContent = {
  id: FormControl<IBookHistory['id'] | NewBookHistory['id']>;
  bookState: FormControl<IBookHistory['bookState']>;
  issuedDate: FormControl<IBookHistory['issuedDate']>;
  returnDate: FormControl<IBookHistory['returnDate']>;
  createdDate: FormControl<IBookHistory['createdDate']>;
  books: FormControl<IBookHistory['books']>;
  students: FormControl<IBookHistory['students']>;
};

export type BookHistoryFormGroup = FormGroup<BookHistoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BookHistoryFormService {
  createBookHistoryFormGroup(bookHistory: BookHistoryFormGroupInput = { id: null }): BookHistoryFormGroup {
    const bookHistoryRawValue = {
      ...this.getFormDefaults(),
      ...bookHistory,
    };
    return new FormGroup<BookHistoryFormGroupContent>({
      id: new FormControl(
        { value: bookHistoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      bookState: new FormControl(bookHistoryRawValue.bookState),
      issuedDate: new FormControl(bookHistoryRawValue.issuedDate),
      returnDate: new FormControl(bookHistoryRawValue.returnDate),
      createdDate: new FormControl(bookHistoryRawValue.createdDate),
      books: new FormControl(bookHistoryRawValue.books ?? []),
      students: new FormControl(bookHistoryRawValue.students ?? []),
    });
  }

  getBookHistory(form: BookHistoryFormGroup): IBookHistory | NewBookHistory {
    return form.getRawValue() as IBookHistory | NewBookHistory;
  }

  resetForm(form: BookHistoryFormGroup, bookHistory: BookHistoryFormGroupInput): void {
    const bookHistoryRawValue = { ...this.getFormDefaults(), ...bookHistory };
    form.reset(
      {
        ...bookHistoryRawValue,
        id: { value: bookHistoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BookHistoryFormDefaults {
    return {
      id: null,
      books: [],
      students: [],
    };
  }
}
