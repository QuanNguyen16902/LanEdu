import api from './api';

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  taId?: string;
  room?: string;
  grade?: string;
  schedule?: string;
}

export const classService = {
  getClasses: (): Promise<Class[]> => {
    return api.get('/classes');
  },
  
  createClass: (data: Partial<Class>): Promise<Class> => {
    return api.post('/classes', data);
  },

  updateClass: (id: string, data: Partial<Class>): Promise<Class> => {
    return api.patch(`/classes/${id}`, data);
  },

  deleteClass: (id: string): Promise<void> => {
    return api.delete(`/classes/${id}`);
  },
};
