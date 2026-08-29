import { addDays, subDays, format } from 'date-fns'

const today = new Date()
const todayStr = format(today, 'yyyy-MM-dd')

export const SUBJECT_COLORS = [
  { bg: '#7C3AED', soft: '#EDE9FE', label: 'Violet' },
  { bg: '#0EA5E9', soft: '#E0F2FE', label: 'Sky' },
  { bg: '#10B981', soft: '#D1FAE5', label: 'Emerald' },
  { bg: '#F59E0B', soft: '#FEF3C7', label: 'Amber' },
  { bg: '#F43F5E', soft: '#FFE4E6', label: 'Rose' },
  { bg: '#8B5CF6', soft: '#EDE9FE', label: 'Purple' },
  { bg: '#06B6D4', soft: '#CFFAFE', label: 'Cyan' },
  { bg: '#EF4444', soft: '#FEE2E2', label: 'Red' },
  { bg: '#F97316', soft: '#FFEDD5', label: 'Orange' },
  { bg: '#14B8A6', soft: '#CCFBF1', label: 'Teal' },
]

export const seedSubjects = [
  { id: 's1', name: 'Mathematics', icon: '📐', color: '#7C3AED', colorSoft: '#EDE9FE', totalChapters: 12, completedChapters: 8, studyHours: 42, priority: 'high', description: 'Calculus, Algebra, Statistics' },
  { id: 's2', name: 'Physics', icon: '⚛️', color: '#0EA5E9', colorSoft: '#E0F2FE', totalChapters: 10, completedChapters: 6, studyHours: 35, priority: 'high', description: 'Mechanics, Thermodynamics, Optics' },
  { id: 's3', name: 'Chemistry', icon: '🧪', color: '#10B981', colorSoft: '#D1FAE5', totalChapters: 14, completedChapters: 9, studyHours: 28, priority: 'medium', description: 'Organic, Inorganic, Physical Chemistry' },
  { id: 's4', name: 'Biology', icon: '🔬', color: '#F59E0B', colorSoft: '#FEF3C7', totalChapters: 16, completedChapters: 12, studyHours: 22, priority: 'medium', description: 'Cell Biology, Genetics, Ecology' },
  { id: 's5', name: 'English', icon: '📚', color: '#F43F5E', colorSoft: '#FFE4E6', totalChapters: 8, completedChapters: 7, studyHours: 18, priority: 'low', description: 'Literature, Grammar, Writing' },
  { id: 's6', name: 'Computer Science', icon: '💻', color: '#8B5CF6', colorSoft: '#EDE9FE', totalChapters: 11, completedChapters: 5, studyHours: 31, priority: 'high', description: 'DSA, DBMS, Networking, OS' },
]

