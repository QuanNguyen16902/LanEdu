import api from './api';
import { AttendanceRecord } from './mockData';

export const attendanceService = {
  getRecords: (date?: string, classId?: string, month?: string): Promise<AttendanceRecord[]> => {
    const params: any = {};
    if (date) params.date = date;
    if (classId) params.classId = classId;
    if (month) params.month = month;
    return api.get('/attendance', params);
  },

  updateRecord: (id: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord> => {
    return api.patch(`/attendance/${id}`, data);
  },

  bulkUpdate: (records: AttendanceRecord[]): Promise<{ message: string }> => {
    return api.post('/attendance/bulk', records);
  },
};
