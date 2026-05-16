const { getSecurePhoto } = require('./secure-photo-system');

// Middleware to validate photo access
function validatePhotoAccess(req, res, next) {
  const { userType, userId } = req.params;
  const requestingUser = req.user;
  
  // Only allow access if:
  // 1. User is requesting their own photo, OR
  // 2. User is an admin requesting any photo
  
  if (requestingUser.role === 'ADMIN') {
    // Admins can access any photo
    return next();
  }
  
  if (requestingUser.role === 'TEACHER') {
    // Teachers can only access their own photos
    if (userType === 'teacher' && requestingUser.teacherId === userId) {
      return next();
    }
  }
  
  return res.status(403).json({ error: 'Access Denied: You cannot access this photo' });
}

// Photo serving endpoint
function servePhoto(req, res) {
  try {
    const { userType, userId } = req.params;
    
    // Get photo filename from database
    let photoRecord;
    if (userType === 'admin') {
      photoRecord = db.prepare('SELECT securePhotoFile FROM admin_profile WHERE id = ?').get(userId);
    } else if (userType === 'teacher') {
      photoRecord = db.prepare('SELECT securePhotoFile FROM teachers WHERE id = ?').get(userId);
    }
    
    if (!photoRecord || !photoRecord.securePhotoFile) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Decrypt and serve photo
    const photoBuffer = getSecurePhoto(photoRecord.securePhotoFile);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'private, max-age=3600'); // Cache for 1 hour
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    res.send(photoBuffer);
  } catch (error) {
    console.error('Photo access error:', error);
    res.status(500).json({ error: 'Failed to retrieve photo' });
  }
}

module.exports = {
  validatePhotoAccess,
  servePhoto
};
