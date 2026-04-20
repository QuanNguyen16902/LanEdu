import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './firebase';
import { AttendanceRecord } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Helpers ---
async function getNextStudentId(): Promise<string> {
  const counterRef = db.collection('counters').doc('students');
  
  return await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(counterRef);
    let nextCount = 1;
    
    if (doc.exists) {
      nextCount = (doc.data()?.count || 0) + 1;
    }
    
    transaction.set(counterRef, { count: nextCount });
    
    // Format to EDI + 6 digits (e.g., EDI000001)
    const formattedNumber = nextCount.toString().padStart(6, '0');
    return `EDI${formattedNumber}`;
  });
}

// Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Classes ---
app.get('/api/classes', async (req, res) => {
  try {
    const snapshot = await db.collection('classes').get();
    const classes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(classes);
  } catch (error: any) {
    console.error('❌ Error fetching classes:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.post('/api/classes', async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || `class-${Date.now()}`;
    await db.collection('classes').doc(id).set({ ...data, id });
    res.status(201).json({ id, ...data });
  } catch (error: any) {
    console.error('❌ Error creating class:', error);
  }
});

app.patch('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.collection('classes').doc(id).set(data, { merge: true });
    res.json({ id, ...data });
  } catch (error: any) {
    console.error('❌ Error updating class:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('classes').doc(id).delete();
    res.json({ message: 'Class deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting class:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- Students ---
app.get('/api/students', async (req, res) => {
  try {
    const { classId } = req.query;
    let query: any = db.collection('students');
    
    if (classId) {
      query = query.where('class', '==', classId);
    }
    
    const snapshot = await query.get();
    const students = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (error: any) {
    console.error('❌ Error fetching students:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const data = req.body;
    // Generate an ID if not provided, otherwise use the provided one
    let id = data.id;
    if (!id) {
       id = await getNextStudentId();
    }
    
    await db.collection('students').doc(id).set({ ...data, id });
    res.status(201).json({ id, ...data });
  } catch (error: any) {
    console.error('❌ Error creating student:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- Teachers ---
app.get('/api/teachers', async (req, res) => {
  try {
    const snapshot = await db.collection('teachers').get();
    const teachers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(teachers);
  } catch (error: any) {
    console.error('❌ Error fetching teachers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('teachers').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error: any) {
    console.error('❌ Error fetching teacher:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teachers', async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || `teacher-${Date.now()}`;
    await db.collection('teachers').doc(id).set({ ...data, id });
    res.status(201).json({ id, ...data });
  } catch (error: any) {
    console.error('❌ Error creating teacher:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.collection('teachers').doc(id).set(data, { merge: true });
    res.json({ id, ...data });
  } catch (error: any) {
    console.error('❌ Error updating teacher:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('teachers').doc(id).delete();
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting teacher:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- Attendance ---
app.get('/api/attendance', async (req, res) => {
  try {
    const { date, classId, month } = req.query;
    let query: any = db.collection('attendance');

    // Always filter by classId first if provided (efficiency)
    if (classId) {
      query = query.where('classId', '==', classId);
    }

    const snapshot = await query.get();
    let records = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // Perform date/month filtering in memory to avoid Firestore Composite Index requirements
    if (date) {
      records = records.filter((r: any) => r.date === date);
    } else if (month && typeof month === 'string') {
      const prefix = month; // YYYY-MM
      records = records.filter((r: any) => r.date && r.date.startsWith(prefix));
    }

    res.json(records);
  } catch (error: any) {
    console.error('❌ Error fetching attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance/bulk', async (req, res) => {
  try {
    const records: AttendanceRecord[] = req.body;
    const batch = db.batch();

    records.forEach(record => {
      const id = record.id || `att-${record.studentId}-${record.date}`;
      const ref = db.collection('attendance').doc(id);
      
      let statusColor = '#94a3b8'; // default grey
      if (record.status === 'PRESENT') statusColor = '#059669'; // emerald-600
      if (record.status === 'LATE') statusColor = '#d97706';    // amber-600
      if (record.status === 'ABSENT') statusColor = '#e11d48';  // rose-600

      batch.set(ref, { 
        ...record, 
        id, 
        updatedAt: new Date().toISOString(),
        statusColor
      }, { merge: true });
    });

    await batch.commit();
    res.json({ message: `Successfully updated ${records.length} records` });
  } catch (error: any) {
    console.error('❌ Error in bulk attendance update:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.collection('attendance').doc(id).set(data, { merge: true });
    res.json({ id, ...data });
  } catch (error: any) {
    console.error('❌ Error updating attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running!`);
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - API Ready: http://localhost:${PORT}/api/health\n`);
});
