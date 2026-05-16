const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const db = new Database('database.db');

// Example functions to modify database - uncomment what you need

// Add a new teacher
async function addTeacher() {
  const hashedPassword = await bcrypt.hash('teacher123', 10);
  const teacherData = {
    id: uuidv4(),
    name: 'John Doe',
    email: 'john.doe@university.edu',
    password: hashedPassword,
    grade: 'Professor',
    specialty: 'Computer Science',
    status: 'Active',
    requiredHours: 384,
    profilePhoto: '',
    prioritySessionType: 'TD',
    weeklyEstimatedHours: '8h à 10h'
  };
  
  db.prepare(`INSERT INTO teachers (id, name, email, password, grade, specialty, status, requiredHours, profilePhoto, prioritySessionType, weeklyEstimatedHours) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      teacherData.id, teacherData.name, teacherData.email, teacherData.password,
      teacherData.grade, teacherData.specialty, teacherData.status, teacherData.requiredHours,
      teacherData.profilePhoto, teacherData.prioritySessionType, teacherData.weeklyEstimatedHours
    );
  console.log('Teacher added successfully!');
}

// Add a parcours
function addParcours() {
  const parcoursData = {
    id: uuidv4(),
    name: 'Computer Science Engineering',
    type: 'Engineering',
    level: 'Bachelor',
    year: 2,
    specialty: 'Software Development',
    description: 'Focus on software engineering and development'
  };
  
  db.prepare(`INSERT INTO parcours (id, name, type, level, year, specialty, description) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
      parcoursData.id, parcoursData.name, parcoursData.type, 
      parcoursData.level, parcoursData.year, parcoursData.specialty, parcoursData.description
    );
  console.log('Parcours added successfully!');
}

// Add a module
function addModule() {
  // First get a parcours ID
  const parcours = db.prepare('SELECT id FROM parcours LIMIT 1').get();
  if (!parcours) {
    console.log('No parcours found. Add a parcours first.');
    return;
  }
  
  const moduleData = {
    id: uuidv4(),
    code: 'CS201',
    name: 'Data Structures',
    semester: 3,
    cmHours: 30,
    tdHours: 30,
    tpHours: 15,
    parcoursId: parcours.id
  };
  
  db.prepare(`INSERT INTO modules (id, code, name, semester, cmHours, tdHours, tpHours, parcoursId) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      moduleData.id, moduleData.code, moduleData.name, moduleData.semester,
      moduleData.cmHours, moduleData.tdHours, moduleData.tpHours, moduleData.parcoursId
    );
  console.log('Module added successfully!');
}

// Execute functions - uncomment what you want to run
// addTeacher();
// addParcours();
// addModule();

console.log('Database modification script ready. Uncomment functions to execute.');

db.close();
