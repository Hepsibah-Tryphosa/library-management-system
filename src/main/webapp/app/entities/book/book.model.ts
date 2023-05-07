import dayjs from 'dayjs/esm';
import { ICourse } from 'app/entities/course/course.model';
import { IStudent } from 'app/entities/student/student.model';
import { IBookHistory } from 'app/entities/book-history/book-history.model';
import { BookState } from 'app/entities/enumerations/book-state.model';

export interface IBook {
  id: number;
  title?: string | null;
  author?: string | null;
  isbn?: string | null;
  publisher?: string | null;
  price?: number | null;
  bookState?: BookState | null;
  issuedDate?: dayjs.Dayjs | null;
  returnDate?: dayjs.Dayjs | null;
  createdDate?: dayjs.Dayjs | null;
  courses?: Pick<ICourse, 'id'>[] | null;
  students?: Pick<IStudent, 'id'>[] | null;
  bookHistories?: Pick<IBookHistory, 'id'>[] | null;
}

export type NewBook = Omit<IBook, 'id'> & { id: null };
