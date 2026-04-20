export interface Teacher {
  id: string;
  name: string;
  type: 'LEAD' | 'TA';
  email?: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
