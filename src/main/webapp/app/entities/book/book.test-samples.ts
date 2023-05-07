import dayjs from 'dayjs/esm';

import { BookState } from 'app/entities/enumerations/book-state.model';

import { IBook, NewBook } from './book.model';

export const sampleWithRequiredData: IBook = {
  id: 37098,
  title: 'Ay',
  author: 'RmAwql',
  publisher: 'RuHHI',
};

export const sampleWithPartialData: IBook = {
  id: 7125,
  title: 'CCktFN',
  author: 'p?',
  isbn: 'iQ1P',
  publisher: '7YV9Y',
  bookState: BookState['AVAILABLE'],
  returnDate: dayjs('2023-05-07'),
  createdDate: dayjs('2023-05-07'),
};

export const sampleWithFullData: IBook = {
  id: 57563,
  title: 'rlgT',
  author: '0',
  isbn: 'Rzo',
  publisher: '0K5W6',
  price: 5419,
  bookState: BookState['RESERVED'],
  issuedDate: dayjs('2023-05-07'),
  returnDate: dayjs('2023-05-07'),
  createdDate: dayjs('2023-05-07'),
};

export const sampleWithNewData: NewBook = {
  title: 'LJc',
  author: 'Gm',
  publisher: 'WqPS',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
