import api from './api';
import { Student } from './mockData';

export const studentService = {
  getStudents: (classId?: string): Promise<Student[]> => {
    return api.get('/students', classId ? { classId } : undefined);
  },
  
  getStudent: (id: string): Promise<Student> => {
    return api.get(`/students/${id}`);
  },

  createStudent: (student: Partial<Student>): Promise<Student> => {
    return api.post('/students', student);
  },

  updateStudent: (id: string, student: Partial<Student>): Promise<Student> => {
    return api.patch(`/students/${id}`, student);
  },
};
