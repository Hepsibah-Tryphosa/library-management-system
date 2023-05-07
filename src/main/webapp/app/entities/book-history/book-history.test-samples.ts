import dayjs from 'dayjs/esm';

import { BookState } from 'app/entities/enumerations/book-state.model';

import { IBookHistory, NewBookHistory } from './book-history.model';

export const sampleWithRequiredData: IBookHistory = {
  id: 65475,
};

export const sampleWithPartialData: IBookHistory = {
  id: 19383,
  bookState: BookState['ISSUED'],
  issuedDate: dayjs('2023-05-07'),
};

export const sampleWithFullData: IBookHistory = {
  id: 92298,
  bookState: BookState['AVAILABLE'],
  issuedDate: dayjs('2023-05-07'),
  returnDate: dayjs('2023-05-07'),
  createdDate: dayjs('2023-05-07'),
};

export const sampleWithNewData: NewBookHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
