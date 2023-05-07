import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 23105,
  emailId: 'Franc Division Regional',
  name: 'G4Wn',
};

export const sampleWithPartialData: IStudent = {
  id: 33985,
  emailId: 'transmit',
  name: 'tjM',
  rollNo: 'Hawaii 24/365',
};

export const sampleWithFullData: IStudent = {
  id: 58818,
  emailId: 'e-markets auxiliary',
  name: 'X',
  rollNo: 'Savings',
  joiningDate: dayjs('2023-05-07T16:36'),
};

export const sampleWithNewData: NewStudent = {
  emailId: 'deposit Pizza',
  name: ' 4',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
