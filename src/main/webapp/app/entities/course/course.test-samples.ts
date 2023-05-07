import { ICourse, NewCourse } from './course.model';

export const sampleWithRequiredData: ICourse = {
  id: 59109,
  name: 'multi-byte',
};

export const sampleWithPartialData: ICourse = {
  id: 77622,
  name: 'quantifyin',
};

export const sampleWithFullData: ICourse = {
  id: 34332,
  name: 'redundant',
};

export const sampleWithNewData: NewCourse = {
  name: 'hacking so',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
