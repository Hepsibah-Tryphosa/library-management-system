import { ICollegeInfo, NewCollegeInfo } from './college-info.model';

export const sampleWithRequiredData: ICollegeInfo = {
  id: 32193,
  name: 'Tajikistan Avon modular',
  contactNo: 'bluetooth',
  city: 'Lake Eliza',
};

export const sampleWithPartialData: ICollegeInfo = {
  id: 52200,
  name: 'Organized Executive',
  contactNo: 'wireless V',
  city: 'Zolaville',
};

export const sampleWithFullData: ICollegeInfo = {
  id: 38710,
  name: 'Seychelles Kids',
  contactNo: 'Internatio',
  address: 'gold Oval',
  city: 'Hayleymouth',
};

export const sampleWithNewData: NewCollegeInfo = {
  name: 'parsing transmit',
  contactNo: 'Cambridges',
  city: 'Lake Antoinettemouth',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
