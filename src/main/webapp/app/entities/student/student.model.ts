import dayjs from 'dayjs/esm';

export interface IStudent {
  id: number;
  emailId?: string | null;
  name?: string | null;
  rollNo?: string | null;
  joiningDate?: dayjs.Dayjs | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
