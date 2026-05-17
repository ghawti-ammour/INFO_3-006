import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  Search, 
  GraduationCap, 
  Clock, 
  BarChart3, 
  ChevronRight,
  Menu,
  X,
  Briefcase,
  Layers,
  AlertCircle,
  Check,
  Trash2,
  Edit2,
  MessageSquare,
  User,
  Camera,
  Save,
  Lock,
  Mail,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserRole, 
  TeacherStatus, 
  TeacherGrade,
  ModuleType, 
  Teacher, 
  Module, 
  Assignment, 
  UserSession,
  Parcours,
  ParcoursType,
  LMDLevel,
  Message,
  MessageStatus
} from './types';
import { MOCK_TEACHERS, MOCK_MODULES, MOCK_ASSIGNMENTS, MOCK_PARCOURS } from './mockData';
import { translations, Language } from './translations';

// --- Translation Context ---
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = React.useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within a LanguageProvider');
  return context;
};

// --- Components ---

const SplashScreen = ({ onComplete }: { onComplete: () => void, key?: React.Key }) => {
  const [stage, setStage] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 1000); // Show full text
    const timer2 = setTimeout(() => setStage(2), 3000); // Transition to S.A.C.H
    const timer3 = setTimeout(() => onComplete(), 5000); // Finish
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-slate-50 dark:bg-[#050505] flex flex-col items-center justify-center overflow-hidden transition-colors duration-300"
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0, opacity: 0, filter: "blur(20px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ 
            type: "spring", 
            stiffness: 80, 
            damping: 15,
            duration: 1.5 
          }}
          className="w-48 h-48 flex items-center justify-center mb-12 relative"
        >
          <motion.img
            src="/assets/logo-sach.png"
            alt="S.A.C.H Logo"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]"
          />
        </motion.div>

        {/* Text Animation Area */}
        <div className="h-20 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {stage === 1 && (
              <motion.div
                key="full-text"
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-slate-900 dark:text-white text-2xl font-light tracking-[0.1em] uppercase text-center px-4">
                  {t('sach_full')}
                </h2>
              </motion.div>
            )}
            {stage >= 2 && (
              <motion.div
                key="abbreviation"
                initial={{ opacity: 0, scale: 0.8, letterSpacing: "1.5em", filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, letterSpacing: "0.4em", filter: "blur(0px)" }}
                transition={{ 
                  duration: 1.2,
                  type: "spring",
                  stiffness: 100
                }}
                className="flex flex-col items-center"
              >
                <h1 className="text-7xl font-black text-slate-900 dark:text-white font-display italic">
                  S.A.C.H
                </h1>
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-1 bg-gradient-to-r from-transparent via-blue-600 dark:via-blue-500 to-transparent mt-4"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Immersive Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)]" />
      </div>
    </motion.div>
  );
};

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  key?: React.Key;
}

const GlassCard = ({ children, className = "", delay = 0, onClick }: GlassCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`glass rounded-2xl p-4 sm:p-6 ${className}`}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

const StatCard = ({ label, value, icon: Icon, colorClass = "text-blue-700 dark:text-blue-400", className = "" }: any) => (
  <GlassCard className={`flex items-center gap-4 ${className}`}>
    <div className={`p-3 rounded-xl bg-white dark:bg-white/5 ${colorClass} shrink-0`}>
      <Icon size={24} />
    </div>
    <div className="min-w-0">
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium truncate">{label}</p>
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">{value}</h3>
    </div>
  </GlassCard>
);

