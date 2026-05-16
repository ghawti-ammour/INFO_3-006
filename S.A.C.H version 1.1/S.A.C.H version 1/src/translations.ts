export type Language = 'en' | 'fr';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Sidebar & Navigation
    'dashboard': 'Dashboard',
    'teachers': 'Teachers',
    'parcours_modules': 'Parcours & Modules',
    'modules': 'Modules',
    'my_profile': 'My Profile',
    'profile': 'Profile',
    'messages': 'Messages',
    'logout': 'Logout',
    'sach_full': 'System of Affectation & Count Hours',
    
    // Auth
    'login_admin': 'Log in as Administrator',
    'login_faculty': 'Log in as Faculty Member',
    'admin_login': 'Admin Login',
    'faculty_login': 'Faculty Login',
    'username': 'Username',
    'email_address': 'Email Address',
    'password': 'Password',
    'sign_in': 'Sign In',
    'change_role': 'Change Role',
    'invalid_admin': 'Invalid administrator credentials.',
    'invalid_faculty': 'Invalid faculty credentials.',
    'please_enter_both': 'Please enter both username and password.',
    
    // Dashboard Stats
    'total_hours': 'Total Hours',
    'total_teachers': 'Total Teachers',
    'total_modules': 'Total Modules',
    'total_parcours': 'Total Parcours',
    'welcome_back': 'Welcome back',
    'search': 'Search...',
    
    // Components & Lists
    'recent_assignments': 'Recent Assignments',
    'view_all': 'View All',
    'faculty_directory': 'Faculty Directory',
    'current_load': 'Current Load',
    'cm': 'CM',
    'td': 'TD',
    'tp': 'TP',
    'no_messages': 'No messages yet.',
    'overtime_request': 'Overtime Request',
    'lmd_system': 'LMD System',
    'lmd_desc': 'Licence, Master, Doctorat hierarchy.',
    'ing_system': 'Ingénieur System',
    'ing_desc': '5-year engineering cycle.',
    'semester_1': 'Semester 1',
    'semester_2': 'Semester 2',
    'select_semester': 'Select Semester',
    'view_modules_sem': 'View modules for this semester.',
    'assigned_modules': 'My Assigned Modules',
    'no_modules_assigned': 'No modules assigned yet for this semester.',
    
    // Modals & Forms
    'add_parcours': 'Add New Parcours',
    'add_teacher': 'Add New Teacher',
    'teacher_added': 'Teacher Added!',
    'provide_credentials': 'Please provide these credentials to the teacher so they can access their account.',
    'add_module': 'Add New Module',
    'assign_module': 'Assign Module',
    'manage_assignments': 'Manage Assignments',
    'select_teacher': 'Select Teacher',
    'assignment_type': 'Assignment Type',
    'hours_to_assign': 'Hours to Assign',
    'full_name': 'Full Name',
    'grade': 'Grade',
    'academic_grade': 'Academic Grade',
    'specialty': 'Specialty',
    'grade_professeur': 'Professeur (Full Professor)',
    'grade_maitre_conf_a': 'Maître de Conférences (A) - Associate Professor',
    'grade_maitre_conf_b': 'Maître de Conférences (B) - Assistant Professor (Senior)',
    'grade_maitre_assist_a': 'Maître-Assistant (A) - Assistant Professor',
    'grade_maitre_assist_b': 'Maître-Assistant (B) - Lecturer',
    'grade_requirements': 'Requirements:',
    'phd_required': '• PhD/Doctorate required',
    'habilitation_required': '• Habilitation required',
    'magister_accepted': '• Magister accepted',
    'status': 'Status',
    'permanent': 'Permanent',
    'vacataire': 'Vacataire',
    'required_hours': 'Required Hours (Yearly)',
    'select_parcours': 'Select Parcours',
    'module_code': 'Module Code',
    'module_name': 'Module Name',
    'cm_hours': 'CM Hours',
    'td_hours': 'TD Hours',
    'tp_hours': 'TP Hours',
    'system_type': 'System Type',
    'lmd_level': 'LMD Level',
    'year': 'Year',
    'display_name': 'Display Name',
    'description': 'Description',
    'confirm_delete': 'Confirm Deletion',
    'delete_confirm_msg': 'Are you sure you want to delete this teacher? This action cannot be undone.',
    
    // Buttons & Actions
    'cancel': 'Cancel',
    'save_changes': 'Save Changes',
    'send_message': 'Send Message',
    'replying_to': 'Replying to:',
    'message_content': 'Message Content',
    'send': 'Send',
    'accept': 'Accept',
    'reject': 'Reject',
    
    // Profile
    'academic_status': 'Academic Status',
    'yearly_quota': 'Yearly Quota',
    'total_load_stat': 'Total Load',
    'personal_info': 'Personal Information',
    'update_photo': 'Update Photo',
    
    // Workload Progress
    'total_load': 'TOTAL LOAD',
    'of_quota': 'of quota',
    
    // Messages
    'messages_notifications': 'Messages & Notifications',
    'no_messages_yet': 'No messages yet.',
    'new_message_to_admin': 'New Message to Admin',
    
    // Profile field labels
    'read_only': 'Read-only',
    'full_name_label': 'Full Name',
    'email_address_label': 'Email Address',
    'password_label': 'Password',
    'academic_status_label': 'Academic Status',
    'grade_label': 'Grade',
    'specialty_label': 'Specialty',
    'yearly_quota_label': 'Yearly Quota',
    
    // Language names
    'english': 'English',
    'french': 'Français',
    
    // Progress status
    'overloaded': 'Overloaded',
    'complete': 'Complete',
    
    // Table headers
    'teacher_header': 'Teacher',
    'module_header': 'Module',
    'type_header': 'Type',
    'hours_header': 'Hours',
    
    // Stats
    'active_modules': 'Active Modules',
    
    // System selection
    'select_system_type': 'Select System Type',
    
    // Admin profile
    'system_administrator': 'System Administrator',
    'edit_profile': 'Edit Profile',
    'admin_name': 'Admin Name',
    'admin_email': 'Admin Email',
    'admin_password': 'Admin Password'
  },
  fr: {
    // Sidebar & Navigation
    'dashboard': 'Tableau de bord',
    'teachers': 'Enseignants',
    'parcours_modules': 'Parcours & Modules',
    'modules': 'Modules',
    'my_profile': 'Mon Profil',
    'profile': 'Profil',
    'messages': 'Messages',
    'logout': 'Déconnexion',
    'sach_full': 'Système d\'Affectation & Décompte d\'Heures',
    
    // Auth
    'login_admin': 'Connexion Administrateur',
    'login_faculty': 'Connexion Enseignant',
    'admin_login': 'Connexion Admin',
    'faculty_login': 'Connexion Faculté',
    'username': 'Nom d\'utilisateur',
    'email_address': 'Adresse Email',
    'password': 'Mot de passe',
    'sign_in': 'Se Connecter',
    'change_role': 'Changer de Rôle',
    'invalid_admin': 'Identifiants administrateur invalides.',
    'invalid_faculty': 'Identifiants enseignant invalides.',
    'please_enter_both': 'Veuillez entrer le nom d\'utilisateur et le mot de passe.',
    
    // Dashboard Stats
    'total_hours': 'Heures Totales',
    'total_teachers': 'Total Enseignants',
    'total_modules': 'Total Modules',
    'total_parcours': 'Total Parcours',
    'welcome_back': 'Bon retour',
    'search': 'Rechercher...',
    
    // Components & Lists
    'recent_assignments': 'Affectations Récentes',
    'view_all': 'Voir Tout',
    'faculty_directory': 'Annuaire de la Faculté',
    'current_load': 'Charge Actuelle',
    'select_system_type': 'Sélectionner le Type de Système',
    
    // Admin profile
    'system_administrator': 'Administrateur Système',
    'edit_profile': 'Modifier le Profil',
    'admin_name': 'Nom Admin',
    'admin_email': 'Email Admin',
    'admin_password': 'Mot de Passe Admin',
    'cm': 'Cours',
    'td': 'TD',
    'tp': 'TP',
    'no_messages': 'Aucun message pour le moment.',
    'overtime_request': 'Demande d\'Heures Supplémentaires',
    'lmd_system': 'Système LMD',
    'lmd_desc': 'Hiérarchie Licence, Master, Doctorat.',
    'ing_system': 'Système Ingénieur',
    'ing_desc': 'Cycle d\'ingénierie de 5 ans.',
    'semester_1': 'Semestre 1',
    'semester_2': 'Semestre 2',
    'select_semester': 'Sélect. Semestre',
    'view_modules_sem': 'Voir les modules de ce semestre.',
    'assigned_modules': 'Mes Modules Affectés',
    'no_modules_assigned': 'Aucun module affecté pour ce semestre.',
    
    // Modals & Forms
    'add_parcours': 'Ajouter un Parcours',
    'add_teacher': 'Ajouter un Enseignant',
    'teacher_added': 'Enseignant Ajouté !',
    'provide_credentials': 'Veuillez fournir ces identifiants à l\'enseignant pour qu\'il puisse accéder à son compte.',
    'add_module': 'Ajouter un Module',
    'assign_module': 'Affecter un Module',
    'manage_assignments': 'Gérer les Affectations',
    'select_teacher': 'Sélectionner Enseignant',
    'assignment_type': 'Type d\'Affectation',
    'hours_to_assign': 'Heures à Affecter',
    'full_name': 'Nom Complet',
    'grade': 'Grade',
    'academic_grade': 'Grade Académique',
    'specialty': 'Spécialité',
    'grade_professeur': 'Professeur (Full Professor)',
    'grade_maitre_conf_a': 'Maître de Conférences (A) - Associate Professor',
    'grade_maitre_conf_b': 'Maître de Conférences (B) - Assistant Professor (Senior)',
    'grade_maitre_assist_a': 'Maître-Assistant (A) - Assistant Professor',
    'grade_maitre_assist_b': 'Maître-Assistant (B) - Lecturer',
    'grade_requirements': 'Exigences:',
    'phd_required': '• PhD/Doctorat requis',
    'habilitation_required': '• Habilitation requise',
    'magister_accepted': '• Magister accepté',
    'status': 'Statut',
    'permanent': 'Permanent',
    'vacataire': 'Vacataire',
    'required_hours': 'Heures Requises (Annuel)',
    'select_parcours': 'Sélectionner Parcours',
    'module_code': 'Code Module',
    'module_name': 'Nom du Module',
    'cm_hours': 'Heures CM',
    'td_hours': 'Heures TD',
    'tp_hours': 'Heures TP',
    'system_type': 'Type de Système',
    'lmd_level': 'Niveau LMD',
    'year': 'Année',
    'display_name': 'Nom d\'affichage',
    'description': 'Description',
    'confirm_delete': 'Confirmer la Suppression',
    'delete_confirm_msg': 'Êtes-vous sûr de vouloir supprimer cet enseignant ? Cette action est irréversible.',
    
    // Buttons & Actions
    'cancel': 'Annuler',
    'save_changes': 'Enregistrer',
    'send_message': 'Envoyer Message',
    'replying_to': 'Répondre à :',
    'message_content': 'Contenu du Message',
    'send': 'Envoyer',
    'accept': 'Accepter',
    'reject': 'Refuser',
    
    // Profile
    'academic_status': 'Statut Académique',
    'yearly_quota': 'Quota Annuel',
    'total_load_stat': 'Charge Totale',
    'personal_info': 'Infos Personnelles',
    'update_photo': 'Modifier Photo',
    
    // Workload Progress
    'total_load': 'CHARGE TOTALE',
    'of_quota': 'du quota',
    
    // Messages
    'messages_notifications': 'Messages & Notifications',
    'no_messages_yet': 'Aucun message pour le moment.',
    'new_message_to_admin': 'Nouveau Message à l\'Admin',
    
    // Profile field labels
    'read_only': 'Lecture seule',
    'full_name_label': 'Nom Complet',
    'email_address_label': 'Adresse E-mail',
    'password_label': 'Mot de Passe',
    'academic_status_label': 'Statut Académique',
    'grade_label': 'Grade',
    'specialty_label': 'Spécialité',
    'yearly_quota_label': 'Quota Annuel',
    
    // Language names
    'english': 'English',
    'french': 'Français',
    
    // Progress status
    'overloaded': 'Surcharge',
    'complete': 'Complet',
    
    // Table headers
    'teacher_header': 'Enseignant',
    'module_header': 'Module',
    'type_header': 'Type',
    'hours_header': 'Heures',
    
    // Stats
    'active_modules': 'Modules Actifs'
  }
};

