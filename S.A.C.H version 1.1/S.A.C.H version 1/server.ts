import express from 'express';
import { createServer as createViteServer } from 'vite';
import { neon } from '@neondatabase/serverless';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// 1. DATABASE CONFIGURATION & SCHEMA
// ==========================================
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/sach';
const sql = neon(DATABASE_URL);

const JWT_SECRET = process.env.JWT_SECRET || 'sach-secret-key-2024-pfe-excellence';

// Initialize database schema
async function initializeDatabase() {
  await sql`
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
  `;

  // Seed admin
  const existingAdmin = await sql`SELECT * FROM admin_profile WHERE email = ${'admin@sach.com'}`;
  if (existingAdmin.length === 0) {
    const hashedPassword = bcrypt.hashSync('admin', 10);
    await sql`INSERT INTO admin_profile (id, name, email, password, role, profilePhoto) VALUES (${uuidv4()}, ${'Admin User'}, ${'admin@sach.com'}, ${hashedPassword}, ${'ADMIN'}, ${''})`;
  } else if (!existingAdmin[0].password.startsWith('$2b$')) {
    const hashedPassword = bcrypt.hashSync(existingAdmin[0].password, 10);
    await sql`UPDATE admin_profile SET password = ${hashedPassword} WHERE id = ${existingAdmin[0].id}`;
  }
}

initializeDatabase();

// ==========================================
// 2. MIDDLEWARE
// ==========================================

// JWT Authentication Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access Denied: No Token Provided' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or Expired Token' });
    req.user = user;
    next();
  });
}

// Administrative Check Middleware
function isAdmin(req: any, res: any, next: any) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access Denied: Admin Privileges Required' });
  }
  next();
}

