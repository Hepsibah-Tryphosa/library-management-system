import dayjs from 'dayjs/esm';
import { ICourse } from 'app/entities/course/course.model';
import { IBookHistory } from 'app/entities/book-history/book-history.model';
import { IBook } from 'app/entities/book/book.model';

export interface IStudent {
  id: number;
  emailId?: string | null;
  name?: string | null;
  rollNo?: string | null;
  joiningDate?: dayjs.Dayjs | null;
  courses?: Pick<ICourse, 'id'>[] | null;
  bookHistories?: Pick<IBookHistory, 'id'>[] | null;
  books?: Pick<IBook, 'id'>[] | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
