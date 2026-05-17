# S.A.C.H - Système d'Affectation et de charge des Heures

Version 1.1 - Teacher Management System

## Overview

S.A.C.H is a comprehensive teacher management system designed to handle academic workload assignments, teacher profiles, course modules, and overtime requests. Built with React, TypeScript, Express, and SQLite.

## Features

- **Authentication System**: JWT-based secure authentication for admins and teachers
- **Teacher Management**: Full CRUD operations for teacher profiles with photo support
- **Academic Structure**: Manage Parcours (academic programs) and Modules
- **Workload Tracking**: Track CM (Lectures), TD (Tutorials), and TP (Practicals) hours
- **Assignment System**: Assign teachers to specific modules with hour allocations
- **Overtime Requests**: Message-based system for teachers to request overtime approval
- **Secure Photo Handling**: Secure upload and storage of profile photos
- **Real-time Statistics**: Calculate teacher workloads and compare with required hours

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Motion** - Animations

### Backend
- **Express.js** - Web server
- **better-sqlite3** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **multer** - File uploads

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
# Create a .env file (currently JWT_SECRET is hardcoded in server.ts)
# JWT_SECRET=your-secret-key-here
```

## Database

The application uses SQLite with the following tables:
- `admin_profile` - Administrator accounts
- `teachers` - Teacher profiles
- `approved_overtime` - Approved overtime requests
- `parcours` - Academic programs
- `modules` - Course modules
- `assignments` - Teacher-module assignments
- `messages` - Overtime request messages

## Default Credentials

**Admin Account:**
- Email: `admin@sach.com`
- Password: `admin`

*Note: The admin account is automatically created on first run.*

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Production Server
```bash
npm run start
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
S.A.C.H version 1/
├── src/
│   ├── App.tsx              # Main React application
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles
│   ├── types.ts             # TypeScript type definitions
│   ├── translations.ts      # Internationalization
│   └── mockData.ts          # Mock data for testing
├── server.ts                # Main Express server
├── api-server.js            # Vercel serverless function
├── database.db              # SQLite database
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── vercel.json              # Vercel deployment config
```

## API Endpoints

### Authentication
- `POST /api/login` - User login (admin or teacher)

### Admin Routes
- `GET /api/admin/profile` - Get admin profile
- `GET /api/admin/profile/:id` - Get specific admin
- `GET /api/admin/main` - Get main admin
- `PUT /api/admin/profile/:id` - Update admin profile

### Teacher Routes
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id/workload` - Get teacher workload statistics
- `POST /api/teachers` - Create new teacher (admin only)
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher (admin only)

### Parcours Routes
- `GET /api/parcours` - Get all academic programs
- `POST /api/parcours` - Create new program (admin only)
- `DELETE /api/parcours/:id` - Delete program (admin only)

### Module Routes
- `GET /api/modules` - Get all modules
- `POST /api/modules` - Create new module (admin only)
- `DELETE /api/modules/:id` - Delete module (admin only)

### Assignment Routes
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create assignment (admin only)
- `PUT /api/assignments/:id` - Update assignment (admin only)
- `DELETE /api/assignments/:id` - Delete assignment (admin only)

### Message Routes
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message
- `PUT /api/messages/read-all/:receiverId` - Mark all messages as read
- `PUT /api/messages/:id/status` - Update message status (ACCEPTED/REJECTED)

## User Roles

### ADMIN
- Full access to all features
- Can manage teachers, parcours, modules, and assignments
- Can approve/reject overtime requests
- Default account created automatically

### TEACHER
- View own profile and workload
- Send overtime requests
- View assigned modules
- Cannot modify system data

## Deployment

### Vercel
The project includes `vercel.json` for deployment. The `api-server.js` file is configured as a serverless function.

To deploy:
1. Push to GitHub
2. Import project in Vercel
3. Deploy

### Manual Deployment
```bash
npm run build
npm run start
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Secure file upload handling
- SQL injection prevention with prepared statements

## Development Notes

- The database file (`database.db`) is created automatically
- Foreign key constraints are enabled
- Database migrations are handled automatically
- In development, Vite provides hot module replacement

## License

This project is part of a PFE (Projet de Fin d'Études) - Academic Project

## Support

For issues or questions, please contact the development team.
