import { Role } from '@/lib/auth-context';

export interface Student {
  id: string;
  name: string;
  email?: string;
  class: string;
  status?: string;
  dob?: string;
  gender?: string;
  advisor?: string;
  attendance: number;
  score: number;
  pricePerSession?: number;
  sessionsAttended?: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'SUBMITTED' | 'MISSING' | 'LATE' | 'PENDING';
  teacherId: string;
  grade?: string;
  classId?: string;
  pdfUrl?: string;
  externalUrl?: string;
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
  // Class 6 Moon (6a1)
  { id: 'ED0125310001', name: 'Nguyễn Minh Anh', class: '6a1', status: 'Đang theo học', dob: '12/03/2014', gender: 'Nữ/Female', advisor: 'Trần Thị Mai', pricePerSession: 200000, attendance: 95, score: 8.5 },
  { id: 'ED0125310002', name: 'Trần Quốc Bảo', class: '6a1', status: 'Đang theo học', dob: '25/05/2014', gender: 'Nam/Male', advisor: 'Trần Thị Mai', pricePerSession: 200000, attendance: 88, score: 7.2 },
  { id: 'ED0125310003', name: 'Lê Diệp Chi', class: '6a1', status: 'Đang theo học', dob: '08/07/2014', gender: 'Nữ/Female', advisor: 'Trần Thị Mai', pricePerSession: 200000, attendance: 92, score: 9.0 },
  { id: 'ED0125310004', name: 'Phạm Tiến Dũng', class: '6a1', status: 'Nghỉ học', dob: '14/09/2014', gender: 'Nam/Male', advisor: 'Trần Thị Mai', pricePerSession: 200000, attendance: 75, score: 6.5 },

  // Class 6 Star (6a2)
  { id: 'ED0125310021', name: 'Hoàng Minh Đức', class: '6a2', status: 'Đang theo học', dob: '30/01/2014', gender: 'Nam/Male', advisor: 'Nguyễn Văn Hùng', pricePerSession: 180000, attendance: 90, score: 8.0 },
  { id: 'ED0125310022', name: 'Vũ Khánh Huyền', class: '6a2', status: 'Đang theo học', dob: '19/04/2014', gender: 'Nữ/Female', advisor: 'Nguyễn Văn Hùng', pricePerSession: 180000, attendance: 96, score: 9.2 },
  { id: 'ED0125310023', name: 'Đặng Gia Huy', class: '6a2', status: 'Đang theo học', dob: '11/11/2014', gender: 'Nam/Male', advisor: 'Nguyễn Văn Hùng', pricePerSession: 180000, attendance: 85, score: 7.5 },

  // Class 6 Galaxy (6a3)
  { id: 'ED0125310041', name: 'Bùi Bảo Lâm', class: '6a3', status: 'Đang theo học', dob: '05/02/2014', gender: 'Nam/Male', advisor: 'Lê Thị Thu', pricePerSession: 220000, attendance: 100, score: 9.8 },
  { id: 'ED0125310042', name: 'Đỗ Thùy Linh', class: '6a3', status: 'Đang theo học', dob: '22/08/2014', gender: 'Nữ/Female', advisor: 'Lê Thị Thu', pricePerSession: 220000, attendance: 92, score: 8.7 },

  // Class 7 Sun (7a1)
  { id: 'ED0119310177', name: 'Bùi Anujin Thúy An', class: '7a1', status: 'Đang theo học', dob: '18/10/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng', pricePerSession: 200000, attendance: 98, score: 9.5 },
  { id: 'ED0121310006', name: 'Dương Lê An', class: '7a1', status: 'Đang theo học', dob: '07/05/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng', pricePerSession: 200000, attendance: 94, score: 8.8 },
  { id: 'ED0119310031', name: 'Trần Quý Phương An', class: '7a1', status: 'Đang theo học', dob: '16/07/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng', pricePerSession: 200000, attendance: 91, score: 8.2 },
  { id: 'ED0120310015', name: 'Phạm Nguyễn Vân Anh', class: '7a1', status: 'Đang theo học', dob: '28/01/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng', pricePerSession: 200000, attendance: 89, score: 7.9 },

  // Class 7 Venus (7a2)
  { id: 'ED0123310009', name: 'Trần Bảo Châu', class: '7a2', status: 'Đang theo học', dob: '01/10/2013', gender: 'Nữ/Female', advisor: 'Lê Minh Khôi', pricePerSession: 200000, attendance: 93, score: 8.6 },
  { id: 'ED0121310013', name: 'Lê Mai Chi', class: '7a2', status: 'Đang theo học', dob: '04/12/2013', gender: 'Nữ/Female', advisor: 'Lê Minh Khôi', pricePerSession: 200000, attendance: 87, score: 7.4 },
  { id: 'ED0119310060', name: 'Nguyễn Bích Diệp', class: '7a2', status: 'Đang theo học', dob: '29/12/2013', gender: 'Nữ/Female', advisor: 'Lê Minh Khôi', pricePerSession: 200000, attendance: 95, score: 9.1 },
  { id: 'ED0123310004', name: 'Đỗ Khánh Duy', class: '7a2', status: 'Đang theo học', dob: '13/07/2013', gender: 'Nam/Male', advisor: 'Lê Minh Khôi', pricePerSession: 200000, attendance: 82, score: 7.0 },
];

// Helper to generate dates for March 2026
const marchDates = [
  '2026-03-02', '2026-03-05', '2026-03-09', '2026-03-12', 
  '2026-03-16', '2026-03-19', '2026-03-23', '2026-03-26', 
  '2026-03-30', '2026-03-31'
];

export const mockAttendance: AttendanceRecord[] = [];

// Populate records for all students across March dates
mockStudents.forEach(student => {
  marchDates.forEach((date, index) => {
    // Randomly skip some days or mark as Late/Absent for variety
    const rand = Math.random();
    let status: any = 'PRESENT';
    if (rand > 0.95) status = 'ABSENT';
    else if (rand > 0.85) status = 'LATE';

    mockAttendance.push({
      id: `att-${student.id}-${date}`,
      studentId: student.id,
      date: date,
      status: status,
      classId: student.class
    });
  });
});

export const mockAssignments: Assignment[] = [
  { 
    id: '1', 
    title: 'IELTS Writing Task 1 - Data Analysis', 
    description: 'Describe the trends shown in the line graph on page 45 of your textbook.', 
    dueDate: '2026-03-25', 
    status: 'PENDING', 
    teacherId: 't1',
    grade: '10',
    classId: '10A1',
    pdfUrl: 'https://example.com/writing-task-1.pdf',
    externalUrl: 'https://ielts.org/writing-tips'
  },
  { 
    id: '2', 
    title: 'English Grammar - Passive Voice', 
    description: 'Rewrite the following 10 sentences using the passive voice. Minimum 15 words per sentence.', 
    dueDate: '2026-03-22', 
    status: 'SUBMITTED', 
    teacherId: 't1',
    grade: '10',
    classId: '10A1',
    pdfUrl: 'https://example.com/passive-voice-ex.pdf'
  },
];

export const mockEvaluations: Evaluation[] = [
  { id: '1', studentId: 'ED0119310177', teacherId: 't1', score: 9, comment: 'Excellent progress, very active during discussions.', date: '2026-03-15' },
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
  { id: '1', class: '7 Sun', time: '08:00 - 09:30', subject: 'IELTS Listening Practice', room: 'Room 302', students: 25 },
  { id: '2', class: '6 Moon', time: '10:00 - 11:30', subject: 'English Communication', room: 'Room 105', students: 20 },
];
