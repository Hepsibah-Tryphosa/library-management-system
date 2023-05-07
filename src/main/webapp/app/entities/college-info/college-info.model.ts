export interface ICollegeInfo {
  id: number;
  name?: string | null;
  contactNo?: string | null;
  address?: string | null;
  city?: string | null;
}

export type NewCollegeInfo = Omit<ICollegeInfo, 'id'> & { id: null };
