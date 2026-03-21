import { Role } from '@/lib/auth-context';

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  attendance: number;
  score: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'SUBMITTED' | 'MISSING' | 'LATE' | 'PENDING';
  teacherId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'UNEXCUSED';
  classId: string;
}

export interface Evaluation {
  id: string;
  studentId: string;
  teacherId: string;
  score: number;
  comment: string;
  date: string;
}

export const mockStudents: Student[] = [
  { id: '1', name: 'Nguyễn Văn A', email: 'vana@student.com', class: '10A1', attendance: 95, score: 8.5 },
  { id: '2', name: 'Trần Thị B', email: 'thib@student.com', class: '10A1', attendance: 88, score: 7.2 },
  { id: '3', name: 'Lê Văn C', email: 'vanc@student.com', class: '10A2', attendance: 92, score: 9.0 },
  { id: '4', name: 'Phạm Thị D', email: 'thid@student.com', class: '10A2', attendance: 75, score: 6.5 },
  { id: '5', name: 'Hoàng Văn E', email: 'vane@student.com', class: '10A1', attendance: 100, score: 9.8 },
];

export const mockAssignments: Assignment[] = [
  { id: '1', title: 'IELTS Writing Task 1 - Data Analysis', description: 'Describe the trends shown in the line graph on page 45 of your textbook.', dueDate: '2026-03-25', status: 'PENDING', teacherId: 't1' },
  { id: '2', title: 'English Grammar - Passive Voice', description: 'Rewrite the following 10 sentences using the passive voice. Minimum 15 words per sentence.', dueDate: '2026-03-22', status: 'SUBMITTED', teacherId: 't1' },
  { id: '3', title: 'Unit 5 Vocabulary - Science & Technology', description: 'Memorize 20 new words related to technology and practice using them in sentences.', dueDate: '2026-03-20', status: 'LATE', teacherId: 't2' },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: '1', studentId: 'ED0121320009', date: '2026-03-02', status: 'PRESENT', classId: '10A1' },
  { id: '2', studentId: 'ED0121320009', date: '2026-03-05', status: 'PRESENT', classId: '10A1' },
  { id: '3', studentId: 'ED0121320009', date: '2026-03-09', status: 'PRESENT', classId: '10A1' },
  { id: '4', studentId: 'ED0121320009', date: '2026-03-12', status: 'PRESENT', classId: '10A1' },
  { id: '5', studentId: 'ED0121320009', date: '2026-03-16', status: 'PRESENT', classId: '10A1' },
  { id: '6', studentId: 'ED0121320009', date: '2026-03-19', status: 'PRESENT', classId: '10A1' },
  { id: '7', studentId: 'ED0121320009', date: '2026-03-23', status: 'PRESENT', classId: '10A1' },
  { id: '8', studentId: 'ED0121320009', date: '2026-03-26', status: 'PRESENT', classId: '10A1' },
  { id: '9', studentId: 'ED0121320009', date: '2026-03-30', status: 'PRESENT', classId: '10A1' },
  { id: '10', studentId: 'ED0120320183', date: '2026-03-17', status: 'LATE', classId: '10A1' },
  { id: '11', studentId: '3', date: '2026-03-17', status: 'PRESENT', classId: '10A2' },
  { id: '12', studentId: '4', date: '2026-03-17', status: 'ABSENT', classId: '10A2' },
];

export const mockEvaluations: Evaluation[] = [
  { id: '1', studentId: '1', teacherId: 't1', score: 9, comment: 'Excellent progress, very active during discussions.', date: '2026-03-15' },
  { id: '2', studentId: '2', teacherId: 't1', score: 7, comment: 'Needs to focus more on speaking practice and homework consistency.', date: '2026-03-15' },
];

export interface Schedule {
  id: string;
  class: string;
  time: string;
  subject: string;
  room: string;
  students: number;
}

export const mockSchedules: Schedule[] = [
  { id: '1', class: '10A1', time: '08:00 - 09:30', subject: 'IELTS Listening Practice', room: 'Room 302', students: 25 },
  { id: '2', class: '10A2', time: '10:00 - 11:30', subject: 'English Communication', room: 'Room 105', students: 20 },
  { id: '3', class: '11B1', time: '13:30 - 15:00', subject: 'Academic Writing', room: 'Lab 2', students: 18 },
  { id: '4', class: '12C1', time: '15:30 - 17:00', subject: 'TOEIC Preparation', room: 'Room 401', students: 30 },
];
