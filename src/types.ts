import { LucideIcon } from 'lucide-react';

export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
}

export enum TeacherStatus {
  PERMANENT = 'PERMANENT',
  VACATAIRE = 'VACATAIRE',
}

export enum TeacherGrade {
  PROFESSEUR = 'PROFESSEUR',
  MAITRE_DE_CONFERENCES_A = 'MAITRE_DE_CONFERENCES_A',
  MAITRE_DE_CONFERENCES_B = 'MAITRE_DE_CONFERENCES_B',
  MAITRE_ASSISTANT_A = 'MAITRE_ASSISTANT_A',
  MAITRE_ASSISTANT_B = 'MAITRE_ASSISTANT_B',
}

export enum ModuleType {
  CM = 'CM', // Cours Magistral
  TD = 'TD', // Travaux Dirigés
  TP = 'TP', // Travaux Pratiques
}

export enum MessageStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  moduleId?: string;
  moduleType?: ModuleType;
  hours?: number;
  status: MessageStatus;
  isRead: boolean;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for login
  grade: TeacherGrade;
  specialty: string;
  status: TeacherStatus;
  requiredHours: number;
  approvedOvertimeModuleIds: string[]; // IDs of modules teacher accepted to teach beyond hours
  profilePhoto?: string; // Base64 or URL
  // Algerian university system fields
  prioritySessionType: ModuleType; // Type de séance prioritaire based on grade
  weeklyEstimatedHours: string; // Heures réelles / semaine (estimatif)
}

export enum ParcoursType {
  LMD = 'LMD',
  INGENIEUR = 'INGENIEUR',
}

export enum LMDLevel {
  LICENCE = 'LICENCE',
  MASTER = 'MASTER',
}

export interface Parcours {
  id: string;
  name: string;
  type: ParcoursType;
  level?: LMDLevel;
  year: number;
  specialty: string;
  description: string;
}

export interface Module {
  id: string;
  code: string;
  name: string;
  semester: number;
  cmHours: number;
  tdHours: number;
  tpHours: number;
  parcoursId: string;
}

export interface Assignment {
  id: string;
  teacherId: string;
  moduleId: string;
  type: ModuleType;
  hours: number;
}

export interface UserSession {
  id: string;
  role: UserRole;
  name: string;
  teacherId?: string;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  roles: UserRole[];
}
