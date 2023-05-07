import { IStudent } from 'app/entities/student/student.model';
import { IBook } from 'app/entities/book/book.model';

export interface ICourse {
  id: number;
  name?: string | null;
  students?: Pick<IStudent, 'id'>[] | null;
  books?: Pick<IBook, 'id'>[] | null;
}

export type NewCourse = Omit<ICourse, 'id'> & { id: null };
