import { db } from './firebase';
import { Student, AttendanceRecord, Teacher } from './types';

const mockTeachers: Teacher[] = [
  { id: 'T001', name: 'Trần Thị Mai', type: 'LEAD', email: 'mai.tt@school.com', phone: '0912345678', status: 'ACTIVE' },
  { id: 'T002', name: 'Nguyễn Văn Hùng', type: 'LEAD', email: 'hung.nv@school.com', phone: '0987654321', status: 'ACTIVE' },
  { id: 'T003', name: 'Lê Thị Thu', type: 'LEAD', email: 'thu.lt@school.com', phone: '0901234567', status: 'ACTIVE' },
  { id: 'T004', name: 'Đặng Thị Thúy Hằng', type: 'LEAD', email: 'hang.dtt@school.com', phone: '0922334455', status: 'ACTIVE' },
  { id: 'T005', name: 'Lê Minh Khôi', type: 'LEAD', email: 'khoi.lm@school.com', phone: '0933445566', status: 'ACTIVE' },
];

const mockStudents: Student[] = [
  { id: 'EDI000001', name: 'Nguyễn Minh Anh', class: '6a1', status: 'Đang theo học', dob: '12/03/2014', gender: 'Nữ/Female', pricePerSession: 200000, attendance: 95, score: 8.5 },
  { id: 'EDI000002', name: 'Trần Quốc Bảo', class: '6a1', status: 'Đang theo học', dob: '25/05/2014', gender: 'Nam/Male', pricePerSession: 200000, attendance: 88, score: 7.2 },
  { id: 'EDI000003', name: 'Lê Diệp Chi', class: '6a1', status: 'Đang theo học', dob: '08/07/2014', gender: 'Nữ/Female', pricePerSession: 200000, attendance: 92, score: 9.0 },
  { id: 'EDI000004', name: 'Bùi Anujin Thúy An', class: '7a1', status: 'Đang theo học', dob: '18/10/2013', gender: 'Nữ/Female', pricePerSession: 200000, attendance: 98, score: 9.5 },
  { id: 'EDI000005', name: 'Dương Lê An', class: '7a1', status: 'Đang theo học', dob: '07/05/2013', gender: 'Nữ/Female', pricePerSession: 200000, attendance: 94, score: 8.8 },
];

async function deleteCollection(collectionPath: string) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

async function seed() {
  console.log('🌱 Clearing existing data and seeding updated system...');

  // Clear data
  await deleteCollection('students');
  await deleteCollection('attendance');
  await deleteCollection('classes');
  await deleteCollection('teachers');
  console.log('  - Existing collections cleared');

  const classes = [
    { id: '6a1', name: '6 Moon', teacherId: 'T001', grade: '6' },
    { id: '6a2', name: '6 Star', teacherId: 'T002', grade: '6' },
    { id: '6a3', name: '6 Galaxy', teacherId: 'T003', grade: '6' },
    { id: '7a1', name: '7 Sun', teacherId: 'T004', grade: '7' },
    { id: '7a2', name: '7 Venus', teacherId: 'T005', grade: '7' },
  ];

  // Reset Counters
  await db.collection('counters').doc('students').set({ count: mockStudents.length });
  console.log(`  - Student counter initialized to ${mockStudents.length}`);

  // Seed Teachers
  for (const teacher of mockTeachers) {
    await db.collection('teachers').doc(teacher.id).set(teacher);
    console.log(`  - Teacher ${teacher.name} seeded`);
  }

  // Seed Classes
  for (const cls of classes) {
    await db.collection('classes').doc(cls.id).set(cls);
    console.log(`  - Class ${cls.name} seeded`);
  }

  // Seed Students
  for (const student of mockStudents) {
    await db.collection('students').doc(student.id).set(student);
    console.log(`  - Student ${student.name} seeded`);
  }

  // Generate some random attendance for March
  const marchDates = ['2026-03-02', '2026-03-05', '2026-03-09'];
  for (const student of mockStudents) {
    for (const date of marchDates) {
      const id = `att-${student.id}-${date}`;
      const record: AttendanceRecord = {
        id,
        studentId: student.id,
        date,
        status: Math.random() > 0.1 ? 'PRESENT' : 'ABSENT',
        classId: student.class
      };
      await db.collection('attendance').doc(id).set(record);
    }
  }
  console.log('  - Sample attendance records seeded');

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
