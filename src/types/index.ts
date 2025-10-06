export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'monthly' | 'yearly' | null;
  createdAt: string;
}

export interface Resident {
  id: string;
  flatNo: string;
  ownerName: string;
  age: number;
  totalMembers: number;
  members: FamilyMember[];
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relation: string;
}

export interface Visitor {
  id: string;
  name: string;
  mobileNumber: string;
  type: 'delivery' | 'relative' | 'guest';
  flatNo: string;
  inTime: string;
  outTime: string | null;
  purpose: string;
  createdAt: string;
}
