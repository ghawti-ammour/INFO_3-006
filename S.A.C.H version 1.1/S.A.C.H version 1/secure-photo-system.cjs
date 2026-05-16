const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const db = new Database('database.db');

// Create secure photos directory if it doesn't exist
const photosDir = path.join(__dirname, 'secure-photos');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { mode: 0o700 }); // Only owner can access
}

// Function to encrypt photo data
function encryptPhoto(buffer) {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync('sach-photo-secret-key-2024', 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

// Function to decrypt photo data
function decryptPhoto(encryptedData) {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync('sach-photo-secret-key-2024', 'salt', 32);
  const iv = Buffer.from(encryptedData.iv, 'base64');
  const authTag = Buffer.from(encryptedData.authTag, 'base64');
  const encrypted = Buffer.from(encryptedData.encrypted, 'base64');
  
  const decipher = crypto.createDecipher(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

// Function to save photo securely
function saveSecurePhoto(userId, photoBuffer, userType) {
  const filename = `${userType}_${userId}_${Date.now()}.enc`;
  const filepath = path.join(photosDir, filename);
  
  const encrypted = encryptPhoto(photoBuffer);
  
  // Store encrypted file
  fs.writeFileSync(filepath, JSON.stringify(encrypted), { mode: 0o600 });
  
  // Store only filename in database (not the actual photo)
  return filename;
}

// Function to retrieve and decrypt photo
function getSecurePhoto(filename) {
  const filepath = path.join(photosDir, filename);
  
  if (!fs.existsSync(filepath)) {
    throw new Error('Photo file not found');
  }
  
  const encryptedData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  return decryptPhoto(encryptedData);
}

// Function to delete secure photo
function deleteSecurePhoto(filename) {
  const filepath = path.join(photosDir, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}

// Update database schema to store secure photo references
function updateDatabaseSchema() {
  try {
    // Add secure photo columns
    db.exec(`
      ALTER TABLE admin_profile ADD COLUMN securePhotoFile TEXT;
      ALTER TABLE teachers ADD COLUMN securePhotoFile TEXT;
    `);
    console.log('Database schema updated for secure photos');
  } catch (e) {
    console.log('Schema already updated or error:', e.message);
  }
}

// Migrate existing base64 photos to secure storage
function migrateExistingPhotos() {
  console.log('Migrating existing photos to secure storage...');
  
  // Migrate admin photos
  const admins = db.prepare('SELECT id, profilePhoto FROM admin_profile WHERE profilePhoto IS NOT NULL AND profilePhoto != \'\'').all();
  admins.forEach(admin => {
    if (admin.profilePhoto && !admin.profilePhoto.startsWith('secure-')) {
      try {
        const photoBuffer = Buffer.from(admin.profilePhoto.split(',')[1], 'base64');
        const secureFilename = saveSecurePhoto(admin.id, photoBuffer, 'admin');
        
        db.prepare('UPDATE admin_profile SET profilePhoto = NULL, securePhotoFile = ? WHERE id = ?')
          .run(secureFilename, admin.id);
        
        console.log(`Migrated admin photo: ${admin.id}`);
      } catch (error) {
        console.error(`Failed to migrate admin photo ${admin.id}:`, error.message);
      }
    }
  });
  
  // Migrate teacher photos
  const teachers = db.prepare('SELECT id, profilePhoto FROM teachers WHERE profilePhoto IS NOT NULL AND profilePhoto != \'\'').all();
  teachers.forEach(teacher => {
    if (teacher.profilePhoto && !teacher.profilePhoto.startsWith('secure-')) {
      try {
        const photoBuffer = Buffer.from(teacher.profilePhoto.split(',')[1], 'base64');
        const secureFilename = saveSecurePhoto(teacher.id, photoBuffer, 'teacher');
        
        db.prepare('UPDATE teachers SET profilePhoto = NULL, securePhotoFile = ? WHERE id = ?')
          .run(secureFilename, teacher.id);
        
        console.log(`Migrated teacher photo: ${teacher.id}`);
      } catch (error) {
        console.error(`Failed to migrate teacher photo ${teacher.id}:`, error.message);
      }
    }
  });
  
  console.log('Photo migration completed');
}

// Export functions for use in server
module.exports = {
  saveSecurePhoto,
  getSecurePhoto,
  deleteSecurePhoto,
  updateDatabaseSchema,
  migrateExistingPhotos
};

// Run migration if this script is executed directly
if (require.main === module) {
  updateDatabaseSchema();
  migrateExistingPhotos();
}

db.close();
