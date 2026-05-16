// Add these imports to server.ts
import crypto from 'crypto';
import fs from 'fs';
import multer, { File } from 'multer';
import path from 'path';
import Database from 'better-sqlite3';
import express, { Request } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include multer file
interface AuthenticatedRequest extends Request {
  user: any;
  file?: File;
}

// Database connection
const db = new Database('database.db');
db.pragma('foreign_keys = ON');

// JWT and middleware setup
const JWT_SECRET = 'sach-secret-key-2024-pfe-excellence';
const app = express();

// Authentication middleware
function authenticateToken(req: AuthenticatedRequest, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// ==========================================
// SECURE PHOTO SYSTEM
// ==========================================

const photosDir = path.join(__dirname, 'secure-photos');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { mode: 0o700 });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Photo encryption functions
function encryptPhoto(buffer: Buffer) {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync('sach-photo-secret-key-2024', 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

function saveSecurePhoto(userId: string, photoBuffer: Buffer, userType: string): string {
  const filename = `${userType}_${userId}_${Date.now()}.enc`;
  const filepath = path.join(photosDir, filename);
  
  const encrypted = encryptPhoto(photoBuffer);
  
  fs.writeFileSync(filepath, JSON.stringify(encrypted), { mode: 0o600 });
  
  return filename;
}

function getSecurePhoto(filename: string): Buffer {
  const filepath = path.join(photosDir, filename);
  
  if (!fs.existsSync(filepath)) {
    throw new Error('Photo file not found');
  }
  
  const encryptedData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync('sach-photo-secret-key-2024', 'salt', 32);
  const iv = Buffer.from(encryptedData.iv, 'base64');
  const authTag = Buffer.from(encryptedData.authTag, 'base64');
  const encrypted = Buffer.from(encryptedData.encrypted, 'base64');
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

function deleteSecurePhoto(filename: string) {
  const filepath = path.join(photosDir, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}

// Photo access validation middleware
function validatePhotoAccess(req: AuthenticatedRequest, res: any, next: any) {
  const { userType, userId } = req.params;
  const requestingUser = req.user;
  
  if (requestingUser.role === 'ADMIN') {
    return next();
  }
  
  if (requestingUser.role === 'TEACHER') {
    if (userType === 'teacher' && requestingUser.teacherId === userId) {
      return next();
    }
  }
  
  return res.status(403).json({ error: 'Access Denied: You cannot access this photo' });
}

// ==========================================
// ADD THESE ROUTES TO YOUR SERVER
// ==========================================

// Update database schema for secure photos
try {
  db.exec(`
    ALTER TABLE admin_profile ADD COLUMN securePhotoFile TEXT;
    ALTER TABLE teachers ADD COLUMN securePhotoFile TEXT;
  `);
} catch (e) {
  // Schema already updated
}

// Secure photo upload endpoint for admin
app.post('/api/admin/profile/:id/photo', authenticateToken, upload.single('photo'), (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    
    // Check if user can update this profile
    if (req.user.role !== 'ADMIN' || (req.user.role === 'ADMIN' && req.user.id !== id && req.user.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({ error: 'Access Denied' });
    }
    
    // Get old photo to delete
    const oldPhoto = db.prepare('SELECT securePhotoFile FROM admin_profile WHERE id = ?').get(id) as any;
    
    // Save new photo securely
    const filename = saveSecurePhoto(id, req.file.buffer, 'admin');
    
    // Update database
    db.prepare('UPDATE admin_profile SET securePhotoFile = ? WHERE id = ?')
      .run(filename, id);
    
    // Delete old photo
    if (oldPhoto?.securePhotoFile) {
      deleteSecurePhoto(oldPhoto.securePhotoFile);
    }
    
    res.json({ success: true, message: 'Photo uploaded securely' });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Secure photo upload endpoint for teachers
app.post('/api/teachers/:id/photo', authenticateToken, upload.single('photo'), (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    
    // Check if user can update this profile
    if (req.user.role !== 'ADMIN' && (req.user.role === 'TEACHER' && req.user.teacherId !== id)) {
      return res.status(403).json({ error: 'Access Denied' });
    }
    
    // Get old photo to delete
    const oldPhoto = db.prepare('SELECT securePhotoFile FROM teachers WHERE id = ?').get(id) as any;
    
    // Save new photo securely
    const filename = saveSecurePhoto(id, req.file.buffer, 'teacher');
    
    // Update database
    db.prepare('UPDATE teachers SET securePhotoFile = ? WHERE id = ?')
      .run(filename, id);
    
    // Delete old photo
    if (oldPhoto?.securePhotoFile) {
      deleteSecurePhoto(oldPhoto.securePhotoFile);
    }
    
    res.json({ success: true, message: 'Photo uploaded securely' });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Secure photo access endpoint
app.get('/api/photos/:userType/:userId', authenticateToken, validatePhotoAccess, (req: AuthenticatedRequest, res) => {
  try {
    const { userType, userId } = req.params;
    
    let photoRecord;
    if (userType === 'admin') {
      photoRecord = db.prepare('SELECT securePhotoFile FROM admin_profile WHERE id = ?').get(userId);
    } else if (userType === 'teacher') {
      photoRecord = db.prepare('SELECT securePhotoFile FROM teachers WHERE id = ?').get(userId);
    }
    
    if (!photoRecord || !photoRecord.securePhotoFile) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    const photoBuffer = getSecurePhoto(photoRecord.securePhotoFile);
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(photoBuffer);
  } catch (error) {
    console.error('Photo access error:', error);
    res.status(500).json({ error: 'Failed to retrieve photo' });
  }
});

// Migration function to move existing base64 photos to secure storage
function migrateExistingPhotos() {
  console.log('Migrating existing photos to secure storage...');
  
  // Migrate admin photos
  const admins = db.prepare('SELECT id, profilePhoto FROM admin_profile WHERE profilePhoto IS NOT NULL AND profilePhoto != ""').all() as any[];
  admins.forEach(admin => {
    if (admin.profilePhoto && !admin.profilePhoto.startsWith('secure-')) {
      try {
        const photoBuffer = Buffer.from(admin.profilePhoto.split(',')[1], 'base64');
        const secureFilename = saveSecurePhoto(admin.id, photoBuffer, 'admin');
        
        db.prepare('UPDATE admin_profile SET profilePhoto = NULL, securePhotoFile = ? WHERE id = ?')
          .run(secureFilename, admin.id);
        
        console.log(`Migrated admin photo: ${admin.id}`);
      } catch (error) {
        console.error(`Failed to migrate admin photo ${admin.id}:`, error);
      }
    }
  });
  
  // Migrate teacher photos
  const teachers = db.prepare('SELECT id, profilePhoto FROM teachers WHERE profilePhoto IS NOT NULL AND profilePhoto != ""').all() as any[];
  teachers.forEach(teacher => {
    if (teacher.profilePhoto && !teacher.profilePhoto.startsWith('secure-')) {
      try {
        const photoBuffer = Buffer.from(teacher.profilePhoto.split(',')[1], 'base64');
        const secureFilename = saveSecurePhoto(teacher.id, photoBuffer, 'teacher');
        
        db.prepare('UPDATE teachers SET profilePhoto = NULL, securePhotoFile = ? WHERE id = ?')
          .run(secureFilename, teacher.id);
        
        console.log(`Migrated teacher photo: ${teacher.id}`);
      } catch (error) {
        console.error(`Failed to migrate teacher photo ${teacher.id}:`, error);
      }
    }
  });
  
  console.log('Photo migration completed');
}

// Run migration on server start
migrateExistingPhotos();

export {
  upload,
  validatePhotoAccess,
  saveSecurePhoto,
  getSecurePhoto,
  deleteSecurePhoto
};
