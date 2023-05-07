import dayjs from 'dayjs/esm';
import { IBook } from 'app/entities/book/book.model';
import { IStudent } from 'app/entities/student/student.model';
import { BookState } from 'app/entities/enumerations/book-state.model';

export interface IBookHistory {
  id: number;
  bookState?: BookState | null;
  issuedDate?: dayjs.Dayjs | null;
  returnDate?: dayjs.Dayjs | null;
  createdDate?: dayjs.Dayjs | null;
  books?: Pick<IBook, 'id'>[] | null;
  students?: Pick<IStudent, 'id'>[] | null;
}

export type NewBookHistory = Omit<IBookHistory, 'id'> & { id: null };
