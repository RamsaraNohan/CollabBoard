import { daysFromToday } from '../utils/dates'

const createdAt = '2026-08-20T08:00:00.000Z'

export function createSeedWorkspace(today = new Date()) {
  const users = [
    { id: 'u1', studentId: '35762', name: 'M N R Mudannayaka', initials: 'MN', email: 'member1@example.com', avatarUrl: null, role: 'Frontend / Project Coordination', createdAt, updatedAt: createdAt },
    { id: 'u2', studentId: '35783', name: 'M D J Prabashana', initials: 'MP', email: 'member2@example.com', avatarUrl: null, role: 'Frontend Components & Task Features', createdAt, updatedAt: createdAt },
    { id: 'u3', studentId: '33223', name: 'K I S S Kariyawasm', initials: 'KK', email: 'member3@example.com', avatarUrl: null, role: 'UI/UX & Responsive Design', createdAt, updatedAt: createdAt },
    { id: 'u4', studentId: '35934', name: 'D M S P Bandara', initials: 'DB', email: 'member4@example.com', avatarUrl: null, role: 'Dashboard / Supporting UI & QA', createdAt, updatedAt: createdAt },
    { id: 'u5', studentId: '30824', name: 'C R Gammbheera', initials: 'CG', email: 'member5@example.com', avatarUrl: null, role: 'Common Components / Documentation & Git', createdAt, updatedAt: createdAt },
  ]

  const projects = [
    { id: 'p1', name: 'Website Development', description: 'Group 61 full-stack workshop project.', accent: 'blue', ownerId: 'u1', memberIds: users.map((user) => user.id), startDate: daysFromToday(-12, today), dueDate: daysFromToday(21, today), status: 'active', priority: 'high', isFavorite: true, archived: false, createdAt, updatedAt: '2026-08-30T13:00:00.000Z' },
    { id: 'p2', name: 'Mobile Application', description: 'Responsive mobile experience planning and prototype work.', accent: 'purple', ownerId: 'u3', memberIds: ['u1', 'u2', 'u3', 'u4'], startDate: daysFromToday(-7, today), dueDate: daysFromToday(30, today), status: 'active', priority: 'medium', isFavorite: false, archived: false, createdAt, updatedAt: '2026-08-29T10:30:00.000Z' },
    { id: 'p3', name: 'API Integration', description: 'Frontend service contracts and Assignment 02 integration preparation.', accent: 'teal', ownerId: 'u1', memberIds: ['u1', 'u2', 'u4', 'u5'], startDate: daysFromToday(-3, today), dueDate: daysFromToday(38, today), status: 'planning', priority: 'medium', isFavorite: false, archived: false, createdAt, updatedAt: '2026-08-28T09:15:00.000Z' },
  ]

  const task = (id, projectId, title, description, status, priority, assigneeId, dueOffset, labels, updatedOffset) => ({
    id,
    projectId,
    title,
    description,
    creatorId: 'u1',
    assigneeId,
    status,
    priority,
    labels,
    dueDate: daysFromToday(dueOffset, today),
    createdAt,
    updatedAt: new Date(Date.now() + updatedOffset * 60_000).toISOString(),
  })

  const tasks = [
    task('t1', 'p1', 'Build Login UI', 'Create a responsive login page with validation states.', 'todo', 'high', 'u1', 1, ['FRONTEND', 'DESIGN'], 22),
    task('t2', 'p1', 'Create Register Page', 'Design and implement the user registration interface.', 'todo', 'medium', 'u2', 3, ['FRONTEND'], 20),
    task('t3', 'p1', 'Wireframe', 'Create low-fidelity wireframes for the main application screens.', 'todo', 'low', 'u3', 4, ['DESIGN', 'DOCUMENTATION'], 18),
    task('t4', 'p1', 'Component Tree', 'Define the React component hierarchy for the application.', 'todo', 'medium', 'u5', 5, ['DOCUMENTATION'], 16),
    task('t5', 'p1', 'Board Layout', 'Implement the main Kanban board layout and responsive sidebar.', 'doing', 'medium', 'u2', 0, ['FRONTEND', 'DESIGN'], 28),
    task('t6', 'p1', 'Task Modal', 'Create a reusable Add and Edit Task modal component.', 'doing', 'high', 'u1', 2, ['FRONTEND'], 30),
    task('t7', 'p1', 'Responsive Navigation', 'Adapt desktop navigation for tablet and mobile screens.', 'doing', 'medium', 'u3', 3, ['FRONTEND', 'DESIGN'], 26),
    task('t8', 'p1', 'React Project Setup', 'Scaffold the Vite and React application structure.', 'done', 'low', 'u1', -3, ['FRONTEND'], 10),
    task('t9', 'p1', 'Create GitHub Repository', 'Create the team repository and agree on branch strategy.', 'done', 'medium', 'u5', -3, ['DOCUMENTATION'], 8),
    task('t10', 'p1', 'Design Dashboard', 'Create task summary cards and recent activity sections.', 'done', 'low', 'u4', -2, ['DESIGN', 'FRONTEND'], 12),
    task('t11', 'p2', 'Mobile Navigation Map', 'Map the primary mobile navigation and screen hierarchy.', 'done', 'medium', 'u3', -1, ['DESIGN'], 14),
    task('t12', 'p2', 'Prototype Project Cards', 'Create compact project cards for smaller viewports.', 'doing', 'medium', 'u2', 4, ['FRONTEND', 'DESIGN'], 32),
    task('t13', 'p2', 'Mobile Task List', 'Design a readable card fallback for the task table.', 'todo', 'high', 'u3', 6, ['DESIGN', 'FRONTEND'], 24),
    task('t14', 'p2', 'Touch Target Review', 'Review mobile controls for comfortable touch interaction.', 'todo', 'medium', 'u4', 8, ['TESTING', 'DESIGN'], 6),
    task('t15', 'p2', 'Responsive Form Layout', 'Stack project and task form fields at phone widths.', 'doing', 'low', 'u2', 10, ['FRONTEND'], 19),
    task('t16', 'p2', 'Mobile QA Checklist', 'Document the responsive acceptance checklist.', 'todo', 'low', 'u5', 12, ['TESTING', 'DOCUMENTATION'], 4),
    task('t17', 'p2', 'Prototype Review', 'Review the completed mobile prototype with the team.', 'todo', 'medium', 'u1', 14, ['DESIGN'], 2),
    task('t18', 'p3', 'Define Service Contracts', 'Define REST-compatible frontend service method signatures.', 'doing', 'high', 'u1', 2, ['FRONTEND', 'BACKEND'], 36),
    task('t19', 'p3', 'Normalize Mock Data', 'Associate tasks and members with their projects.', 'todo', 'high', 'u2', 5, ['DATABASE', 'FRONTEND'], 34),
    task('t20', 'p3', 'API Error States', 'Design loading, empty, and error states for data screens.', 'todo', 'medium', 'u4', 8, ['DESIGN', 'FRONTEND'], 17),
    task('t21', 'p3', 'REST Handoff Notes', 'Document how mock services will be replaced by API calls.', 'todo', 'medium', 'u5', 11, ['BACKEND', 'DOCUMENTATION'], 15),
    task('t22', 'p3', 'Integration Smoke Plan', 'Prepare core project and task API smoke scenarios.', 'todo', 'low', 'u4', 13, ['TESTING', 'BACKEND'], 9),
  ]

  return { version: 1, users, projects, tasks }
}
