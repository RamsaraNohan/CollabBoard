export const users = [
  { id: 'u1', name: 'Team Member 1', initials: 'TM', role: 'Project Admin', email: 'member1@example.com' },
  { id: 'u2', name: 'Team Member 2', initials: 'T2', role: 'Frontend Developer', email: 'member2@example.com' },
  { id: 'u3', name: 'Team Member 3', initials: 'T3', role: 'UI/UX & Documentation', email: 'member3@example.com' },
  { id: 'u4', name: 'Team Member 4', initials: 'T4', role: 'Testing & Git Coordinator', email: 'member4@example.com' },
]

export const projects = [
  { id: 'p1', name: 'Website Development', accent: 'blue' },
  { id: 'p2', name: 'Mobile Application', accent: 'orange' },
  { id: 'p3', name: 'API Integration', accent: 'slate' },
]

export const initialTasks = [
  {
    id: 't1', title: 'Build Login UI', description: 'Create a responsive login page with validation states.',
    status: 'todo', priority: 'high', assigneeId: 'u1', dueDate: '2026-08-24', labels: ['FRONTEND', 'DESIGN'],
  },
  {
    id: 't2', title: 'Create Register Page', description: 'Design and implement the user registration interface.',
    status: 'todo', priority: 'medium', assigneeId: 'u2', dueDate: '2026-08-26', labels: ['FRONTEND'],
  },
  {
    id: 't3', title: 'Wireframe', description: 'Create low-fidelity wireframes for the main application screens.',
    status: 'todo', priority: 'low', assigneeId: 'u3', dueDate: '2026-08-27', labels: ['DESIGN', 'DOCUMENTATION'],
  },
  {
    id: 't4', title: 'Component Tree', description: 'Define the React component hierarchy for the application.',
    status: 'todo', priority: 'medium', assigneeId: 'u1', dueDate: '2026-08-28', labels: ['DOCUMENTATION'],
  },
  {
    id: 't5', title: 'Board Layout', description: 'Implement the main Kanban board layout and responsive sidebar.',
    status: 'doing', priority: 'medium', assigneeId: 'u2', dueDate: '2026-08-23', labels: ['FRONTEND', 'DESIGN'],
  },
  {
    id: 't6', title: 'Task Modal', description: 'Create a reusable Add / Edit Task modal component.',
    status: 'doing', priority: 'high', assigneeId: 'u1', dueDate: '2026-08-25', labels: ['FRONTEND'],
  },
  {
    id: 't7', title: 'Responsive Navigation', description: 'Adapt desktop sidebar navigation for tablet and mobile screens.',
    status: 'doing', priority: 'medium', assigneeId: 'u4', dueDate: '2026-08-26', labels: ['FRONTEND'],
  },
  {
    id: 't8', title: 'React Project Setup', description: 'Scaffold the Vite + React application and project structure.',
    status: 'done', priority: 'low', assigneeId: 'u1', dueDate: '2026-08-20', labels: ['FRONTEND'],
  },
  {
    id: 't9', title: 'Create GitHub Repository', description: 'Create the team repository and agree on branch strategy.',
    status: 'done', priority: 'medium', assigneeId: 'u4', dueDate: '2026-08-20', labels: ['DOCUMENTATION'],
  },
  {
    id: 't10', title: 'Design Dashboard', description: 'Create task summary cards and recent activity sections.',
    status: 'done', priority: 'low', assigneeId: 'u3', dueDate: '2026-08-21', labels: ['DESIGN', 'FRONTEND'],
  },
]