const WorkloadProgressBar = ({ teacherId, requiredHours, t }: { teacherId: string, requiredHours: number, t: (key: string) => string }) => {
  const [workload, setWorkload] = useState<{ total: number, cm: number, td: number, tp: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkload = async () => {
      try {
        const res = await apiFetch(`/api/teachers/${teacherId}/workload`);
        if (res.ok) {
          setWorkload(await res.json());
        }
      } catch (e) {
        console.error('Workload fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkload();
    
    // Refresh workload when assignments change
    const handleRefresh = () => fetchWorkload();
    window.addEventListener('refresh-workload', handleRefresh);
    return () => window.removeEventListener('refresh-workload', handleRefresh);
  }, [teacherId]);

  if (loading || !workload) return <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />;

  const progress = requiredHours > 0 ? Math.min((workload.total / requiredHours) * 100, 100) : 0;
  const isOverloaded = workload.total > requiredHours;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500">Service Hours</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {workload.total}h <span className="text-xs font-normal text-slate-400">/ {requiredHours}h</span>
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isOverloaded ? 'bg-red-500/10 text-red-500' : progress >= 100 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
        }`}>
          {isOverloaded ? t('overloaded') : `${Math.round(progress)}% ${t('complete')}`}
        </span>
      </div>
      <div className="h-2.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isOverloaded ? 'bg-red-500' : progress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-500'
          } shadow-[0_0_10px_rgba(37,99,235,0.3)]`}
        />
      </div>
      <div className="flex gap-1.5">
        {[
          { label: 'CM', val: workload.cm, color: 'text-blue-500' },
          { label: 'TD', val: workload.td, color: 'text-emerald-500' },
          { label: 'TP', val: workload.tp, color: 'text-amber-500' }
        ].map(s => (
          <div key={s.label} className="flex-1 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-lg py-1 px-2 text-center">
            <span className="text-[8px] font-bold text-slate-400 block uppercase">{s.label}</span>
            <span className={`text-xs font-bold ${s.color}`}>{s.val}h</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

// --- API Helper ---
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('sach_token');
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      localStorage.removeItem('sach_token');
      localStorage.removeItem('sach_session');
      window.dispatchEvent(new CustomEvent('unauthorized-access'));
      alert("Session expired. Please log in again.");
    } else if (response.status === 403) {
      alert("Access Denied: You don't have permission for this action.");
    }
    
    return response;
  } catch (error) {
    console.error('Network Error:', error);
    alert("Network Error: Could not connect to server.");
    throw error;
  }
};

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t, language, setLanguage } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const [parcours, setParcours] = useState<Parcours[]>(MOCK_PARCOURS);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [modules, setModules] = useState<Module[]>(MOCK_MODULES);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedParcoursId, setSelectedParcoursId] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedParcoursType, setSelectedParcoursType] = useState<ParcoursType | null>(null);
  const [selectedLMDLevel, setSelectedLMDLevel] = useState<LMDLevel | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);        
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Modal State
  const [isParcoursModalOpen, setIsParcoursModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [newlyCreatedTeacher, setNewlyCreatedTeacher] = useState<Teacher | null>(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isEditTeacherModalOpen, setIsEditTeacherModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isManageAssignmentsModalOpen, setIsManageAssignmentsModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [parcoursToDelete, setParcoursToDelete] = useState<Parcours | null>(null);
  const [selectedModuleForAssignment, setSelectedModuleForAssignment] = useState<Module | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mainAdminId, setMainAdminId] = useState<string | null>(null);

  // Login Form State
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [adminProfile, setAdminProfile] = useState({
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@sach.com',
    password: 'admin',
    profilePhoto: ''
  });

  // Check for existing token on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('sach_session');
    const token = localStorage.getItem('sach_token');
    if (savedSession && token) {
      try {
        setSession(JSON.parse(savedSession));
      } catch (error) {
        console.error('Failed to parse saved session:', error);
        // Clear invalid session data
        localStorage.removeItem('sach_session');
        localStorage.removeItem('sach_token');
      }
    }

    const handleUnauthorized = () => {
      setSession(null);
      localStorage.removeItem('sach_session');
      localStorage.removeItem('sach_token');
    };

    window.addEventListener('unauthorized-access', handleUnauthorized);
    return () => window.removeEventListener('unauthorized-access', handleUnauthorized);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      try {
        const [pRes, tRes, mRes, aRes, msgRes, adminRes, mainAdminRes] = await Promise.all([
          apiFetch('/api/parcours'),
          apiFetch('/api/teachers'),
          apiFetch('/api/modules'),
          apiFetch('/api/assignments'),
          apiFetch('/api/messages'),
          apiFetch('/api/admin/profile'),
          apiFetch('/api/admin/main')
        ]);

        if (pRes.ok) {
          try {
            setParcours(await pRes.json());
          } catch (e) {
            console.error('Error parsing parcours data:', e);
          }
        }
        if (tRes.ok) {
          try {
            setTeachers(await tRes.json());
          } catch (e) {
            console.error('Error parsing teachers data:', e);
          }
        }
        if (mRes.ok) {
          try {
            setModules(await mRes.json());
          } catch (e) {
            console.error('Error parsing modules data:', e);
          }
        }
        if (aRes.ok) {
          try {
            setAssignments(await aRes.json());
          } catch (e) {
            console.error('Error parsing assignments data:', e);
          }
        }
        if (msgRes.ok) {
          try {
            setMessages(await msgRes.json());
          } catch (e) {
            console.error('Error parsing messages data:', e);
          }
        }
        if (adminRes.ok) {
          try {
            setAdminProfile(await adminRes.json());
          } catch (e) {
            console.error('Error parsing admin profile data:', e);
          }
        }
        if (mainAdminRes.ok) {
          try {
            const responseText = await mainAdminRes.text();
            console.log('Main admin response text:', responseText);
            if (responseText.trim() === '') {
              console.log('Main admin response is empty');
              return;
            }
            const mainAdminData = JSON.parse(responseText);
            if (mainAdminData && mainAdminData.id) {
              setMainAdminId(mainAdminData.id);
            }
          } catch (e) {
            console.error('Error parsing main admin data:', e);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [session]);

  // Auth Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!username || !password) {
      setLoginError('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('sach_token', data.token);
        localStorage.setItem('sach_session', JSON.stringify(data.session));
        setSession(data.session);
      } else {
        setLoginError(selectedRole === 'ADMIN' ? t('invalid_admin') : t('invalid_faculty'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sach_token');
    localStorage.removeItem('sach_session');
    setSession(null);
    setSelectedRole(null);
    setUsername('');
    setPassword('');
    setActiveTab('dashboard');
  };

  // Calculation Logic
  const getTeacherLoad = (teacherId: string) => {
    const teacherAssignments = assignments.filter(a => a.teacherId === teacherId);
    const cm = teacherAssignments.filter(a => a.type === ModuleType.CM).reduce((acc, curr) => acc + curr.hours, 0);
    const td = teacherAssignments.filter(a => a.type === ModuleType.TD).reduce((acc, curr) => acc + curr.hours, 0);
    const tp = teacherAssignments.filter(a => a.type === ModuleType.TP).reduce((acc, curr) => acc + curr.hours, 0);
    return { cm, td, tp, total: cm + td + tp };
  };

  const globalStats = useMemo(() => {
    const totalHours = assignments.reduce((acc, curr) => acc + curr.hours, 0);
    const totalTeachers = teachers.length;
    const totalModules = modules.length;
    const totalParcours = parcours.length;
    return { totalHours, totalTeachers, totalModules, totalParcours };
  }, [assignments, teachers, modules, parcours]);

  const handleAddParcours = async (newParcours: Parcours) => {
    try {
      const res = await apiFetch('/api/parcours', {
        method: 'POST',
        body: JSON.stringify(newParcours)
      });
      if (res.ok) {
        setParcours(prev => [...prev, newParcours]);
        setIsParcoursModalOpen(false);
      } else {
        const errData = await res.json();
        alert(`Error adding parcours: ${errData.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Error adding parcours:', error);
    }
  };

  const handleAddTeacher = async (newTeacher: Teacher) => {
    try {
      const res = await apiFetch('/api/teachers', {
        method: 'POST',
        body: JSON.stringify(newTeacher)
      });
      if (res.ok) {
        setTeachers(prev => [...prev, newTeacher]);
        setIsTeacherModalOpen(false);
        setNewlyCreatedTeacher(newTeacher);
      } else {
        const errData = await res.json();
        alert(`Error adding teacher: ${errData.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const handleAddModule = async (newModule: Module) => {
    try {
      const res = await apiFetch('/api/modules', {
        method: 'POST',
        body: JSON.stringify(newModule)
      });
      if (res.ok) {
        setModules(prev => [...prev, newModule]);
        setIsModuleModalOpen(false);
      } else {
        const errData = await res.json();
        alert(`Error adding module: ${errData.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const getTeacherCurrentHours = (teacherId: string) => {
    return assignments
      .filter(a => a.teacherId === teacherId)
      .reduce((acc, curr) => acc + curr.hours, 0);
  };

  const handleCreateAssignment = async (newAssignment: Assignment) => {
    const teacherPtr = teachers.find(item => item.id === newAssignment.teacherId);
    if (!teacherPtr) return;

    const currentHours = getTeacherCurrentHours(teacherPtr.id);
    const isFull = teacherPtr.status === TeacherStatus.PERMANENT && currentHours >= teacherPtr.requiredHours;
    const isApproved = teacherPtr.approvedOvertimeModuleIds.includes(newAssignment.moduleId);

    if (isFull && !isApproved) {
      setAssignmentError(`Professor ${teacherPtr.name} has reached their required hours (${teacherPtr.requiredHours}h). You cannot assign more modules unless they accept an overtime request.`);
      setTimeout(() => setAssignmentError(null), 6000);
      return;
    }

    try {
      if (editingAssignment) {
        const res = await apiFetch(`/api/assignments/${editingAssignment.id}`, {
          method: 'PUT',
          body: JSON.stringify(newAssignment)
        });
        if (res.ok) {
          setAssignments(prev => prev.map(a => a.id === editingAssignment.id ? newAssignment : a));
          window.dispatchEvent(new CustomEvent('refresh-workload'));
        } else {
          const errData = await res.json();
          alert(`Error updating assignment: ${errData.error || 'Unknown Error'}`);
        }
      } else {
        const res = await apiFetch('/api/assignments', {
          method: 'POST',
          body: JSON.stringify(newAssignment)
        });
        if (res.ok) {
          setAssignments(prev => [...prev, newAssignment]);
          window.dispatchEvent(new CustomEvent('refresh-workload'));
        } else {
          const errData = await res.json();
          alert(`Error creating assignment: ${errData.error || 'Unknown Error'}`);
        }
      }
      setIsAssignmentModalOpen(false);
      setSelectedModuleForAssignment(null);
      setEditingAssignment(null);
    } catch (error) {
      console.error('Error creating/updating assignment:', error);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    try {
      const res = await apiFetch(`/api/assignments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAssignments(prev => prev.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleSendMessage = async (msg: Omit<Message, 'id' | 'createdAt' | 'status' | 'isRead'>) => {
    // Route to main admin if receiverId is generic 'admin'
    let finalReceiverId = msg.receiverId;
    if (finalReceiverId === 'admin' && mainAdminId) {
      finalReceiverId = mainAdminId;
    }

    const newMessage: Message = {
      ...msg,
      receiverId: finalReceiverId,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: MessageStatus.PENDING,
      isRead: false
    };
    try {
      const res = await apiFetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(newMessage)
      });
      if (res.ok) {
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUpdateMessageStatus = async (messageId: string, status: MessageStatus) => {
    try {
      const res = await apiFetch(`/api/messages/${messageId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status, isRead: true } : m));
        // Refresh everything if something was accepted
        if (status === MessageStatus.ACCEPTED) {
          const [tRes, aRes] = await Promise.all([
            apiFetch('/api/teachers'),
            apiFetch('/api/assignments')
          ]);
          if (tRes.ok) setTeachers(await tRes.json());
          if (aRes.ok) setAssignments(await aRes.json());
        }
      } else {
        const errData = await res.json();
        alert(`Error updating message: ${errData.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleUpdateAdminProfile = async (updatedProfile: any) => {
    try {
      const res = await apiFetch(`/api/admin/profile/${updatedProfile.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedProfile)
      });
      if (res.ok) {
        setAdminProfile(updatedProfile);
      } else {
        let errData;
        try {
          errData = await res.json();
        } catch {
          errData = { error: 'Server error' };
        }
        alert(`Error updating profile: ${errData.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Error updating admin profile:', error);
    }
  };

  const handleUpdateTeacherProfile = async (updatedTeacher: Teacher) => {
    try {
      const res = await apiFetch(`/api/teachers/${updatedTeacher.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTeacher)
      });
      if (res.ok) {
        setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
      } else {
        const errData = await res.json();
        alert(`Error updating profile: ${errData.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Error updating teacher profile:', error);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      const res = await apiFetch(`/api/teachers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTeachers(prev => prev.filter(item => item.id !== id));
        setAssignments(prev => prev.filter(a => a.teacherId !== id));
        setIsDeleteConfirmModalOpen(false);
        setTeacherToDelete(null);
      } else {
        const errData = await res.json();
        alert(`Error deleting teacher: ${errData.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleDeleteModule = async (id: string) => {
    try {
      const res = await apiFetch(`/api/modules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setModules(prev => prev.filter(item => item.id !== id));
        setIsDeleteConfirmModalOpen(false);
        setModuleToDelete(null);
      } else {
        const errData = await res.json();
        alert(`Error deleting module: ${errData.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const handleDeleteParcours = async (id: string) => {
    try {
      const res = await apiFetch(`/api/parcours/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setParcours(prev => prev.filter(item => item.id !== id));
        setModules(prev => prev.filter(item => item.parcoursId !== id));
        setIsDeleteConfirmModalOpen(false);
        setParcoursToDelete(null);
      } else {
        const errData = await res.json();
        alert(`Error deleting parcours: ${errData.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Error deleting parcours:', error);
    }
  };

  const handleMarkMessagesAsRead = async () => {
    if (!session) return;
    const receiverId = session.role === UserRole.ADMIN ? 'admin' : session.teacherId;
    if (!receiverId) return;

    try {
      const res = await apiFetch(`/api/messages/read-all/${receiverId}`, { method: 'PUT' });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.receiverId === receiverId ? { ...m, isRead: true } : m));
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      handleMarkMessagesAsRead();
    }
  }, [activeTab]);

  const isModuleFullyAssigned = (module: Module) => {
    const moduleAssignments = assignments.filter(a => a.moduleId === module.id);
    const assignedCM = moduleAssignments.filter(a => a.type === ModuleType.CM).reduce((acc, curr) => acc + curr.hours, 0);
    const assignedTD = moduleAssignments.filter(a => a.type === ModuleType.TD).reduce((acc, curr) => acc + curr.hours, 0);
    const assignedTP = moduleAssignments.filter(a => a.type === ModuleType.TP).reduce((acc, curr) => acc + curr.hours, 0);

    return assignedCM >= module.cmHours && 
           assignedTD >= module.tdHours && 
           assignedTP >= module.tpHours;
  };

  const handleOpenAssignmentModal = (module: Module) => {
    if (isModuleFullyAssigned(module)) {
      setAssignmentError(`Module ${module.code} is done affectation. All hours have been perfectly assigned.`);
      setTimeout(() => setAssignmentError(null), 4000);
      return;
    }
    setSelectedModuleForAssignment(module);
    setIsAssignmentModalOpen(true);
  };

  const unreadMessagesCount = useMemo(() => {
    if (!session) return 0;
    const receiverId = session.role === UserRole.ADMIN ? 'admin' : session.teacherId;
    return messages.filter(m => m.receiverId === receiverId && !m.isRead).length;
  }, [messages, session]);

  const modulesWithNoAssignmentsCount = useMemo(() => {
    return modules.filter(m => {
      const moduleAssignments = assignments.filter(a => a.moduleId === m.id);
      return moduleAssignments.length === 0;
    }).length;
  }, [modules, assignments]);

  const teacherNewAssignmentsCount = useMemo(() => {
    if (!session || session.role !== UserRole.TEACHER) return 0;
    const teacherAssignments = assignments.filter(a => a.teacherId === session.teacherId);
    const lastSeenCount = parseInt(localStorage.getItem(`lastSeenAssignments_${session.teacherId}`) || '0');
    return Math.max(0, teacherAssignments.length - lastSeenCount);
  }, [assignments, session]);

  useEffect(() => {
    if (activeTab === 'profile' && session?.role === UserRole.TEACHER) {
      const teacherAssignments = assignments.filter(a => a.teacherId === session.teacherId);
      localStorage.setItem(`lastSeenAssignments_${session.teacherId}`, teacherAssignments.length.toString());
    }
  }, [activeTab, assignments, session]);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
      ) : !session ? (
        <motion.div 
          key="login-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#050505] transition-colors duration-300 relative"
        >
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <div className="flex bg-white dark:bg-white/5 rounded-xl p-1 border border-slate-200 dark:border-white/10 shadow-sm">
              {(['en', 'fr'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    language === lang 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-xl bg-white dark:bg-white/5 text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm transition-all border border-slate-200 dark:border-white/10"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass-dark w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 flex items-center justify-center mb-4 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src="/assets/logo-sach.png" alt="S.A.C.H Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">S.A.C.H</h1>
            </div>

            <AnimatePresence mode="wait">
              {!selectedRole ? (
                <motion.div 
                  key="role-selection"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <button 
                    onClick={() => setSelectedRole(UserRole.ADMIN)}
                    className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all flex items-center justify-between group"
                  >
                    <span>Log in as Administrator</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setSelectedRole(UserRole.TEACHER)}
                    className="w-full py-4 px-6 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-white/10 transition-all flex items-center justify-between group"
                  >
                    <span>Log in as Faculty Member</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="login-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedRole === UserRole.ADMIN ? t('admin_login') : t('faculty_login')}
                    </h2>
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedRole(null);
                        setLoginError('');
                      }}
                      className="text-xs text-blue-700 dark:text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Change Role
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                        {selectedRole === UserRole.ADMIN ? t('username') : t('email_address')}
                      </label>
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={selectedRole === UserRole.ADMIN ? "e.g., admin" : "e.g., alice.martin@univ.edu"}
                        className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">{t('password_label')}</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <p className="text-red-700 dark:text-red-400 text-xs font-medium bg-red-50 dark:bg-red-400/10 p-3 rounded-lg border border-red-200 dark:border-red-400/20">
                      {loginError}
                    </p>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20 transition-all"
                  >
                    Sign In
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-center text-slate-500 text-xs mt-8">
              &copy; 2026 University Faculty Management. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-screen overflow-hidden"
        >
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col glass-dark border-r border-slate-100 dark:border-white/5 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className={`flex flex-col items-center py-5 px-3 gap-2 border-b border-slate-100 dark:border-white/5 transition-all`}>
          {/* Logo + Name stacked vertically */}
          <div className={`flex items-center justify-center transition-all duration-500 transform hover:scale-105 ${isSidebarOpen ? 'w-16 h-16' : 'w-10 h-10'}`}>
            <img src="/assets/logo-sach.png" alt="S.A.C.H Logo" className="w-full h-full object-contain" />
          </div>
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-black bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent font-display tracking-widest"
            >
              S.A.C.H
            </motion.span>
          )}

          {/* Controls row */}
          <div className="flex gap-1 mt-1">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            {isSidebarOpen && (
              <div className="flex bg-slate-100 dark:bg-white/5 rounded-lg p-0.5">
                {(['en', 'fr'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                      language === lang
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          <SidebarLink 
            icon={LayoutDashboard} 
            label={t('dashboard')} 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            collapsed={!isSidebarOpen}
          />
          {session.role === UserRole.ADMIN && (
            <>
              <SidebarLink 
                icon={Users} 
                label={t('teachers')} 
                active={activeTab === 'teachers'} 
                onClick={() => setActiveTab('teachers')}
                collapsed={!isSidebarOpen}
              />
              <SidebarLink 
                icon={BookOpen} 
                label={t('parcours_modules')} 
                active={activeTab === 'modules'} 
                onClick={() => {
                  setActiveTab('modules');
                  setSelectedParcoursId(null);
                  setSelectedSemester(null);
                  setSelectedParcoursType(null);
                  setSelectedLMDLevel(null);
                }}
                collapsed={!isSidebarOpen}
                badge={modulesWithNoAssignmentsCount > 0 ? 'error' : null}
              />
              <SidebarLink 
                icon={User} 
                label={t('my_profile')} 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')}
                collapsed={!isSidebarOpen}
              />
              <SidebarLink 
                icon={MessageSquare} 
                label={t('messages')} 
                active={activeTab === 'messages'} 
                onClick={() => setActiveTab('messages')}
                collapsed={!isSidebarOpen}
                badge={unreadMessagesCount > 0 ? unreadMessagesCount : null}
              />
            </>
          )}
          {session.role === UserRole.TEACHER && (
            <>
              <SidebarLink 
                icon={User} 
                label="My Profile" 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')}
                collapsed={!isSidebarOpen}
                badge={teacherNewAssignmentsCount > 0 ? '!' : null}
              />
              <SidebarLink 
                icon={MessageSquare} 
                label="Messages" 
                active={activeTab === 'messages'} 
                onClick={() => setActiveTab('messages')}
                collapsed={!isSidebarOpen}
                badge={unreadMessagesCount > 0 ? unreadMessagesCount : null}
              />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">{t('logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t(activeTab)}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{t('welcome_back')}, {session.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search — hidden on small screens */}
            <div className="hidden sm:flex items-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2">
              <Search size={18} className="text-slate-500 mr-2" />
              <input 
                type="text" 
                placeholder={t('search')} 
                className="bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 w-40"
              />
            </div>

            {/* Dark mode + language — visible on mobile only (md:hidden) */}
            <div className="flex items-center gap-1 md:hidden">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="flex bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-0.5">
                {(['en', 'fr'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      language === lang
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* User avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-slate-900 dark:text-white font-bold overflow-hidden">
              {session.role === UserRole.TEACHER ? (
                teachers.find(t => t.id === session.teacherId)?.profilePhoto ? (
                  <img 
                    src={teachers.find(t => t.id === session.teacherId)?.profilePhoto} 
                    alt={session.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  session.name.charAt(0)
                )
              ) : (
                adminProfile.profilePhoto ? (
                  <img 
                    src={adminProfile.profilePhoto} 
                    alt={session.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  session.name.charAt(0)
                )
              )}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {session.role === UserRole.ADMIN ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label={t('total_teachers')} value={globalStats.totalTeachers} icon={Users} colorClass="text-blue-700 dark:text-blue-400" />
                    <StatCard label={t('active_modules')} value={globalStats.totalModules} icon={BookOpen} colorClass="text-emerald-700 dark:text-emerald-400" />
                    <StatCard label={t('total_parcours')} value={globalStats.totalParcours} icon={Layers} colorClass="text-indigo-400" />
                    <StatCard label={t('total_hours')} value={`${globalStats.totalHours}h`} icon={Clock} colorClass="text-amber-700 dark:text-amber-400" />
                  </div>

                  <GlassCard>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('recent_assignments')}</h3>
                      <button className="text-sm text-blue-700 dark:text-blue-400 hover:text-blue-300 font-medium">{t('view_all')}</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-slate-500 text-sm border-bottom border-slate-100 dark:border-white/5">
                            <th className="pb-4 font-medium">{t('teacher_header')}</th>
                            <th className="pb-4 font-medium">{t('module_header')}</th>
                            <th className="pb-4 font-medium">{t('type_header')}</th>
                            <th className="pb-4 font-medium">{t('hours_header')}</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {assignments.slice(0, 5).map((a) => {
                            const teacherPtr = teachers.find(item => item.id === a.teacherId);
                            const modulePtr = modules.find(m => m.id === a.moduleId);
                            return (
                              <tr key={a.id} className="border-t border-slate-100 dark:border-white/5">
                                <td className="py-4 text-slate-900 dark:text-white font-medium">{teacherPtr?.name}</td>
                                <td className="py-4 text-slate-300">{modulePtr?.name}</td>
                                <td className="py-4">
                                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                    a.type === ModuleType.CM ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                                    a.type === ModuleType.TD ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                                    'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                  }`}>
                                    {a.type}
                                  </span>
                                </td>
                                <td className="py-4 text-slate-900 dark:text-white">{a.hours}h</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </GlassCard>
                </>
              ) : (
                <TeacherView 
                  teacherId={session.teacherId!} 
                  teachers={teachers} 
                  assignments={assignments} 
                  modules={modules} 
                  parcours={parcours}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {session.role === UserRole.TEACHER ? (
                <TeacherProfile 
                  teacherId={session.teacherId!} 
                  teachers={teachers} 
                  onUpdate={async (updatedTeacher) => {
                    await handleUpdateTeacherProfile(updatedTeacher);
                    setSession(prev => prev ? { ...prev, name: updatedTeacher.name } : null);
                  }}
                />
              ) : (
                <AdminProfile 
                  profile={adminProfile}
                  onUpdate={async (updatedProfile) => {
                    await handleUpdateAdminProfile(updatedProfile);
                    setSession(prev => prev ? { ...prev, name: updatedProfile.name } : null);
                  }}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'teachers' && session.role === UserRole.ADMIN && (
            <motion.div 
              key="teachers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('faculty_directory')}</h3>
                <button 
                  onClick={() => setIsTeacherModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
                >
                  <Plus size={18} /> {t('add_teacher')}
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teachers.map((teacher) => {
                  const load = getTeacherLoad(teacher.id);
                  const progress = teacher.status === TeacherStatus.PERMANENT 
                    ? Math.min((load.total / teacher.requiredHours) * 100, 100)
                    : 0;

                  return (
                    <GlassCard key={teacher.id} className="group hover:border-white/30 transition-all">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-blue-700 dark:text-blue-400 overflow-hidden shadow-sm">
                            {teacher.profilePhoto ? (
                              <img src={teacher.profilePhoto} alt={teacher.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <Users size={28} />
                            )}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{teacher.name}</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">{teacher.grade} • {teacher.specialty}</p>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg">
                                {teacher.prioritySessionType}
                              </span>
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg">
                                {teacher.weeklyEstimatedHours}/sem
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            teacher.status === TeacherStatus.PERMANENT ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-400'
                          }`}>
                            {teacher.status}
                          </span>
                          {session.role === UserRole.ADMIN && (
                            <>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTeacherToEdit(teacher);
                                  setIsEditTeacherModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 relative z-10"
                                title="Edit Teacher"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTeacherToDelete(teacher);
                                  setIsDeleteConfirmModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 relative z-10"
                                title="Delete Teacher"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {teacher.status === TeacherStatus.PERMANENT ? (
                        <WorkloadProgressBar teacherId={teacher.id} requiredHours={teacher.requiredHours} t={t} />
                      ) : (
                        <div className="flex gap-4">
                          <div className="flex-1 bg-white dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">Total Hours</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white">{getTeacherLoad(teacher.id).total}h</span>
                          </div>
                        </div>
                      )}
                    </GlassCard>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div 
              key="messages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('messages_notifications')}</h3>
                {session.role === UserRole.TEACHER && (
                  <button 
                    onClick={() => setIsNewMessageModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
                  >
                    <Plus size={18} /> {t('new_message_to_admin')}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {messages.filter(m => 
                  session.role === UserRole.ADMIN ? m.receiverId === 'admin' || m.senderId === 'admin' : m.receiverId === session.teacherId || m.senderId === session.teacherId
                ).length === 0 ? (
                  <GlassCard className="text-center py-12">
                    <MessageSquare size={48} className="mx-auto text-slate-600 dark:text-slate-400 mb-4 opacity-20" />
                    <p className="text-slate-500">{t('no_messages_yet')}</p>
                  </GlassCard>
                ) : (
                  messages
                    .filter(m => session.role === UserRole.ADMIN ? m.receiverId === 'admin' || m.senderId === 'admin' : m.receiverId === session.teacherId || m.senderId === session.teacherId)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((msg) => (
                      <GlassCard key={msg.id} className="border border-slate-100 dark:border-white/5">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className={`p-3 rounded-xl ${msg.senderId === 'admin' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>
                              <Mail size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                  {msg.senderId === 'admin' ? 'Administration' : teachers.find(item => item.id === msg.senderId)?.name}
                                </span>
                                <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-slate-300 mb-3">{msg.content}</p>
                              
                              {msg.moduleId && (
                                <div className="bg-white dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-white/10 mb-3">
                                  <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">Overtime Request</p>
                                  <p className="text-xs text-slate-900 dark:text-white">
                                    Module: {modules.find(m => m.id === msg.moduleId)?.name} ({msg.moduleType}) - {msg.hours}h
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center gap-3">
                                {msg.status === MessageStatus.PENDING && msg.receiverId === session.teacherId && (
                                  <>
                                    <button 
                                      onClick={() => handleUpdateMessageStatus(msg.id, MessageStatus.ACCEPTED)}
                                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                                    >
                                      Accept
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateMessageStatus(msg.id, MessageStatus.REFUSED)}
                                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all"
                                    >
                                      Refuse
                                    </button>
                                  </>
                                )}
                                {msg.receiverId === (session.role === UserRole.ADMIN ? 'admin' : session.teacherId) && (
                                  <button 
                                    onClick={() => {
                                      setReplyToMessage(msg);
                                      setIsNewMessageModalOpen(true);
                                    }}
                                    className="px-4 py-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center gap-1"
                                  >
                                    <MessageSquare size={12} /> Reply
                                  </button>
                                )}
                                {msg.status !== MessageStatus.PENDING && msg.moduleId && (
                                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    msg.status === MessageStatus.ACCEPTED ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'
                                  }`}>
                                    {msg.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'modules' && session.role === UserRole.ADMIN && (
            <motion.div 
              key="modules"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {!selectedParcoursId ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      {selectedParcoursType && (
                        <button 
                          onClick={() => {
                            if (selectedLMDLevel) setSelectedLMDLevel(null);
                            else setSelectedParcoursType(null);
                          }}
                          className="p-2 rounded-xl bg-white dark:bg-white/5 hover:bg-white dark:bg-white/5/90 text-slate-600 dark:text-slate-400 transition-all"
                        >
                          <ChevronRight size={20} className="transform rotate-180" />
                        </button>
                      )}
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {!selectedParcoursType ? t('select_system_type') : 
                         selectedParcoursType === ParcoursType.LMD && !selectedLMDLevel ? 'Select LMD Level' :
                         'Select Year'}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setIsParcoursModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
                    >
                      <Plus size={18} /> {t('add_parcours')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!selectedParcoursType ? (
                      <>
                        <GlassCard 
                          className="cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-blue-500/30"
                          onClick={() => setSelectedParcoursType(ParcoursType.LMD)}
                        >
                          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-700 dark:text-blue-400 mb-4">
                            <Layers size={24} />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('lmd_system')}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Licence, Master, Doctorat hierarchy.</p>
                          <div className="flex items-center text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                            Select <ChevronRight size={14} className="ml-1" />
                          </div>
                        </GlassCard>
                        <GlassCard 
                          className="cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-blue-500/30"
                          onClick={() => setSelectedParcoursType(ParcoursType.INGENIEUR)}
                        >
                          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                            <Briefcase size={24} />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('ing_system')}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">5-year engineering cycle.</p>
                          <div className="flex items-center text-indigo-400 text-xs font-bold uppercase tracking-wider">
                            Select <ChevronRight size={14} className="ml-1" />
                          </div>
                        </GlassCard>
                      </>
                    ) : selectedParcoursType === ParcoursType.LMD && !selectedLMDLevel ? (
                      <>
                        <GlassCard 
                          className="cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-blue-500/30"
                          onClick={() => setSelectedLMDLevel(LMDLevel.LICENCE)}
                        >
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-4">
                            <GraduationCap size={24} />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Licence</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">3-year undergraduate program.</p>
                          <div className="flex items-center text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            Select <ChevronRight size={14} className="ml-1" />
                          </div>
                        </GlassCard>
                        <GlassCard 
                          className="cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-blue-500/30"
                          onClick={() => setSelectedLMDLevel(LMDLevel.MASTER)}
                        >
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-4">
                            <GraduationCap size={24} />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Master</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">2-year graduate program.</p>
                          <div className="flex items-center text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                            Select <ChevronRight size={14} className="ml-1" />
                          </div>
                        </GlassCard>
                      </>
                    ) : (
                      parcours
                        .filter(p => p.type === selectedParcoursType && (selectedParcoursType === ParcoursType.INGENIEUR || p.level === selectedLMDLevel))
                        .map((p) => (
                          <GlassCard 
                            key={p.id} 
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-blue-500/30 group"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1" onClick={() => setSelectedParcoursId(p.id)}>
                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-700 dark:text-blue-400 mb-4">
                                  <Clock size={24} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{p.name}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{p.description}</p>
                                <div className="flex items-center text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                  Select Year <ChevronRight size={14} className="ml-1" />
                                </div>
                              </div>
                              {session.role === UserRole.ADMIN && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setParcoursToDelete(p);
                                    setIsDeleteConfirmModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 relative z-10"
                                  title="Delete Parcours"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </GlassCard>
                        ))
                    )}
                  </div>
                </>
              ) : !selectedSemester ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedParcoursId(null)}
                        className="p-2 rounded-xl bg-white dark:bg-white/5 hover:bg-white dark:bg-white/5/90 text-slate-600 dark:text-slate-400 transition-all"
                      >
                        <ChevronRight size={20} className="transform rotate-180" />
                      </button>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {parcours.find(p => p.id === selectedParcoursId)?.name}
                        </h3>
                        <p className="text-xs text-slate-500">Select Semester</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <GlassCard 
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-blue-500/30"
                      onClick={() => setSelectedSemester(1)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-700 dark:text-blue-400 mb-4">
                        <Clock size={24} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Semester 1</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">View modules for the first semester.</p>
                      <div className="flex items-center text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                        Select <ChevronRight size={14} className="ml-1" />
                      </div>
                    </GlassCard>
                    
                    {!(parcours.find(p => p.id === selectedParcoursId)?.type === ParcoursType.LMD && 
                       parcours.find(p => p.id === selectedParcoursId)?.level === LMDLevel.MASTER && 
                       parcours.find(p => p.id === selectedParcoursId)?.year === 2) && (
                      <GlassCard 
                        className="cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-blue-500/30"
                        onClick={() => setSelectedSemester(2)}
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-4">
                          <Clock size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Semester 2</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">View modules for the second semester.</p>
                        <div className="flex items-center text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          Select <ChevronRight size={14} className="ml-1" />
                        </div>
                      </GlassCard>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedSemester(null)}
                        className="p-2 rounded-xl bg-white dark:bg-white/5 hover:bg-white dark:bg-white/5/90 text-slate-600 dark:text-slate-400 transition-all"
                      >
                        <ChevronRight size={20} className="transform rotate-180" />
                      </button>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {parcours.find(p => p.id === selectedParcoursId)?.name} - Semester {selectedSemester}
                        </h3>
                        <p className="text-xs text-slate-500">Modules & Assignments</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsModuleModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
                    >
                      <Plus size={18} /> Add Module
                    </button>
                  </div>

                  <AnimatePresence>
                    {assignmentError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 mb-6"
                      >
                        <AlertCircle size={18} />
                        <span className="text-sm font-medium">{assignmentError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.filter(m => m.parcoursId === selectedParcoursId && m.semester === selectedSemester).map((module) => (
                      <GlassCard key={module.id} className="flex flex-col justify-between group">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-400/10 px-2 py-1 rounded uppercase tracking-wider">
                              {module.code}
                            </span>
                            <span className="text-xs text-slate-500">Semester {module.semester}</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{module.name}</h4>
                          <div className="flex gap-2 mt-3">
                            {module.cmHours > 0 && (
                              <span className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">CM: {module.cmHours}h</span>
                            )}
                            {module.tdHours > 0 && (
                              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">TD: {module.tdHours}h</span>
                            )}
                            {module.tpHours > 0 && (
                              <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">TP: {module.tpHours}h</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {assignments.filter(a => a.moduleId === module.id).map((item, i) => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A192F] bg-slate-700 flex items-center justify-center text-[10px] text-slate-900 dark:text-white font-bold">
                                {teachers.find(ptr => ptr.id === item.teacherId)?.name.charAt(0)}
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedModuleForAssignment(module);
                                setIsManageAssignmentsModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-all flex items-center gap-2 text-xs"
                              title={t('manage_assignments')}
                            >
                              <Briefcase size={16} />
                            </button>
                            <button 
                              onClick={() => handleOpenAssignmentModal(module)}
                              className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs ${
                                isModuleFullyAssigned(module)
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 cursor-not-allowed border border-emerald-200 dark:border-emerald-500/20'
                                  : 'bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {isModuleFullyAssigned(module) ? (
                                <>
                                  <Check size={16} /> Completed
                                </>
                              ) : (
                                <>
                                  <Plus size={16} /> Assign
                                </>
                              )}
                            </button>
                            {session.role === UserRole.ADMIN && (
                              <button 
                                onClick={() => {
                                  setModuleToDelete(module);
                                  setIsDeleteConfirmModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 dark:text-red-400 transition-all flex items-center gap-2 text-xs opacity-0 group-hover:opacity-100"
                                title="Delete Module"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* New Message Modal */}
      <AnimatePresence>
        {isNewMessageModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsNewMessageModalOpen(false);
                setReplyToMessage(null);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-dark rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {replyToMessage ? 'Reply to Message' : 'Message Administration'}
                </h3>
                <button 
                  onClick={() => {
                    setIsNewMessageModalOpen(false);
                    setReplyToMessage(null);
                  }}
                  className="p-2 rounded-xl hover:bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              {replyToMessage && (
                <div className="mb-6 p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Replying to:</p>
                  <p className="text-sm text-slate-300 italic">"{replyToMessage.content}"</p>
                </div>
              )}
              <form onSubmit={(e) => {
                e.preventDefault();
                const content = (e.target as any).content.value;
                handleSendMessage({
                  senderId: session?.role === UserRole.ADMIN ? 'admin' : session?.teacherId!,
                  receiverId: replyToMessage ? replyToMessage.senderId : 'admin',
                  content: replyToMessage ? `Re: ${content}` : content
                });
                setIsNewMessageModalOpen(false);
                setReplyToMessage(null);
              }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Message Content</label>
                  <textarea 
                    name="content"
                    required
                    placeholder={replyToMessage ? "Type your reply..." : "Type your message to the administration..."}
                    rows={4}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsNewMessageModalOpen(false);
                      setReplyToMessage(null);
                    }}
                    className="flex-1 py-4 px-6 rounded-xl bg-white dark:bg-white/5 hover:bg-white dark:bg-white/5/90 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20 transition-all"
                  >
                    {replyToMessage ? 'Send Reply' : 'Send Message'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmModalOpen && (teacherToDelete || moduleToDelete || parcoursToDelete) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsDeleteConfirmModalOpen(false);
                setTeacherToDelete(null);
                setModuleToDelete(null);
                setParcoursToDelete(null);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-dark rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Confirm Deletion</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Are you sure you want to delete <span className="text-slate-900 dark:text-white font-bold">
                  {teacherToDelete ? teacherToDelete.name : moduleToDelete?.name || parcoursToDelete?.name}
                </span>? 
                This action is permanent and will remove all associated assignments.
                {parcoursToDelete && " All modules in this parcours will also be deleted."}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setIsDeleteConfirmModalOpen(false);
                    setTeacherToDelete(null);
                    setModuleToDelete(null);
                    setParcoursToDelete(null);
                  }}
                  className="flex-1 py-4 px-6 rounded-xl bg-white dark:bg-white/5 hover:bg-white dark:bg-white/5/90 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (teacherToDelete) {
                      handleDeleteTeacher(teacherToDelete.id);
                    } else if (moduleToDelete) {
                      handleDeleteModule(moduleToDelete.id);
                    } else if (parcoursToDelete) {
                      handleDeleteParcours(parcoursToDelete.id);
                    }
                    setIsDeleteConfirmModalOpen(false);
                    setTeacherToDelete(null);
                    setModuleToDelete(null);
                    setParcoursToDelete(null);
                  }}
                  className="flex-1 py-4 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/20 transition-all"
                >
                  {teacherToDelete ? 'Delete Teacher' : moduleToDelete ? 'Delete Module' : 'Delete Parcours'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Parcours Modal */}
      <AnimatePresence>
        {isParcoursModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsParcoursModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-dark rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Add New Parcours</h3>
                <button 
                  onClick={() => setIsParcoursModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <ParcoursForm onSubmit={handleAddParcours} onCancel={() => setIsParcoursModalOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Teacher Modal */}
      <AnimatePresence>
        {isTeacherModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTeacherModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-dark rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Add New Teacher</h3>
                <button 
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <TeacherForm onSubmit={handleAddTeacher} onCancel={() => setIsTeacherModalOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Teacher Modal */}
      <AnimatePresence>
        {isEditTeacherModalOpen && teacherToEdit && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditTeacherModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10"
            >
              <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-white/10 p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Modifier l'Enseignant</h3>
                  <button 
                    onClick={() => setIsEditTeacherModalOpen(false)}
                    className="p-2 rounded-xl hover:bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
                <EditTeacherModal 
                  teacher={teacherToEdit} 
                  onUpdate={async (updatedTeacher) => {
                    await handleUpdateTeacherProfile(updatedTeacher);
                    setIsEditTeacherModalOpen(false);
                    setTeacherToEdit(null);
                  }} 
                  onCancel={() => {
                    setIsEditTeacherModalOpen(false);
                    setTeacherToEdit(null);
                  }} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Teacher Credentials Modal */}
      <AnimatePresence>
        {newlyCreatedTeacher && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewlyCreatedTeacher(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-white/5 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Teacher Added!</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">Please provide these credentials to the teacher so they can access their account.</p>
              
              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-left space-y-4 mb-8">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Login Email</p>
                  <p className="text-slate-900 dark:text-white font-mono">{newlyCreatedTeacher.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Password</p>
                  <p className="text-slate-900 dark:text-white font-mono">{newlyCreatedTeacher.password}</p>
                </div>
              </div>

              <button 
                onClick={() => setNewlyCreatedTeacher(null)}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Module Modal */}
      <AnimatePresence>
        {isModuleModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModuleModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-dark rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Add New Module</h3>
                <button 
                  onClick={() => setIsModuleModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <ModuleForm 
                onSubmit={handleAddModule} 
                onCancel={() => setIsModuleModalOpen(false)} 
                parcours={parcours} 
                defaultParcoursId={selectedParcoursId}
                defaultSemester={selectedSemester}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Assignment Modal */}
      <AnimatePresence>
        {isAssignmentModalOpen && selectedModuleForAssignment && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAssignmentModalOpen(false);
                setSelectedModuleForAssignment(null);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-dark rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Assign Module</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedModuleForAssignment.name} ({selectedModuleForAssignment.code})</p>
                </div>
                <button 
                  onClick={() => {
                    setIsAssignmentModalOpen(false);
                    setSelectedModuleForAssignment(null);
                  }}
                  className="p-2 rounded-xl hover:bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <AssignmentForm 
                module={selectedModuleForAssignment} 
                teachers={teachers} 
                onSubmit={handleCreateAssignment} 
                initialData={editingAssignment}
                getTeacherCurrentHours={getTeacherCurrentHours}
                onSendMessage={handleSendMessage}
                onCancel={() => {
                  setIsAssignmentModalOpen(false);
                  setSelectedModuleForAssignment(null);
                  setEditingAssignment(null);
                }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Assignments Modal */}
      <AnimatePresence>
        {isManageAssignmentsModalOpen && selectedModuleForAssignment && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsManageAssignmentsModalOpen(false);
                setSelectedModuleForAssignment(null);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-dark rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Manage Assignments</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedModuleForAssignment.name} ({selectedModuleForAssignment.code})</p>
                </div>
                <button 
                  onClick={() => {
                    setIsManageAssignmentsModalOpen(false);
                    setSelectedModuleForAssignment(null);
                  }}
                  className="p-2 rounded-xl hover:bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <ManageAssignmentsModal 
                module={selectedModuleForAssignment}
                teachers={teachers}
                assignments={assignments}
                onEdit={(assignment) => {
                  setEditingAssignment(assignment);
                  setIsManageAssignmentsModalOpen(false);
                  setIsAssignmentModalOpen(true);
                }}
                onDelete={handleDeleteAssignment}
                onCancel={() => {
                  setIsManageAssignmentsModalOpen(false);
                  setSelectedModuleForAssignment(null);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-slate-200 dark:border-white/10 px-6 py-3 flex justify-between items-center z-50">
        <MobileNavLink icon={LayoutDashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        {session.role === UserRole.ADMIN ? (
          <>
            <MobileNavLink icon={Users} active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
            <MobileNavLink 
              icon={BookOpen} 
              active={activeTab === 'modules'} 
              onClick={() => {
                setActiveTab('modules');
                setSelectedParcoursId(null);
                setSelectedSemester(null);
                setSelectedParcoursType(null);
                setSelectedLMDLevel(null);
              }} 
              badge={modulesWithNoAssignmentsCount > 0 ? 'error' : null}
            />
            <MobileNavLink icon={User} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <MobileNavLink 
              icon={MessageSquare} 
              active={activeTab === 'messages'} 
              onClick={() => setActiveTab('messages')} 
              badge={unreadMessagesCount > 0 ? unreadMessagesCount : null}
            />
          </>
        ) : (
          <>
            <MobileNavLink 
              icon={User} 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
              badge={teacherNewAssignmentsCount > 0 ? '!' : null}
            />
            <MobileNavLink 
              icon={MessageSquare} 
              active={activeTab === 'messages'} 
              onClick={() => setActiveTab('messages')} 
              badge={unreadMessagesCount > 0 ? unreadMessagesCount : null}
            />
          </>
        )}
        <MobileNavLink icon={LogOut} active={false} onClick={handleLogout} />
      </nav>
    </motion.div>
  )}
</AnimatePresence>
);
}

// --- Sub-components ---

function SidebarLink({ icon: Icon, label, active, onClick, collapsed, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative ${
        active 
          ? 'bg-blue-600 text-slate-900 dark:text-white shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
      }`}
    >
      <div className="relative">
        <Icon size={20} className={active ? 'text-slate-900 dark:text-white' : 'group-hover:text-blue-700 dark:text-blue-400 transition-colors'} />
        {collapsed && badge && (
          <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${badge === 'error' ? 'bg-red-500' : 'bg-red-600'}`} />
        )}
      </div>
      {!collapsed && <span className="font-medium flex-1 text-left">{label}</span>}
      {!collapsed && badge && (
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          badge === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-red-600 text-white'
        }`}>
          {badge === 'error' ? <AlertCircle size={10} /> : badge}
        </div>
      )}
    </button>
  );
}

function MobileNavLink({ icon: Icon, active, onClick, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-xl transition-all relative ${active ? 'text-blue-700 dark:text-blue-400 bg-blue-400/10' : 'text-slate-500'}`}
    >
      <Icon size={24} />
      {badge && (
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border border-slate-900 ${
          badge === 'error' ? 'bg-red-500' : 'bg-red-600 text-white'
        }`}>
          {badge === 'error' ? '!' : badge}
        </div>
      )}
    </button>
  );
}

function AssignmentForm({ module, teachers, onSubmit, onCancel, initialData, getTeacherCurrentHours, onSendMessage }: { module: Module, teachers: Teacher[], onSubmit: (a: Assignment) => void, onCancel: () => void, initialData?: Assignment | null, getTeacherCurrentHours: (id: string) => number, onSendMessage: (msg: any) => void }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    teacherId: initialData?.teacherId || teachers[0]?.id || '',
    type: initialData?.type || ModuleType.CM,
    hours: initialData?.hours || module.cmHours
  });

  const selectedTeacher = teachers.find(item => item.id === formData.teacherId);
  const currentHours = selectedTeacher ? getTeacherCurrentHours(selectedTeacher.id) : 0;
  const isFull = selectedTeacher?.status === TeacherStatus.PERMANENT && currentHours >= selectedTeacher.requiredHours;
  const isApproved = selectedTeacher?.approvedOvertimeModuleIds.includes(module.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssignment: Assignment = {
      id: initialData?.id || `a-${Date.now()}`,
      moduleId: module.id,
      ...formData
    };
    onSubmit(newAssignment);
  };

  const handleRequestOvertime = () => {
    if (!selectedTeacher) return;
    onSendMessage({
      senderId: 'admin',
      receiverId: selectedTeacher.id,
      content: `Hello ${selectedTeacher.name}, we would like to assign you the module "${module.name}" (${formData.type}) for ${formData.hours}h. We noticed you have reached your required hours. Would you be willing to take this as overtime?`,
      moduleId: module.id,
      moduleType: formData.type,
      hours: formData.hours
    });
    alert(`Overtime request sent to ${selectedTeacher.name}.`);
  };

  const handleTypeChange = (type: ModuleType) => {
    let hours = 0;
    if (type === ModuleType.CM) hours = module.cmHours;
    if (type === ModuleType.TD) hours = module.tdHours;
    if (type === ModuleType.TP) hours = module.tpHours;
    setFormData(prev => ({ ...prev, type, hours }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Select Teacher</label>
        <select 
          required
          value={formData.teacherId}
          onChange={e => setFormData(prev => ({ ...prev, teacherId: e.target.value }))}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[3rem] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
        >
          {teachers.map(item => (
            <option key={item.id} value={item.id} className="bg-white dark:bg-white/5">{item.name} ({item.grade})</option>
          ))}
        </select>
        {selectedTeacher && (
          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
              Current Load: <span className={isFull ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}>{currentHours}h</span> 
              {selectedTeacher.status === TeacherStatus.PERMANENT && ` / ${selectedTeacher.requiredHours}h`}
            </p>
            {isFull && !isApproved && (
              <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle size={10} /> Full Capacity
              </span>
            )}
            {isApproved && (
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Check size={10} /> Overtime Approved
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Assignment Type</label>
        <div className="grid grid-cols-3 gap-3">
          {[ModuleType.CM, ModuleType.TD, ModuleType.TP].map((type) => {
            const isAvailable = (type === ModuleType.CM && module.cmHours > 0) || 
                               (type === ModuleType.TD && module.tdHours > 0) || 
                               (type === ModuleType.TP && module.tpHours > 0);
            return (
              <button
                key={type}
                type="button"
                disabled={!isAvailable}
                onClick={() => handleTypeChange(type)}
                className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                  formData.type === type 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20' 
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                } ${!isAvailable && 'opacity-30 cursor-not-allowed'}`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Hours to Assign</label>
        <input 
          required
          type="number" 
          value={formData.hours}
          onChange={e => setFormData(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 px-6 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10 transition-all"
        >
          Cancel
        </button>
        {isFull && !isApproved ? (
          <button 
            type="button"
            onClick={handleRequestOvertime}
            className="flex-1 py-4 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Request Overtime
          </button>
        ) : (
          <button 
            type="submit"
            className="flex-1 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20 transition-all"
          >
            Confirm Assignment
          </button>
        )}
      </div>
    </form>
  );
}

function ManageAssignmentsModal({ module, teachers, assignments, onEdit, onDelete, onCancel }: { module: Module, teachers: Teacher[], assignments: Assignment[], onEdit: (a: Assignment) => void, onDelete: (id: string) => void, onCancel: () => void }) {
  const { t } = useTranslation();
  const moduleAssignments = assignments.filter(a => a.moduleId === module.id);

  return (
    <div className="space-y-6">
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {moduleAssignments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No assignments yet for this module.
          </div>
        ) : (
          moduleAssignments.map((assignment) => {
            const teacherPtr = teachers.find(ptr => ptr.id === assignment.teacherId);
            return (
              <div key={assignment.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold">
                    {teacherPtr?.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-sm">{teacherPtr?.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                        assignment.type === ModuleType.CM ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                        assignment.type === ModuleType.TD ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                        'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                      }`}>
                        {assignment.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{assignment.hours} Hours</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => onEdit(assignment)}
                    className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 transition-all"
                    title="Edit Assignment"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(assignment.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 transition-all"
                    title="Delete Assignment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <button 
        onClick={onCancel}
        className="w-full py-4 px-6 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10 transition-all"
      >
        Close
      </button>
    </div>
  );
}

// Helper function to calculate yearly hours based on Algerian teaching system
const calculateYearlyHours = (weeklyHours: string, sessionType: ModuleType): number => {
  // Algerian university system: ~16 weeks per semester, 2 semesters = 32 weeks per year
  const teachingWeeksPerYear = 32;
  
  // Extract average weekly hours from range (e.g., "8h à 10h" -> 9)
  const hoursMatch = weeklyHours.match(/(\d+)h/);
  const avgWeeklyHours = hoursMatch ? parseInt(hoursMatch[1]) : 8;
  
  // Apply session type multiplier for Algerian system
  // CM: 1.0x (full weight), TD: 0.75x, TP: 0.5x
  const sessionMultiplier = {
    [ModuleType.CM]: 1.0,
    [ModuleType.TD]: 0.75,
    [ModuleType.TP]: 0.5
  }[sessionType] || 0.75;
  
  return Math.round(avgWeeklyHours * teachingWeeksPerYear * sessionMultiplier);
};

// Helper function to get grade requirements (Algerian university system)
const getGradeRequirements = (grade: TeacherGrade) => {
  switch (grade) {
    case TeacherGrade.PROFESSEUR:
      return { 
        requiresPhd: true, 
        requiresHabilitation: true, 
        minHours: 192,
        prioritySessionType: ModuleType.CM,
        weeklyHours: "6h à 9h"
      };
    case TeacherGrade.MAITRE_DE_CONFERENCES_A:
      return { 
        requiresPhd: true, 
        requiresHabilitation: true, 
        minHours: 192,
        prioritySessionType: ModuleType.CM,
        weeklyHours: "8h à 10h"
      };
    case TeacherGrade.MAITRE_DE_CONFERENCES_B:
      return { 
        requiresPhd: true, 
        requiresHabilitation: false, 
        minHours: 192,
        prioritySessionType: ModuleType.TD,
        weeklyHours: "8h à 10h"
      };
    case TeacherGrade.MAITRE_ASSISTANT_A:
      return { 
        requiresPhd: true, 
        requiresHabilitation: false, 
        minHours: 192,
        prioritySessionType: ModuleType.TD,
        weeklyHours: "12h à 15h"
      };
    case TeacherGrade.MAITRE_ASSISTANT_B:
      return { 
        requiresPhd: false, 
        requiresHabilitation: false, 
        minHours: 192,
        prioritySessionType: ModuleType.TP,
        weeklyHours: "12h à 15h"
      };
    default:
      return { 
        requiresPhd: false, 
        requiresHabilitation: false, 
        minHours: 192,
        prioritySessionType: ModuleType.TD,
        weeklyHours: "8h à 10h"
      };
  }
};

function TeacherForm({ onSubmit, onCancel }: { onSubmit: (t: Teacher) => void, onCancel: () => void }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'teacher', // Default password
    grade: TeacherGrade.MAITRE_ASSISTANT_B,
    specialty: '',
    status: TeacherStatus.PERMANENT,
    requiredHours: 192,
    prioritySessionType: ModuleType.TP,
    weeklyEstimatedHours: '12h à 15h'
  });

  const gradeRequirements = getGradeRequirements(formData.grade);

  // Auto-update Algerian system fields when grade changes
  const handleGradeChange = (grade: TeacherGrade) => {
    const requirements = getGradeRequirements(grade);
    const calculatedYearlyHours = calculateYearlyHours(requirements.weeklyHours, requirements.prioritySessionType);
    setFormData(prev => ({
      ...prev,
      grade,
      requiredHours: calculatedYearlyHours,
      prioritySessionType: requirements.prioritySessionType,
      weeklyEstimatedHours: requirements.weeklyHours
    }));
  };

  // Update yearly hours when session type or weekly hours change
  const updateYearlyHours = () => {
    const calculatedHours = calculateYearlyHours(formData.weeklyEstimatedHours, formData.prioritySessionType);
    setFormData(prev => ({ ...prev, requiredHours: calculatedHours }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate grade requirements
    if (gradeRequirements.requiresPhd && !formData.specialty.toLowerCase().includes('phd') && !formData.specialty.toLowerCase().includes('doctorat')) {
      alert('Ce grade nécessite un PhD/Doctorat. Veuillez l\'indiquer dans la spécialité.');
      return;
    }
    
    const newTeacher: Teacher = {
      id: `t-${Date.now()}`,
      approvedOvertimeModuleIds: [],
      ...formData
    };
    onSubmit(newTeacher);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information Section */}
      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Informations Personnelles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nom Complet</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Dr. John Doe"
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Adresse Email</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john.doe@univ.edu"
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mot de Passe</label>
            <input 
              required
              type="text" 
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Définir un mot de passe"
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Spécialité</label>
            <input 
              required
              type="text" 
              value={formData.specialty}
              onChange={e => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
              placeholder="ex: IA & Data Science"
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Academic Information Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-4 uppercase tracking-wider">Informations Académiques</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 min-w-0">
            <div className="relative overflow-hidden">
              <select 
                value={formData.grade}
                onChange={e => handleGradeChange(e.target.value as TeacherGrade)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-2 pt-6 pb-4 min-h-[4.5rem] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
              >
                <option value={TeacherGrade.PROFESSEUR} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  Professeur
                </option>
                <option value={TeacherGrade.MAITRE_DE_CONFERENCES_A} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  Maître de Conférences A
                </option>
                <option value={TeacherGrade.MAITRE_DE_CONFERENCES_B} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  Maître de Conférences B
                </option>
                <option value={TeacherGrade.MAITRE_ASSISTANT_A} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  Maître-Assistant A
                </option>
                <option value={TeacherGrade.MAITRE_ASSISTANT_B} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  Maître-Assistant B
                </option>
              </select>
              <label className="absolute top-2 left-4 text-xs font-bold text-slate-500 uppercase pointer-events-none">
                GRADE
              </label>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 p-2 bg-white/70 dark:bg-slate-700/50 rounded-lg">
              <span className="font-semibold">Exigences:</span> 
              {gradeRequirements.requiresPhd && <span className="ml-1">• PhD/Doctorat requis</span>}
              {gradeRequirements.requiresHabilitation && <span className="ml-1">• Habilitation requise</span>}
              {!gradeRequirements.requiresPhd && !gradeRequirements.requiresHabilitation && <span className="ml-1">• Magister accepté</span>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Statut</label>
            <select 
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as TeacherStatus }))}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value={TeacherStatus.PERMANENT} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Permanent</option>
              <option value={TeacherStatus.VACATAIRE} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Vacataire</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teaching Load Section */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
        <h3 className="text-sm font-bold text-green-700 dark:text-green-300 mb-4 uppercase tracking-wider">Charge d'Enseignement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Type de séance prioritaire</label>
            <select 
              value={formData.prioritySessionType}
              onChange={e => {
                setFormData(prev => ({ ...prev, prioritySessionType: e.target.value as ModuleType }));
                updateYearlyHours();
              }}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value={ModuleType.CM} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Cours (CM)</option>
              <option value={ModuleType.TD} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Travaux Dirigés (TD)</option>
              <option value={ModuleType.TP} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Travaux Pratiques (TP)</option>
            </select>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              <span className="font-semibold">Note:</span> Défini automatiquement selon le grade
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Heures réelles / semaine (estimatif)</label>
            <input 
              type="text" 
              value={formData.weeklyEstimatedHours}
              onChange={e => {
                setFormData(prev => ({ ...prev, weeklyEstimatedHours: e.target.value }));
                updateYearlyHours();
              }}
              placeholder="ex: 8h à 10h"
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              <span className="font-semibold">Note:</span> Défini automatiquement selon le grade
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Heures Requises (Annuelles)</label>
            <div className="relative">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                Calculé automatiquement
              </div>
              <input 
                type="number" 
                disabled={formData.status === TeacherStatus.VACATAIRE}
                value={formData.requiredHours}
                onChange={e => setFormData(prev => ({ ...prev, requiredHours: parseInt(e.target.value) || 0 }))}
                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
              />
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Basé sur: {formData.weeklyEstimatedHours} × 32 semaines × {formData.prioritySessionType === ModuleType.CM ? '1.0' : formData.prioritySessionType === ModuleType.TD ? '0.75' : '0.5'} = {formData.requiredHours}h/an
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Référence Système Algérien</label>
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold">Semaines d'enseignement:</span>
                  <span>32 semaines/an</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Multiplicateur CM:</span>
                  <span>1.0x</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Multiplicateur TD:</span>
                  <span>0.75x</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Multiplicateur TP:</span>
                  <span>0.5x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 px-6 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10 transition-all"
        >
          Annuler
        </button>
        <button 
          type="submit"
          className="flex-1 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20 transition-all"
        >
          Enregistrer l'Enseignant
        </button>
      </div>
    </form>
  );
}

function EditTeacherModal({ teacher, onUpdate, onCancel }: { teacher: Teacher, onUpdate: (teacher: Teacher) => void, onCancel: () => void }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: teacher.name,
    email: teacher.email,
    grade: teacher.grade,
    specialty: teacher.specialty,
    status: teacher.status,
    requiredHours: teacher.requiredHours,
    prioritySessionType: teacher.prioritySessionType,
    weeklyEstimatedHours: teacher.weeklyEstimatedHours
  });

  const gradeRequirements = getGradeRequirements(formData.grade);

  // Auto-update Algerian system fields when grade changes
  const handleGradeChange = (grade: TeacherGrade) => {
    const requirements = getGradeRequirements(grade);
    const calculatedYearlyHours = calculateYearlyHours(requirements.weeklyHours, requirements.prioritySessionType);
    setFormData(prev => ({
      ...prev,
      grade,
      requiredHours: calculatedYearlyHours,
      prioritySessionType: requirements.prioritySessionType,
      weeklyEstimatedHours: requirements.weeklyHours
    }));
  };

  // Update yearly hours when session type or weekly hours change
  const updateYearlyHours = () => {
    const calculatedHours = calculateYearlyHours(formData.weeklyEstimatedHours, formData.prioritySessionType);
    setFormData(prev => ({ ...prev, requiredHours: calculatedHours }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate grade requirements
    if (gradeRequirements.requiresPhd && !formData.specialty.toLowerCase().includes('phd') && !formData.specialty.toLowerCase().includes('doctorat')) {
      alert('Ce grade nécessite un PhD/Doctorat. Veuillez l\'indiquer dans la spécialité.');
      return;
    }
    
    const updatedTeacher: Teacher = {
      ...teacher,
      ...formData
    };
    onUpdate(updatedTeacher);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nom Complet</label>
        <input 
          required
          type="text" 
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
        <input 
          required
          type="email" 
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {/* Academic Information Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-4 uppercase tracking-wider">Informations Académiques</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 min-w-0">
            <div className="relative overflow-hidden">
              <select 
                value={formData.grade}
                onChange={e => handleGradeChange(e.target.value as TeacherGrade)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-2 pt-6 pb-4 min-h-[4.5rem] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
              >
                <option value={TeacherGrade.PROFESSEUR} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  Professeur
                </option>
                <option value={TeacherGrade.MAITRE_DE_CONFERENCES_A} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  Maître de Conférences A
                </option>
                <option value={TeacherGrade.MAITRE_DE_CONFERENCES_B} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  Maître de Conférences B
                </option>
                <option value={TeacherGrade.MAITRE_ASSISTANT_A} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  Maître-Assistant A
                </option>
                <option value={TeacherGrade.MAITRE_ASSISTANT_B} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  Maître-Assistant B
                </option>
              </select>
              <label className="absolute top-2 left-4 text-xs font-bold text-slate-500 uppercase pointer-events-none">
                GRADE
              </label>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 p-2 bg-white/70 dark:bg-slate-700/50 rounded-lg">
              <span className="font-semibold">Exigences:</span> 
              {gradeRequirements.requiresPhd && <span className="ml-1">• PhD/Doctorat requis</span>}
              {gradeRequirements.requiresHabilitation && <span className="ml-1">• Habilitation requise</span>}
              {!gradeRequirements.requiresPhd && !gradeRequirements.requiresHabilitation && <span className="ml-1">• Magister accepté</span>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Statut</label>
            <select 
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as TeacherStatus }))}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value={TeacherStatus.PERMANENT} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Permanent</option>
              <option value={TeacherStatus.VACATAIRE} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Vacataire</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Spécialité</label>
            <input 
              required
              type="text" 
              value={formData.specialty}
              onChange={e => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Type de Session Prioritaire</label>
            <select 
              value={formData.prioritySessionType}
              onChange={e => {
                setFormData(prev => ({ ...prev, prioritySessionType: e.target.value as ModuleType }));
                updateYearlyHours();
              }}
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value={ModuleType.CM} className="bg-white dark:bg-white/5">Cours Magistraux (CM)</option>
              <option value={ModuleType.TD} className="bg-white dark:bg-white/5">Travaux Dirigés (TD)</option>
              <option value={ModuleType.TP} className="bg-white dark:bg-white/5">Travaux Pratiques (TP)</option>
            </select>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              <span className="font-semibold">Note:</span> Défini automatiquement selon le grade
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Heures réelles / semaine (estimatif)</label>
            <input 
              type="text" 
              value={formData.weeklyEstimatedHours}
              onChange={e => {
                setFormData(prev => ({ ...prev, weeklyEstimatedHours: e.target.value }));
                updateYearlyHours();
              }}
              placeholder="ex: 8h à 10h"
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              <span className="font-semibold">Note:</span> Défini automatiquement selon le grade
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Heures Requises (Annuelles)</label>
            <div className="relative">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                Calculé automatiquement
              </div>
              <input 
                type="number" 
                disabled={formData.status === TeacherStatus.VACATAIRE}
                value={formData.requiredHours}
                onChange={e => setFormData(prev => ({ ...prev, requiredHours: parseInt(e.target.value) || 0 }))}
                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
              />
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Basé sur: {formData.weeklyEstimatedHours} × 32 semaines × {formData.prioritySessionType === ModuleType.CM ? '1.0' : formData.prioritySessionType === ModuleType.TD ? '0.75' : '0.5'} = {formData.requiredHours}h/an
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <button 
          type="button"
          onClick={onCancel}
          className="py-4 px-6 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
        >
          Annuler
        </button>
        <button 
          type="submit"
          className="flex-1 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20 transition-all"
        >
          Mettre à jour l'Enseignant
        </button>
      </div>
    </form>
  );
}

function ModuleForm({ onSubmit, onCancel, parcours, defaultParcoursId, defaultSemester }: { onSubmit: (m: Module) => void, onCancel: () => void, parcours: Parcours[], defaultParcoursId?: string | null, defaultSemester?: number | null }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    semester: defaultSemester || 1,
    cmHours: 0,
    tdHours: 0,
    tpHours: 0,
    parcoursId: defaultParcoursId || parcours[0]?.id || ''
  });

  const selectedParcours = parcours.find(p => p.id === formData.parcoursId);
  const isMaster2 = selectedParcours?.type === ParcoursType.LMD && 
                    selectedParcours?.level === LMDLevel.MASTER && 
                    selectedParcours?.year === 2;

  useEffect(() => {
    if (isMaster2 && formData.semester === 2) {
      setFormData(prev => ({ ...prev, semester: 1 }));
    }
  }, [isMaster2, formData.semester]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newModule: Module = {
      id: `m-${Date.now()}`,
      ...formData
    };
    onSubmit(newModule);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Select Parcours</label>
        <select 
          required
          value={formData.parcoursId}
          onChange={e => setFormData(prev => ({ ...prev, parcoursId: e.target.value }))}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
        >
          {parcours.map(p => (
            <option key={p.id} value={p.id} className="bg-white dark:bg-white/5">{p.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Module Code</label>
          <input 
            required
            type="text" 
            value={formData.code}
            onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
            placeholder="e.g. CS101"
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Semester</label>
          <select 
            value={formData.semester}
            onChange={e => setFormData(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
          >
            <option value={1} className="bg-white dark:bg-white/5">Semester 1</option>
            {!isMaster2 && <option value={2} className="bg-white dark:bg-white/5">Semester 2</option>}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Module Name</label>
        <input 
          required
          type="text" 
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. Introduction to Programming"
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">CM Hours</label>
          <input 
            type="number" 
            value={formData.cmHours}
            onChange={e => setFormData(prev => ({ ...prev, cmHours: parseInt(e.target.value) || 0 }))}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">TD Hours</label>
          <input 
            type="number" 
            value={formData.tdHours}
            onChange={e => setFormData(prev => ({ ...prev, tdHours: parseInt(e.target.value) || 0 }))}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">TP Hours</label>
          <input 
            type="number" 
            value={formData.tpHours}
            onChange={e => setFormData(prev => ({ ...prev, tpHours: parseInt(e.target.value) || 0 }))}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 px-6 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10 transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="flex-1 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20 transition-all"
        >
          Save Module
        </button>
      </div>
    </form>
  );
}

function ParcoursForm({ onSubmit, onCancel }: { onSubmit: (p: Parcours) => void, onCancel: () => void }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    type: ParcoursType.LMD,
    level: LMDLevel.LICENCE,
    year: 1,
    specialty: 'Informatique',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParcours: Parcours = {
      id: `p-${Date.now()}`,
      ...formData,
      level: formData.type === ParcoursType.LMD ? formData.level : undefined
    };
    onSubmit(newParcours);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">System Type</label>
          <select 
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as ParcoursType }))}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
          >
            <option value={ParcoursType.LMD} className="bg-white dark:bg-white/5">LMD</option>
            <option value={ParcoursType.INGENIEUR} className="bg-white dark:bg-white/5">Ingénieur</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Specialty</label>
          <input 
            required
            type="text" 
            value={formData.specialty}
            onChange={e => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {formData.type === ParcoursType.LMD && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">LMD Level</label>
            <div className="relative">
              <select 
                key="lmd-level-select"
                value={formData.level}
                onChange={e => setFormData(prev => ({ ...prev, level: e.target.value as LMDLevel }))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 pr-12 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-500"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em'
                }}
              >
                <option value="" disabled className="text-slate-400">Select level...</option>
                <option value={LMDLevel.LICENCE} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2">
                  Licence - 3 Year Bachelor's Degree
                </option>
                <option value={LMDLevel.MASTER} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2">
                  Master - 2 Year Master's Degree
                </option>
              </select>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Year</label>
          <div className="relative">
            <select 
              key="year-select"
              value={formData.year}
              onChange={e => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 pr-12 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-500"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em'
              }}
            >
              <option value="" disabled className="text-slate-400">Select year...</option>
              {formData.type === ParcoursType.INGENIEUR ? (
                [1, 2, 3, 4, 5].map(y => (
                  <option key={y} value={y} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2">
                    Year {y} {y === 1 ? '(1st year)' : y === 2 ? '(2nd year)' : y === 3 ? '(3rd year)' : `(${y}th year)`}
                  </option>
                ))
              ) : formData.level === LMDLevel.LICENCE ? (
                [1, 2, 3].map(y => (
                  <option key={y} value={y} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2">
                    L{y} - {y === 1 ? '1st' : y === 2 ? '2nd' : '3rd'} Year Licence
                  </option>
                ))
              ) : (
                [1, 2].map(y => (
                  <option key={y} value={y} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2">
                    M{y} - {y === 1 ? '1st' : '2nd'} Year Master
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Display Name</label>
        <input 
          required
          type="text" 
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. L1 Informatique"
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
        <textarea 
          required
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Short description..."
          rows={2}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
        />
      </div>
      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 px-6 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10 transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="flex-1 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20 transition-all"
        >
          Save Parcours
        </button>
      </div>
    </form>
  );
}

function AdminProfile({ profile, onUpdate }: { profile: any, onUpdate: (profile: any) => void }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    password: profile.password,
    profilePhoto: profile.profilePhoto || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdate({
        ...profile,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profilePhoto: formData.profilePhoto
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving admin profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
        
        <div className="relative pt-12 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-slate-800 border-4 border-slate-900 overflow-hidden shadow-2xl flex items-center justify-center">
              {formData.profilePhoto ? (
                <img src={formData.profilePhoto} alt={formData.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={48} className="text-slate-600 dark:text-slate-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-blue-600 rounded-xl text-white cursor-pointer shadow-lg hover:bg-blue-500 transition-all">
                <Camera size={16} className="sm:w-[18px] sm:h-[18px]" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left pb-2 min-w-0">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 truncate">{profile.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">{t('system_administrator')}</p>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              isEditing ? 'bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20'
            }`}
          >
            {isEditing ? <X size={18} /> : <Edit2 size={18} />}
            {isEditing ? 'Cancel' : t('edit_profile')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('admin_name')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  disabled={!isEditing}
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('admin_email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  disabled={!isEditing}
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('admin_password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  disabled={!isEditing}
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end pt-4"
            >
              <button 
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </motion.div>
          )}
        </form>
      </GlassCard>
    </div>
  );
}

function TeacherProfile({ teacherId, teachers, onUpdate }: { teacherId: string, teachers: Teacher[], onUpdate: (teacher: Teacher) => void }) {
  const { t } = useTranslation();
  const teacherObj = teachers.find(item => item.id === teacherId)!;
  const [formData, setFormData] = useState({
    name: teacherObj.name,
    email: teacherObj.email,
    password: teacherObj.password || '',
    profilePhoto: teacherObj.profilePhoto || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdate({
        ...teacherObj,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profilePhoto: formData.profilePhoto
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving teacher profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
        
        <div className="relative pt-12 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-slate-800 border-4 border-slate-900 overflow-hidden shadow-2xl flex items-center justify-center">
              {formData.profilePhoto ? (
                <img src={formData.profilePhoto} alt={formData.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={48} className="text-slate-600 dark:text-slate-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-blue-600 rounded-xl text-white cursor-pointer shadow-lg hover:bg-blue-500 transition-all">
                <Camera size={16} className="sm:w-[18px] sm:h-[18px]" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left pb-2 min-w-0">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 truncate">{teacherObj.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">{teacherObj.grade} • {teacherObj.specialty}</p>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              isEditing ? 'bg-white dark:bg-white/5/90 text-slate-900 dark:text-white hover:bg-white dark:bg-white/5/20' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/10 dark:shadow-blue-600/20'
            }`}
          >
            {isEditing ? <X size={18} /> : <Edit2 size={18} />}
            {isEditing ? 'Cancel' : t('edit_profile')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('full_name_label')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  disabled={!isEditing}
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('email_address_label')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  disabled={!isEditing}
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('password_label')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  disabled={!isEditing}
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('academic_status_label')}</label>
              <div className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-600 dark:text-slate-400 opacity-50 cursor-not-allowed">
                {teacherObj.status} ({t('read_only')})
              </div>
            </div>
          </div>

          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end pt-4"
            >
              <button 
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </motion.div>
          )}
        </form>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="text-center min-w-0">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t('grade_label')}</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white truncate px-2">{teacherObj.grade}</p>
        </GlassCard>
        <GlassCard className="text-center min-w-0">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t('specialty_label')}</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white truncate px-2">{teacherObj.specialty}</p>
        </GlassCard>
        <GlassCard className="text-center min-w-0">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t('yearly_quota_label')}</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white truncate px-2">{teacherObj.requiredHours}h</p>
        </GlassCard>
      </div>
    </div>
  );
}

function TeacherView({ teacherId, teachers, assignments, modules, parcours }: { teacherId: string, teachers: Teacher[], assignments: Assignment[], modules: Module[], parcours: Parcours[] }) {
  const { t } = useTranslation();
  const teacherPtr = teachers.find(item => item.id === teacherId)!;
  const teacherAssignments = assignments.filter(a => a.teacherId === teacherId);
  
  const stats = useMemo(() => {
    const cm = teacherAssignments.filter(a => a.type === ModuleType.CM).reduce((acc, curr) => acc + curr.hours, 0);
    const td = teacherAssignments.filter(a => a.type === ModuleType.TD).reduce((acc, curr) => acc + curr.hours, 0);
    const tp = teacherAssignments.filter(a => a.type === ModuleType.TP).reduce((acc, curr) => acc + curr.hours, 0);
    const total = cm + td + tp;
    return { cm, td, tp, total };
  }, [teacherAssignments]);

  const progress = teacherPtr.status === TeacherStatus.PERMANENT 
    ? Math.min((stats.total / teacherPtr.requiredHours) * 100, 100)
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <GlassCard className="lg:col-span-2 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start p-6 sm:p-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-slate-900 dark:text-white text-2xl sm:text-3xl font-bold shadow-xl shadow-blue-600/10 dark:shadow-blue-600/20 shrink-0 overflow-hidden">
            {teacherPtr.profilePhoto ? (
              <img src={teacherPtr.profilePhoto} alt={teacherPtr.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              teacherPtr.name.charAt(0)
            )}
          </div>
          <div className="flex-1 text-center md:text-left min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1 truncate">{teacherPtr.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-4">{teacherPtr.grade} • {teacherPtr.specialty}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              <span className="px-3 py-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-[10px] sm:text-xs font-medium text-slate-300">
                {teacherPtr.status}
              </span>
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg text-[10px] sm:text-xs font-medium text-blue-700 dark:text-blue-400 truncate max-w-[200px]">
                {teacherPtr.email}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center text-center p-6 sm:p-8">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-900 dark:text-white/5"
                style={{ cx: '50%', cy: '50%', r: '40%' }}
              />
              <motion.circle
                cx="56"
                cy="56"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-blue-500"
                style={{ cx: '50%', cy: '50%', r: '40%' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{stats.total}h</span>
              <span className="text-[8px] sm:text-[10px] text-slate-500 uppercase font-bold">{t('total_load')}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {teacherPtr.status === TeacherStatus.PERMANENT 
              ? `${Math.round(progress)}% ${t('of_quota')} ${teacherPtr.requiredHours}h`
              : 'Hourly based workload'}
          </p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard label={t('cm_hours')} value={`${stats.cm}h`} icon={Briefcase} colorClass="text-blue-700 dark:text-blue-400" />
        <StatCard label={t('td_hours')} value={`${stats.td}h`} icon={Users} colorClass="text-emerald-700 dark:text-emerald-400" />
        <StatCard label={t('tp_hours')} value={`${stats.tp}h`} icon={BarChart3} colorClass="text-amber-700 dark:text-amber-400" />
      </div>

      <GlassCard>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">My Assigned Modules</h3>
        {teacherAssignments.length > 0 ? (
          <div className="space-y-4">
            {teacherAssignments.map((a) => {
              const module = modules.find(m => m.id === a.moduleId);
              const p = parcours.find(p => p.id === module?.parcoursId);
              return (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:border-white/10 transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-slate-900 dark:text-white font-bold truncate">{module?.name}</h4>
                      <p className="text-xs text-slate-500 truncate">
                        {module?.code} • {p?.name} • Semester {module?.semester}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      a.type === ModuleType.CM ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                      a.type === ModuleType.TD ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                      'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                    }`}>
                      {a.type}
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold">{a.hours}h</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600 dark:text-slate-400">
              <BookOpen size={32} />
            </div>
            <p className="text-slate-500">{t('no_modules_assigned')}</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
