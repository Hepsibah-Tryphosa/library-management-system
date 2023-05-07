import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBook, NewBook } from '../book.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBook for edit and NewBookFormGroupInput for create.
 */
type BookFormGroupInput = IBook | PartialWithRequiredKeyOf<NewBook>;

type BookFormDefaults = Pick<NewBook, 'id' | 'courses' | 'students' | 'bookHistories'>;

type BookFormGroupContent = {
  id: FormControl<IBook['id'] | NewBook['id']>;
  title: FormControl<IBook['title']>;
  author: FormControl<IBook['author']>;
  isbn: FormControl<IBook['isbn']>;
  publisher: FormControl<IBook['publisher']>;
  price: FormControl<IBook['price']>;
  bookState: FormControl<IBook['bookState']>;
  issuedDate: FormControl<IBook['issuedDate']>;
  returnDate: FormControl<IBook['returnDate']>;
  createdDate: FormControl<IBook['createdDate']>;
  courses: FormControl<IBook['courses']>;
  students: FormControl<IBook['students']>;
  bookHistories: FormControl<IBook['bookHistories']>;
};

export type BookFormGroup = FormGroup<BookFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BookFormService {
  createBookFormGroup(book: BookFormGroupInput = { id: null }): BookFormGroup {
    const bookRawValue = {
      ...this.getFormDefaults(),
      ...book,
    };
    return new FormGroup<BookFormGroupContent>({
      id: new FormControl(
        { value: bookRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(bookRawValue.title, {
        validators: [Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9? ]+$')],
      }),
      author: new FormControl(bookRawValue.author, {
        validators: [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9? ]+$')],
      }),
      isbn: new FormControl(bookRawValue.isbn, {
        validators: [Validators.maxLength(13), Validators.pattern('^[A-Za-z0-9? ]+$')],
      }),
      publisher: new FormControl(bookRawValue.publisher, {
        validators: [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9? ]+$')],
      }),
      price: new FormControl(bookRawValue.price),
      bookState: new FormControl(bookRawValue.bookState),
      issuedDate: new FormControl(bookRawValue.issuedDate),
      returnDate: new FormControl(bookRawValue.returnDate),
      createdDate: new FormControl(bookRawValue.createdDate),
      courses: new FormControl(bookRawValue.courses ?? []),
      students: new FormControl(bookRawValue.students ?? []),
      bookHistories: new FormControl(bookRawValue.bookHistories ?? []),
    });
  }

  getBook(form: BookFormGroup): IBook | NewBook {
    return form.getRawValue() as IBook | NewBook;
  }

  resetForm(form: BookFormGroup, book: BookFormGroupInput): void {
    const bookRawValue = { ...this.getFormDefaults(), ...book };
    form.reset(
      {
        ...bookRawValue,
        id: { value: bookRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BookFormDefaults {
    return {
      id: null,
      courses: [],
      students: [],
      bookHistories: [],
    };
  }
}
