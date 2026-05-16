// Vercel Serverless Function Entry Point
import express from 'express';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// Initialize Express app
const app = express();
app.use(express.json());

// Database setup for Vercel (using in-memory or external DB)
let db;
try {
  // Try to use local SQLite first (for development)
  db = new Database('/tmp/database.db');
} catch (error) {
  console.log('Using in-memory database for production');
  db = new Database(':memory:');
}

// Initialize database schema
db.pragma('foreign_keys = ON');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Database schema initialization
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
`);

// Import your existing API routes here
// You'll need to copy your API logic from server.ts

// Example login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check admin login
    const admin = db.prepare('SELECT * FROM admin_profile WHERE email = ?').get(email);
    if (admin && await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign({ 
        role: 'ADMIN', 
        id: admin.id 
      }, JWT_SECRET);
      
      return res.json({
        success: true,
        token,
        session: {
          role: 'ADMIN',
          id: admin.id,
          name: admin.name
        }
      });
    }
    
    // Check teacher login
    const teacher = db.prepare('SELECT * FROM teachers WHERE email = ?').get(email);
    if (teacher && await bcrypt.compare(password, teacher.password)) {
      const token = jwt.sign({ 
        role: 'TEACHER', 
        teacherId: teacher.id 
      }, JWT_SECRET);
      
      return res.json({
        success: true,
        token,
        session: {
          role: 'TEACHER',
          teacherId: teacher.id,
          name: teacher.name
        }
      });
    }
    
    res.json({ success: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export for Vercel
export default app;
