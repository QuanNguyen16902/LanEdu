export interface Student {
  id: string;
  name: string;
  email?: string;
  class: string;
  status?: string;
  dob?: string;
  gender?: string;
  attendance: number;
  score: number;
  pricePerSession?: number;
  sessionsAttended?: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'UNEXCUSED';
  classId: string;
  isPaid?: boolean;
  note?: string;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  taId?: string;
  room?: string;
}

export interface Teacher {
  id: string;
  name: string;
  type: 'LEAD' | 'TA';
  email?: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
