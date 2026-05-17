# S.A.C.H - Système d'Affectation et de Charge des Heures

A comprehensive academic workload management system for universities. This project is a PFE (Projet de Fin d'Études) for L3 Informatique at Université Oran 1.

## Overview

S.A.C.H is a full-stack web application designed to streamline the management of teacher workloads, course assignments, and academic programs. It provides administrators with tools to manage teachers, academic programs (Parcours), course modules, and assignments, while enabling teachers to track their workload and request overtime approvals.

## Features

### Core Functionality
- **Authentication System**: JWT-based secure authentication with role-based access control (Admin/Teacher)
- **Teacher Management**: Complete CRUD operations for teacher profiles including grades, specialties, status, and required hours
- **Academic Structure Management**: 
  - Parcours (academic programs) with type, level, year, and specialty
  - Modules with CM (Lectures), TD (Tutorials), and TP (Practicals) hour allocations
- **Assignment System**: Assign teachers to specific modules with precise hour allocations by type
- **Workload Tracking**: Real-time calculation of teacher workloads with progress indicators
- **Overtime Request System**: Message-based workflow for teachers to request and receive approval for additional hours
- **Profile Management**: Admin and teacher profile management with photo upload support

### User Experience
- **Multi-language Support**: English, French, and Arabic translations with RTL support
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly interface with sidebar navigation
- **Animated UI**: Smooth animations and transitions using Motion library
- **Real-time Updates**: Live workload calculations and statistics

## Tech Stack

### Frontend
- **React 19** - UI framework with hooks and concurrent features
- **TypeScript** - Type safety and enhanced developer experience
- **Vite 6** - Fast build tool and development server
- **TailwindCSS 4** - Utility-first CSS framework with dark mode support
- **Lucide React** - Beautiful, consistent icon set
- **Motion (Framer Motion)** - Production-ready animations
- **uuid** - Unique identifier generation

### Backend
- **Express.js 4** - Web server framework
- **better-sqlite3** - Synchronous SQLite database with full transaction support
- **jsonwebtoken** - JWT token generation and validation
- **bcrypt** - Secure password hashing
- **uuid** - Unique ID generation for database records

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
# Create a .env file
JWT_SECRET=sach-secret-key-2024-pfe-excellence
```

## Database

The application uses SQLite (better-sqlite3) with the following tables:
- `admin_profile` - Administrator accounts with role-based access
- `teachers` - Teacher profiles with grades, specialties, and workload requirements
- `approved_overtime` - Tracks approved overtime module assignments per teacher
- `parcours` - Academic programs (L1, L2, L3, M1, M2) with types and specialties
- `modules` - Course modules with CM, TD, TP hour allocations
- `assignments` - Teacher-to-module assignments with specific hour types
- `messages` - Overtime request messages with approval workflow

The database is automatically initialized on first run with foreign key constraints enabled.

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
The development server will start on `http://localhost:5173` (Vite default)

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Type Checking
```bash
npm run lint
```

## Project Structure

```
PFE-INFO/
├── api/
│   └── server.js            # Express API server (Vercel serverless function)
├── public/
│   └── assets/
│       └── logo-sach.png    # Application logo
├── src/
│   ├── App.tsx              # Main React application component
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles and Tailwind directives
│   ├── types.ts             # TypeScript type definitions
│   ├── translations.ts      # Internationalization (EN/FR/AR)
│   └── mockData.ts          # Mock data for development
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel deployment configuration
├── .env.example             # Environment variables template
└── .gitignore               # Git ignore rules
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

### Vercel (Recommended)
The project is configured for Vercel deployment with:
- `vercel.json` configuration for serverless functions
- `api/server.js` as the API endpoint
- Automatic build with `vercel-build` script

To deploy:
1. Push your code to GitHub
2. Import the project in Vercel dashboard
3. Vercel will automatically detect the configuration and deploy
4. The API will be available at `/api/*` endpoints

### Environment Variables on Vercel
Set the following in your Vercel project settings:
- `JWT_SECRET` - Your secret key for JWT token generation

### Manual Deployment
For manual deployment, build the project and serve the `dist` folder with any static file server.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Secure file upload handling
- SQL injection prevention with prepared statements

## Development Notes

- The SQLite database is created automatically in `/tmp` on Vercel or locally
- Foreign key constraints are enabled for data integrity
- Database schema is initialized automatically on server start
- Vite provides hot module replacement during development
- The API uses prepared statements to prevent SQL injection
- JWT tokens expire after 24 hours
- Default admin account is created automatically if it doesn't exist

## License

This project is part of a PFE (Projet de Fin d'Études) - Academic Project

## Support

For issues or questions, please contact the development team.
