// Vercel Serverless Function for S.A.C.H
import express from 'express';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Database setup for Vercel
let db;
const DB_PATH = path.join('/tmp', 'database.db');

try {
  db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');
  
  // Initialize schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_profile (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'ASSISTANT', 
      profilePhoto TEXT
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      grade TEXT,
      specialty TEXT,
      status TEXT,
      requiredHours INTEGER,
      profilePhoto TEXT,
      prioritySessionType TEXT,
      weeklyEstimatedHours TEXT
    );

    CREATE TABLE IF NOT EXISTS approved_overtime (
      teacherId TEXT,
      moduleId TEXT,
      PRIMARY KEY (teacherId, moduleId),
      FOREIGN KEY (teacherId) REFERENCES teachers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS parcours (
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT,
      level TEXT,
      year INTEGER,
      specialty TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY,
      code TEXT,
      name TEXT,
      semester INTEGER,
      cmHours INTEGER,
      tdHours INTEGER,
      tpHours INTEGER,
      parcoursId TEXT,
      FOREIGN KEY (parcoursId) REFERENCES parcours(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      teacherId TEXT,
      moduleId TEXT,
      type TEXT,
      hours INTEGER,
      FOREIGN KEY (teacherId) REFERENCES teachers(id) ON DELETE CASCADE,
      FOREIGN KEY (moduleId) REFERENCES modules(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      senderId TEXT,
      receiverId TEXT,
      content TEXT,
      createdAt TEXT,
      status TEXT,
      moduleId TEXT,
      moduleType TEXT,
      hours INTEGER,
      isRead INTEGER DEFAULT 0
    );
  `);

  // Seed admin if not exists
  const existingAdmin = db.prepare('SELECT * FROM admin_profile WHERE email = ?').get('admin@sach.com');
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync('admin', 10);
    db.prepare('INSERT INTO admin_profile (id, name, email, password, role, profilePhoto) VALUES (?, ?, ?, ?, ?, ?)')
      .run(uuidv4(), 'Admin User', 'admin@sach.com', hashedPassword, 'ADMIN', '');
  }

} catch (error) {
  console.error('Database initialization error:', error);
}

const JWT_SECRET = process.env.JWT_SECRET || 'sach-secret-key-2024-pfe-excellence';

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access Denied: No Token Provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or Expired Token' });
    req.user = user;
    next();
  });
}

// Administrative Check Middleware
function isAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access Denied: Admin Privileges Required' });
  }
  next();
}

// --- AUTH ROUTE ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check Admin
    let admin = db.prepare('SELECT * FROM admin_profile WHERE email = ?').get(email);
    if (!admin && email === 'admin') {
      admin = db.prepare("SELECT * FROM admin_profile WHERE role = 'ADMIN' LIMIT 1").get();
    }
    if (admin && admin.password) {
      const valid = await bcrypt.compare(String(password), String(admin.password));
      if (valid) {
        const token = jwt.sign({ id: admin.id, role: 'ADMIN', name: admin.name }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ success: true, token, session: { id: admin.id, role: 'ADMIN', name: admin.name } });
      }
    }

    // Check Teacher
    const teacher = db.prepare('SELECT * FROM teachers WHERE email = ?').get(email);
    if (teacher && teacher.password) {
      const valid = await bcrypt.compare(String(password), String(teacher.password));
      if (valid) {
        const token = jwt.sign({ id: teacher.id, role: 'TEACHER', name: teacher.name, teacherId: teacher.id }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ success: true, token, session: { id: teacher.id, role: 'TEACHER', name: teacher.name, teacherId: teacher.id } });
      }
    }

    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error?.message || error);
    res.status(500).json({ error: 'Internal Server Error', details: error?.message });
  }
});

// --- ADMIN ROUTES ---
app.get('/api/admin/profile', authenticateToken, (req, res) => {
  const profile = db.prepare('SELECT * FROM admin_profile ORDER BY role DESC').get();
  res.json(profile);
});

app.get('/api/admin/profile/:id', authenticateToken, (req, res) => {
  const profile = db.prepare('SELECT * FROM admin_profile WHERE id = ?').get(req.params.id);
  res.json(profile);
});

app.get('/api/admin/main', authenticateToken, (req, res) => {
  try {
    const mainAdmin = db.prepare("SELECT id, name FROM admin_profile WHERE role = 'ADMIN'").get();
    if (!mainAdmin) {
      return res.json(null);
    }
    res.json(mainAdmin);
  } catch (error) {
    console.error('Error in /api/admin/main:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/profile/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, profilePhoto } = req.body;
  try {
    if (password && !password.startsWith('$2b$')) {
      const hashed = await bcrypt.hash(password, 10);
      db.prepare('UPDATE admin_profile SET name = ?, email = ?, password = ?, profilePhoto = ? WHERE id = ?')
        .run(name, email, hashed, profilePhoto, id);
    } else {
      db.prepare('UPDATE admin_profile SET name = ?, email = ?, profilePhoto = ? WHERE id = ?')
        .run(name, email, profilePhoto, id);
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Update failed' }); }
});

// --- TEACHER ROUTES ---
app.get('/api/teachers', authenticateToken, (req, res) => {
  try {
    const teachers = db.prepare('SELECT * FROM teachers').all();
    const teachersWithOvertime = teachers.map((t) => {
      const approvedOvertimeModuleIds = db.prepare('SELECT moduleId FROM approved_overtime WHERE teacherId = ?')
        .all(t.id).map((row) => row.moduleId);
      return { ...t, approvedOvertimeModuleIds };
    });
    res.json(teachersWithOvertime);
  } catch (e) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.get('/api/teachers/:id/workload', authenticateToken, (req, res) => {
  try {
    const assignments = db.prepare('SELECT type, hours FROM assignments WHERE teacherId = ?').all(req.params.id);
    const cm = assignments.filter(a => a.type === 'CM').reduce((acc, curr) => acc + curr.hours, 0);
    const td = assignments.filter(a => a.type === 'TD').reduce((acc, curr) => acc + curr.hours, 0);
    const tp = assignments.filter(a => a.type === 'TP').reduce((acc, curr) => acc + curr.hours, 0);
    const teacher = db.prepare('SELECT requiredHours FROM teachers WHERE id = ?').get(req.params.id);
    
    res.json({
      cm, td, tp,
      total: cm + td + tp,
      required: teacher?.requiredHours || 0
    });
  } catch (e) { res.status(500).json({ error: 'Workload calculation failed' }); }
});

app.post('/api/teachers', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { name, email, password, grade, specialty, status, requiredHours, profilePhoto, prioritySessionType, weeklyEstimatedHours } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'teacher123', 10);
    db.prepare('INSERT INTO teachers (id, name, email, password, grade, specialty, status, requiredHours, profilePhoto, prioritySessionType, weeklyEstimatedHours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(uuidv4(), name, email, hashedPassword, grade, specialty, status, requiredHours, profilePhoto || '', prioritySessionType || 'TD', weeklyEstimatedHours || '8h à 10h');
    res.json({ success: true });
  } catch (err) { next(err); }
});

app.put('/api/teachers/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, profilePhoto, grade, specialty, status, requiredHours, prioritySessionType, weeklyEstimatedHours } = req.body;
    if (password && !password.startsWith('$2b$')) {
      const hashed = await bcrypt.hash(password, 10);
      db.prepare('UPDATE teachers SET name = ?, email = ?, password = ?, profilePhoto = ?, grade = ?, specialty = ?, status = ?, requiredHours = ?, prioritySessionType = ?, weeklyEstimatedHours = ? WHERE id = ?')
        .run(name, email, hashed, profilePhoto, grade, specialty, status, requiredHours, prioritySessionType, weeklyEstimatedHours, id);
    } else {
      db.prepare('UPDATE teachers SET name = ?, email = ?, profilePhoto = ?, grade = ?, specialty = ?, status = ?, requiredHours = ?, prioritySessionType = ?, weeklyEstimatedHours = ? WHERE id = ?')
        .run(name, email, profilePhoto, grade, specialty, status, requiredHours, prioritySessionType, weeklyEstimatedHours, id);
    }
    res.json({ success: true });
  } catch (err) { next(err); }
});

app.delete('/api/teachers/:id', authenticateToken, isAdmin, (req, res, next) => {
  try {
    db.prepare('DELETE FROM teachers WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// --- PARCOURS ROUTES ---
app.get('/api/parcours', authenticateToken, (req, res) => {
  res.json(db.prepare('SELECT * FROM parcours').all());
});

app.post('/api/parcours', authenticateToken, isAdmin, (req, res, next) => {
  try {
    const { name, type, level, year, specialty, description } = req.body;
    db.prepare('INSERT INTO parcours (id, name, type, level, year, specialty, description) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(uuidv4(), name, type, level || null, year, specialty, description);
    res.json({ success: true });
  } catch (err) { next(err); }
});

app.delete('/api/parcours/:id', authenticateToken, isAdmin, (req, res, next) => {
  try {
    db.prepare('DELETE FROM parcours WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// --- MODULE ROUTES ---
app.get('/api/modules', authenticateToken, (req, res) => {
  res.json(db.prepare('SELECT * FROM modules').all());
});

app.post('/api/modules', authenticateToken, isAdmin, (req, res, next) => {
  try {
    const { code, name, semester, cmHours, tdHours, tpHours, parcoursId } = req.body;
    if (!parcoursId) {
      return res.status(400).json({ error: 'A module must be linked to a Parcours.' });
    }
    db.prepare('INSERT INTO modules (id, code, name, semester, cmHours, tdHours, tpHours, parcoursId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(uuidv4(), code, name, semester, cmHours, tdHours, tpHours, parcoursId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/modules/:id', authenticateToken, isAdmin, (req, res, next) => {
  try {
    db.prepare('DELETE FROM modules WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// --- ASSIGNMENT ROUTES ---
app.get('/api/assignments', authenticateToken, (req, res) => {
  res.json(db.prepare('SELECT * FROM assignments').all());
});

app.post('/api/assignments', authenticateToken, isAdmin, (req, res, next) => {
  try {
    const { teacherId, moduleId, type, hours } = req.body;
    db.prepare('INSERT INTO assignments (id, teacherId, moduleId, type, hours) VALUES (?, ?, ?, ?, ?)')
      .run(uuidv4(), teacherId, moduleId, type, hours);
    res.json({ success: true });
  } catch (err) { next(err); }
});

app.put('/api/assignments/:id', authenticateToken, isAdmin, (req, res, next) => {
  try {
    const { teacherId, moduleId, type, hours } = req.body;
    db.prepare('UPDATE assignments SET teacherId = ?, moduleId = ?, type = ?, hours = ? WHERE id = ?')
      .run(teacherId, moduleId, type, hours, req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

app.delete('/api/assignments/:id', authenticateToken, isAdmin, (req, res, next) => {
  try {
    db.prepare('DELETE FROM assignments WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// --- MESSAGE ROUTES ---
app.get('/api/messages', authenticateToken, (req, res) => {
  res.json(db.prepare('SELECT * FROM messages').all());
});

app.post('/api/messages', authenticateToken, (req, res, next) => {
  try {
    const { senderId, receiverId, content, createdAt, status, moduleId, moduleType, hours, isRead } = req.body;
    db.prepare('INSERT INTO messages (id, senderId, receiverId, content, createdAt, status, moduleId, moduleType, hours, isRead) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(uuidv4(), senderId, receiverId, content, createdAt, status, moduleId || null, moduleType || null, hours || null, isRead ? 1 : 0);
    res.json({ success: true });
  } catch (err) { next(err); }
});

app.put('/api/messages/read-all/:receiverId', authenticateToken, (req, res) => {
  db.prepare('UPDATE messages SET isRead = 1 WHERE receiverId = ?').run(req.params.receiverId);
  res.json({ success: true });
});

app.put('/api/messages/:id/status', authenticateToken, (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    db.prepare('UPDATE messages SET status = ? WHERE id = ?').run(status, id);
    if (status === 'ACCEPTED') {
      const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
      if (msg?.moduleId && msg?.receiverId) {
        db.prepare('INSERT OR IGNORE INTO approved_overtime (teacherId, moduleId) VALUES (?, ?)').run(msg.receiverId, msg.moduleId);
      }
    }
    res.json({ success: true });
  } catch (err) { next(err); }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ 
    error: 'Database or Server Error', 
    details: err.message 
  });
});

// Vercel serverless function export
export default function handler(req, res) {
  app(req, res);
}