export const seedTasks = [
  { id: 't1', title: 'Complete Calculus Chapter 8 exercises', subjectId: 's1', priority: 'high', status: 'pending', dueDate: todayStr, estimatedTime: 60, tags: ['exercises', 'calculus'], createdAt: new Date().toISOString() },
  { id: 't2', title: 'Read Physics thermodynamics notes', subjectId: 's2', priority: 'medium', status: 'pending', dueDate: todayStr, estimatedTime: 45, tags: ['reading'], createdAt: new Date().toISOString() },
  { id: 't3', title: 'Chemistry lab report write-up', subjectId: 's3', priority: 'high', status: 'in-progress', dueDate: todayStr, estimatedTime: 90, tags: ['lab', 'report'], createdAt: new Date().toISOString() },
  { id: 't4', title: 'Biology cell division diagram', subjectId: 's4', priority: 'low', status: 'completed', dueDate: format(subDays(today, 1), 'yyyy-MM-dd'), estimatedTime: 30, tags: ['diagram'], createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
  { id: 't5', title: 'Solve 20 integration problems', subjectId: 's1', priority: 'high', status: 'pending', dueDate: format(addDays(today, 1), 'yyyy-MM-dd'), estimatedTime: 75, tags: ['practice'], createdAt: new Date().toISOString() },
  { id: 't6', title: 'English essay draft', subjectId: 's5', priority: 'medium', status: 'pending', dueDate: format(addDays(today, 2), 'yyyy-MM-dd'), estimatedTime: 60, tags: ['writing'], createdAt: new Date().toISOString() },
  { id: 't7', title: 'DSA Binary Trees practice', subjectId: 's6', priority: 'high', status: 'in-progress', dueDate: todayStr, estimatedTime: 120, tags: ['coding', 'dsa'], createdAt: new Date().toISOString() },
  { id: 't8', title: 'Physics mechanics revision', subjectId: 's2', priority: 'medium', status: 'completed', dueDate: format(subDays(today, 2), 'yyyy-MM-dd'), estimatedTime: 45, tags: ['revision'], createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
]

export const seedExams = [
  { id: 'e1', name: 'Mathematics Final', subjectId: 's1', date: format(addDays(today, 14), 'yyyy-MM-dd'), syllabus: ['Calculus', 'Algebra', 'Statistics', 'Trigonometry'], completedSyllabus: ['Calculus', 'Algebra'], targetScore: 95, prepProgress: 65, priority: 'high', notes: 'Focus on integration and differential equations' },
  { id: 'e2', name: 'Physics Mid-term', subjectId: 's2', date: format(addDays(today, 7), 'yyyy-MM-dd'), syllabus: ['Mechanics', 'Waves', 'Thermodynamics'], completedSyllabus: ['Mechanics', 'Waves'], targetScore: 85, prepProgress: 70, priority: 'high', notes: 'Review thermodynamics laws' },
  { id: 'e3', name: 'Chemistry Quiz', subjectId: 's3', date: format(addDays(today, 3), 'yyyy-MM-dd'), syllabus: ['Organic Chemistry Ch 1-4', 'Periodic Table'], completedSyllabus: ['Periodic Table'], targetScore: 80, prepProgress: 45, priority: 'medium', notes: 'Memorize reaction mechanisms' },
  { id: 'e4', name: 'CS Practical', subjectId: 's6', date: format(addDays(today, 21), 'yyyy-MM-dd'), syllabus: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting'], completedSyllabus: ['Arrays', 'Linked Lists', 'Trees'], targetScore: 90, prepProgress: 55, priority: 'high', notes: 'Practice coding problems daily' },
]

export const seedSessions = Array.from({ length: 14 }, (_, i) => ({
  id: `sess${i + 1}`,
  subjectId: seedSubjects[i % seedSubjects.length].id,
  date: format(subDays(today, i), 'yyyy-MM-dd'),
  duration: Math.floor(Math.random() * 90) + 30,
  topic: ['Chapter revision', 'Problem solving', 'Note taking', 'Past papers', 'Video lectures'][Math.floor(Math.random() * 5)],
  rating: Math.floor(Math.random() * 2) + 4,
  notes: '',
  startTime: '09:00',
  endTime: '10:30',
}))

export const seedHabits = [
  { id: 'h1', name: 'Morning Study Session', icon: '🌅', color: '#7C3AED', frequency: 'daily', targetDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], streak: 7, longestStreak: 14, completedDates: Array.from({ length: 7 }, (_, i) => format(subDays(today, i), 'yyyy-MM-dd')) },
  { id: 'h2', name: 'Read 30 minutes', icon: '📖', color: '#0EA5E9', frequency: 'daily', targetDays: ['mon', 'tue', 'wed', 'thu', 'fri'], streak: 5, longestStreak: 21, completedDates: Array.from({ length: 5 }, (_, i) => format(subDays(today, i), 'yyyy-MM-dd')) },
  { id: 'h3', name: 'Solve 10 problems', icon: '🧮', color: '#10B981', frequency: 'daily', targetDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'], streak: 3, longestStreak: 10, completedDates: Array.from({ length: 3 }, (_, i) => format(subDays(today, i), 'yyyy-MM-dd')) },
  { id: 'h4', name: 'Review notes', icon: '📝', color: '#F59E0B', frequency: 'daily', targetDays: ['mon', 'tue', 'wed', 'thu', 'fri'], streak: 4, longestStreak: 8, completedDates: Array.from({ length: 4 }, (_, i) => format(subDays(today, i), 'yyyy-MM-dd')) },
  { id: 'h5', name: 'Exercise', icon: '🏃', color: '#F43F5E', frequency: 'daily', targetDays: ['mon', 'wed', 'fri', 'sun'], streak: 2, longestStreak: 12, completedDates: Array.from({ length: 2 }, (_, i) => format(subDays(today, i * 2), 'yyyy-MM-dd')) },
]

export const seedGoals = [
  { id: 'g1', title: 'Complete Mathematics syllabus', type: 'subject', subjectId: 's1', target: 100, current: 65, unit: '%', deadline: format(addDays(today, 30), 'yyyy-MM-dd'), priority: 'high', status: 'active', milestones: ['Ch 1-4 done', 'Ch 5-8 done', 'Ch 9-12 done'], completedMilestones: ['Ch 1-4 done', 'Ch 5-8 done'] },
  { id: 'g2', title: 'Study 6 hours daily this week', type: 'weekly', target: 42, current: 28, unit: 'hours', deadline: format(addDays(today, 4), 'yyyy-MM-dd'), priority: 'high', status: 'active' },
  { id: 'g3', title: 'Score 90%+ in all exams this month', type: 'exam', target: 90, current: 85, unit: '%', deadline: format(addDays(today, 20), 'yyyy-MM-dd'), priority: 'high', status: 'active' },
  { id: 'g4', title: 'Solve 500 DSA problems', type: 'subject', subjectId: 's6', target: 500, current: 287, unit: 'problems', deadline: format(addDays(today, 60), 'yyyy-MM-dd'), priority: 'medium', status: 'active' },
  { id: 'g5', title: 'Daily 2-hour morning study', type: 'daily', target: 120, current: 120, unit: 'minutes', deadline: todayStr, priority: 'medium', status: 'completed' },
]

export const seedNotes = [
  { id: 'n1', title: 'Calculus Integration Notes', subjectId: 's1', content: '<h2>Integration Techniques</h2><p>Integration by parts formula: ∫u dv = uv - ∫v du</p><ul><li>Choose u using LIATE rule</li><li>Practice with trigonometric integrals</li></ul>', tags: ['calculus', 'integration'], pinned: true, favorite: true, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 'n2', title: 'Physics Thermodynamics Summary', subjectId: 's2', content: '<h2>Laws of Thermodynamics</h2><p><strong>First Law:</strong> Energy cannot be created or destroyed, only transformed.</p><p><strong>Second Law:</strong> Entropy of an isolated system always increases.</p>', tags: ['physics', 'thermodynamics'], pinned: false, favorite: false, updatedAt: subDays(new Date(), 1).toISOString(), createdAt: subDays(new Date(), 3).toISOString() },
  { id: 'n3', title: 'DSA Binary Trees', subjectId: 's6', content: '<h2>Binary Tree Properties</h2><p>A binary tree is a tree where each node has at most 2 children.</p><ul><li>Height: O(log n) for balanced trees</li><li>Traversals: Inorder, Preorder, Postorder</li></ul>', tags: ['dsa', 'trees', 'algorithms'], pinned: true, favorite: false, updatedAt: subDays(new Date(), 2).toISOString(), createdAt: subDays(new Date(), 5).toISOString() },
]

export const seedRevisions = [
  { id: 'r1', topic: 'Integration Techniques', subjectId: 's1', revisionNumber: 3, dueDate: todayStr, confidence: 3, status: 'due', nextDate: format(addDays(today, 7), 'yyyy-MM-dd'), createdAt: subDays(new Date(), 14).toISOString() },
  { id: 'r2', topic: 'Newton\'s Laws of Motion', subjectId: 's2', revisionNumber: 2, dueDate: todayStr, confidence: 4, status: 'due', nextDate: format(addDays(today, 14), 'yyyy-MM-dd'), createdAt: subDays(new Date(), 10).toISOString() },
  { id: 'r3', topic: 'Organic Chemistry Reactions', subjectId: 's3', revisionNumber: 1, dueDate: format(subDays(today, 1), 'yyyy-MM-dd'), confidence: 2, status: 'overdue', nextDate: format(addDays(today, 1), 'yyyy-MM-dd'), createdAt: subDays(new Date(), 7).toISOString() },
  { id: 'r4', topic: 'Cell Division', subjectId: 's4', revisionNumber: 4, dueDate: format(addDays(today, 2), 'yyyy-MM-dd'), confidence: 5, status: 'upcoming', nextDate: format(addDays(today, 30), 'yyyy-MM-dd'), createdAt: subDays(new Date(), 21).toISOString() },
  { id: 'r5', topic: 'Binary Trees', subjectId: 's6', revisionNumber: 2, dueDate: format(addDays(today, 5), 'yyyy-MM-dd'), confidence: 3, status: 'upcoming', nextDate: format(addDays(today, 19), 'yyyy-MM-dd'), createdAt: subDays(new Date(), 9).toISOString() },
]

export const DEMO_USER = {
  id: 'user1',
  name: 'Alex Chen',
  email: 'alex@studyflow.app',
  avatar: null,
  streak: 7,
  totalStudyHours: 176,
  joinedAt: '2024-01-01',
  course: 'B.Tech Computer Science',
  college: 'IIT Delhi',
  dailyGoalMinutes: 360,   // legacy field
  dailyStudyGoal: 360,     // canonical field (matches User model)
  preferredStartTime: '08:00',
}
