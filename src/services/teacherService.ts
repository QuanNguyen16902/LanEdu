import api from './api';
import { Teacher } from '@/types/teacher';

export const teacherService = {
  getTeachers: (): Promise<Teacher[]> => {
    return api.get('/teachers');
  },
  
  getTeacher: (id: string): Promise<Teacher> => {
    return api.get(`/teachers/${id}`);
  },

  createTeacher: (data: Partial<Teacher>): Promise<Teacher> => {
    return api.post('/teachers', data);
  },

  updateTeacher: (id: string, data: Partial<Teacher>): Promise<Teacher> => {
    return api.patch(`/teachers/${id}`, data);
  },

  deleteTeacher: (id: string): Promise<void> => {
    return api.delete(`/teachers/${id}`);
  },
};
