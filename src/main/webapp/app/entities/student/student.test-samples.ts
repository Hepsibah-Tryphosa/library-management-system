import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 23105,
  emailId: 'Franc Division Regional',
  name: 'Refined Auto',
};

export const sampleWithPartialData: IStudent = {
  id: 76380,
  emailId: 'Ngultrum Comoros Hawaii',
  name: 'deploy of',
};

export const sampleWithFullData: IStudent = {
  id: 79834,
  emailId: 'Baby B2C Shirt',
  name: 'deposit Pizza',
  rollNo: 'Agent',
  joiningDate: dayjs('2023-05-07'),
};

export const sampleWithNewData: NewStudent = {
  emailId: '4th withdrawal',
  name: 'indexing Account',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