// ==========================================
// 3. SERVER & ROUTES
// ==========================================
async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // --- AUTH ROUTE ---
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      // 1. Check Admin — look up by email first, then fallback to 'admin' username shortcut
      let admin: any[] = await sql`SELECT * FROM admin_profile WHERE email = ${email}`;
      let adminData = admin.length > 0 ? admin[0] : null;
      
      if (!adminData && email === 'admin') {
        // Allow the special 'admin' username shortcut → fetch the SUPER_ADMIN
        const superAdmin = await sql`SELECT * FROM admin_profile WHERE role = 'SUPER_ADMIN' LIMIT 1`;
        adminData = superAdmin.length > 0 ? superAdmin[0] : null;
      }
      
      if (adminData && adminData.password) {
        const valid = await bcrypt.compare(String(password), String(adminData.password));
        if (valid) {
          const token = jwt.sign({ id: adminData.id, role: 'ADMIN', name: adminData.name }, JWT_SECRET, { expiresIn: '24h' });
          return res.json({ success: true, token, session: { id: adminData.id, role: 'ADMIN', name: adminData.name } });
        }
      }

      // 2. Check Teacher
      const teacher = await sql`SELECT * FROM teachers WHERE email = ${email}`;
      const teacherData = teacher.length > 0 ? teacher[0] : null;
      
      if (teacherData && teacherData.password) {
        const valid = await bcrypt.compare(String(password), String(teacherData.password));
        if (valid) {
          const token = jwt.sign({ id: teacherData.id, role: 'TEACHER', name: teacherData.name, teacherId: teacherData.id }, JWT_SECRET, { expiresIn: '24h' });
          return res.json({ success: true, token, session: { id: teacherData.id, role: 'TEACHER', name: teacherData.name, teacherId: teacherData.id } });
        }
      }

      res.status(401).json({ error: 'Invalid credentials' });
    } catch (error: any) {
      console.error('Login error:', error?.message || error);
      res.status(500).json({ error: 'Internal Server Error', details: error?.message });
    }
  });

  // --- ADMIN ROUTES (Protected) ---
  app.get('/api/admin/profile', authenticateToken, async (req, res) => {
    const profile = await sql`SELECT * FROM admin_profile ORDER BY role DESC`;
    res.json(profile[0] || null);
  });

  app.get('/api/admin/profile/:id', authenticateToken, async (req, res) => {
    const profile = await sql`SELECT * FROM admin_profile WHERE id = ${req.params.id}`;
    res.json(profile[0] || null);
  });

  app.get('/api/admin/main', authenticateToken, async (req, res) => {
    try {
      console.log('Fetching main admin...');
      const mainAdmin = await sql`SELECT id, name FROM admin_profile WHERE role = 'SUPER_ADMIN'`;
      console.log('Main admin query result:', mainAdmin);
      if (mainAdmin.length === 0) {
        console.log('No main admin found, returning null');
        return res.json(null);
      }
      console.log('Returning main admin:', mainAdmin[0]);
      res.json(mainAdmin[0]);
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
        await sql`UPDATE admin_profile SET name = ${name}, email = ${email}, password = ${hashed}, profilePhoto = ${profilePhoto} WHERE id = ${id}`;
      } else {
        await sql`UPDATE admin_profile SET name = ${name}, email = ${email}, profilePhoto = ${profilePhoto} WHERE id = ${id}`;
      }
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Update failed' }); }
  });

  // --- TEACHER ROUTES ---
  app.get('/api/teachers', authenticateToken, async (req, res) => {
    try {
      const teachers = await sql`SELECT * FROM teachers`;
      const teachersWithOvertime = await Promise.all(teachers.map(async (t: any) => {
        const approvedOvertime = await sql`SELECT moduleId FROM approved_overtime WHERE teacherId = ${t.id}`;
        const approvedOvertimeModuleIds = approvedOvertime.map((row: any) => row.moduleId);
        return { ...t, approvedOvertimeModuleIds };
      }));
      res.json(teachersWithOvertime);
    } catch (e) { res.status(500).json({ error: 'Fetch failed' }); }
  });

  app.get('/api/teachers/:id/workload', authenticateToken, async (req, res) => {
    try {
      const assignments = await sql`SELECT type, hours FROM assignments WHERE teacherId = ${req.params.id}`;
      const cm = assignments.filter((a: any) => a.type === 'CM').reduce((acc: number, curr: any) => acc + curr.hours, 0);
      const td = assignments.filter((a: any) => a.type === 'TD').reduce((acc: number, curr: any) => acc + curr.hours, 0);
      const tp = assignments.filter((a: any) => a.type === 'TP').reduce((acc: number, curr: any) => acc + curr.hours, 0);
      const teacher = await sql`SELECT requiredHours FROM teachers WHERE id = ${req.params.id}`;
      
      res.json({
        cm, td, tp,
        total: cm + td + tp,
        required: teacher[0]?.requiredHours || 0
      });
    } catch (e) { res.status(500).json({ error: 'Workload calculation failed' }); }
  });

  app.post('/api/teachers', authenticateToken, isAdmin, async (req, res, next) => {
    try {
      const { name, email, password, grade, specialty, status, requiredHours, profilePhoto, prioritySessionType, weeklyEstimatedHours } = req.body;
      const hashedPassword = await bcrypt.hash(password || 'teacher123', 10);
      await sql`INSERT INTO teachers (id, name, email, password, grade, specialty, status, requiredHours, profilePhoto, prioritySessionType, weeklyEstimatedHours) VALUES (${uuidv4()}, ${name}, ${email}, ${hashedPassword}, ${grade}, ${specialty}, ${status}, ${requiredHours}, ${profilePhoto || ''}, ${prioritySessionType || 'TD'}, ${weeklyEstimatedHours || '8h à 10h'})`;
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  app.put('/api/teachers/:id', authenticateToken, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, password, profilePhoto, grade, specialty, status, requiredHours, prioritySessionType, weeklyEstimatedHours } = req.body;
      if (password && !password.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(password, 10);
        await sql`UPDATE teachers SET name = ${name}, email = ${email}, password = ${hashed}, profilePhoto = ${profilePhoto}, grade = ${grade}, specialty = ${specialty}, status = ${status}, requiredHours = ${requiredHours}, prioritySessionType = ${prioritySessionType}, weeklyEstimatedHours = ${weeklyEstimatedHours} WHERE id = ${id}`;
      } else {
        await sql`UPDATE teachers SET name = ${name}, email = ${email}, profilePhoto = ${profilePhoto}, grade = ${grade}, specialty = ${specialty}, status = ${status}, requiredHours = ${requiredHours}, prioritySessionType = ${prioritySessionType}, weeklyEstimatedHours = ${weeklyEstimatedHours} WHERE id = ${id}`;
      }
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  app.delete('/api/teachers/:id', authenticateToken, isAdmin, async (req, res, next) => {
    try {
      await sql`DELETE FROM teachers WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  // --- PARCOURS ROUTES ---
  app.get('/api/parcours', authenticateToken, async (req, res) => {
    res.json(await sql`SELECT * FROM parcours`);
  });

  app.post('/api/parcours', authenticateToken, isAdmin, async (req, res, next) => {
    try {
      const { name, type, level, year, specialty, description } = req.body;
      await sql`INSERT INTO parcours (id, name, type, level, year, specialty, description) VALUES (${uuidv4()}, ${name}, ${type}, ${level || null}, ${year}, ${specialty}, ${description})`;
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  // --- MODULE ROUTES ---
  app.get('/api/modules', authenticateToken, async (req, res) => {
    res.json(await sql`SELECT * FROM modules`);
  });

  app.post('/api/modules', authenticateToken, isAdmin, async (req, res, next) => {
    try {
      const { code, name, semester, cmHours, tdHours, tpHours, parcoursId } = req.body;
      if (!parcoursId) {
        return res.status(400).json({ error: 'A module must be linked to a Parcours.' });
      }
      await sql`INSERT INTO modules (id, code, name, semester, cmHours, tdHours, tpHours, parcoursId) VALUES (${uuidv4()}, ${code}, ${name}, ${semester}, ${cmHours}, ${tdHours}, ${tpHours}, ${parcoursId})`;
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  app.delete('/api/modules/:id', authenticateToken, isAdmin, async (req, res, next) => {
    try {
      await sql`DELETE FROM modules WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  app.delete('/api/parcours/:id', authenticateToken, isAdmin, async (req, res, next) => {
    try {
      await sql`DELETE FROM parcours WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  // --- MODULE ROUTES ---
  app.get('/api/assignments', authenticateToken, async (req, res) => {
    res.json(await sql`SELECT * FROM assignments`);
  });

  app.post('/api/assignments', authenticateToken, isAdmin, async (req, res, next) => {
    try {
      const { teacherId, moduleId, type, hours } = req.body;
      await sql`INSERT INTO assignments (id, teacherId, moduleId, type, hours) VALUES (${uuidv4()}, ${teacherId}, ${moduleId}, ${type}, ${hours})`;
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  app.put('/api/assignments/:id', authenticateToken, isAdmin, async (req, res, next) => {
    try {
      const { teacherId, moduleId, type, hours } = req.body;
      await sql`UPDATE assignments SET teacherId = ${teacherId}, moduleId = ${moduleId}, type = ${type}, hours = ${hours} WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  app.delete('/api/assignments/:id', authenticateToken, isAdmin, async (req, res, next) => {
    try {
      await sql`DELETE FROM assignments WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  // --- MESSAGE ROUTES ---
  app.get('/api/messages', authenticateToken, async (req, res) => {
    res.json(await sql`SELECT * FROM messages`);
  });

  app.post('/api/messages', authenticateToken, async (req, res, next) => {
    try {
      const { senderId, receiverId, content, createdAt, status, moduleId, moduleType, hours, isRead } = req.body;
      await sql`INSERT INTO messages (id, senderId, receiverId, content, createdAt, status, moduleId, moduleType, hours, isRead) VALUES (${uuidv4()}, ${senderId}, ${receiverId}, ${content}, ${createdAt}, ${status}, ${moduleId || null}, ${moduleType || null}, ${hours || null}, ${isRead ? 1 : 0})`;
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  app.put('/api/messages/read-all/:receiverId', authenticateToken, async (req, res) => {
    await sql`UPDATE messages SET isRead = 1 WHERE receiverId = ${req.params.receiverId}`;
    res.json({ success: true });
  });

  app.put('/api/messages/:id/status', authenticateToken, async (req, res, next) => {
    try {
      const { status } = req.body;
      const { id } = req.params;
      await sql`UPDATE messages SET status = ${status} WHERE id = ${id}`;
      if (status === 'ACCEPTED') {
        const msg = await sql`SELECT * FROM messages WHERE id = ${id}`;
        if (msg.length > 0 && msg[0]?.moduleId && msg[0]?.receiverId) {
          await sql`INSERT INTO approved_overtime (teacherId, moduleId) VALUES (${msg[0].receiverId}, ${msg[0].moduleId}) ON CONFLICT DO NOTHING`;
        }
      }
      res.json({ success: true });
    } catch (err) { next(err); }
  });

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  // --- GLOBAL ERROR HANDLER ---
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Server Error:', err.message);
    res.status(500).json({ 
      error: 'Database or Server Error', 
      details: err.message 
    });
  });

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`S.A.C.H Server running on http://localhost:${PORT} [JWT SECURED]`);
  });
}

startServer();
