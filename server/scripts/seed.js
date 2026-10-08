import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from '../src/models/User.js'
import Subject from '../src/models/Subject.js'
import Task from '../src/models/Task.js'
import Goal from '../src/models/Goal.js'
import Habit from '../src/models/Habit.js'
import Note from '../src/models/Note.js'
import Revision from '../src/models/Revision.js'
import Session from '../src/models/StudySession.js'
import Exam from '../src/models/Exam.js'

dotenv.config()

import { addDays, subDays, format } from 'date-fns'

const today = new Date()
const todayStr = format(today, 'yyyy-MM-dd')

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/plannova'
    await mongoose.connect(mongoUri)
    console.log('MongoDB connected')

    // Clear existing data
    await User.deleteMany()
    await Subject.deleteMany()
    await Task.deleteMany()
    await Goal.deleteMany()
    await Habit.deleteMany()
    await Note.deleteMany()
    await Revision.deleteMany()
    await Session.deleteMany()
    await Exam.deleteMany()
    console.log('Cleared existing data')

    // 1. Create User
    const user = await User.create({
      name: 'Alex Chen',
      email: 'alex@plannova.app',
      password: 'password123', // Will be hashed by model pre-save hook
      course: 'B.Tech Computer Science',
      college: 'IIT Delhi',
      dailyStudyGoal: 360,
      streak: 7
    })
    console.log('User created:', user.email)

    // 2. Create Subjects
    const subjectsData = [
      { name: 'Mathematics', icon: '📐', color: '#7C3AED', studyHours: 42, priority: 'high', description: 'Calculus, Algebra, Statistics' },
      { name: 'Physics', icon: '⚛️', color: '#0EA5E9', studyHours: 35, priority: 'high', description: 'Mechanics, Thermodynamics, Optics' },
      { name: 'Chemistry', icon: '🧪', color: '#10B981', studyHours: 28, priority: 'medium', description: 'Organic, Inorganic, Physical Chemistry' },
      { name: 'Biology', icon: '🔬', color: '#F59E0B', studyHours: 22, priority: 'medium', description: 'Cell Biology, Genetics, Ecology' },
      { name: 'English', icon: '📚', color: '#F43F5E', studyHours: 18, priority: 'low', description: 'Literature, Grammar, Writing' },
      { name: 'Computer Science', icon: '💻', color: '#8B5CF6', studyHours: 31, priority: 'high', description: 'DSA, DBMS, Networking, OS' },
    ].map(s => ({ ...s, user: user._id }))
    
    const subjects = await Subject.insertMany(subjectsData)
    console.log(`Created ${subjects.length} subjects`)

    // Helper to map Subject index to ID
    const getSubId = (index) => subjects[index]?._id

    // 3. Create Tasks
    const tasksData = [
      { title: 'Complete Calculus Chapter 8 exercises', subject: getSubId(0), priority: 'high', status: 'pending', dueDate: todayStr, estimatedTime: 60, tags: ['exercises', 'calculus'] },
      { title: 'Read Physics thermodynamics notes', subject: getSubId(1), priority: 'medium', status: 'pending', dueDate: todayStr, estimatedTime: 45, tags: ['reading'] },
      { title: 'Chemistry lab report write-up', subject: getSubId(2), priority: 'high', status: 'in-progress', dueDate: todayStr, estimatedTime: 90, tags: ['lab', 'report'] },
      { title: 'Biology cell division diagram', subject: getSubId(3), priority: 'low', status: 'completed', dueDate: format(subDays(today, 1), 'yyyy-MM-dd'), estimatedTime: 30, tags: ['diagram'], completedAt: new Date() },
      { title: 'Solve 20 integration problems', subject: getSubId(0), priority: 'high', status: 'pending', dueDate: format(addDays(today, 1), 'yyyy-MM-dd'), estimatedTime: 75, tags: ['practice'] },
      { title: 'English essay draft', subject: getSubId(4), priority: 'medium', status: 'pending', dueDate: format(addDays(today, 2), 'yyyy-MM-dd'), estimatedTime: 60, tags: ['writing'] },
      { title: 'DSA Binary Trees practice', subject: getSubId(5), priority: 'high', status: 'in-progress', dueDate: todayStr, estimatedTime: 120, tags: ['coding', 'dsa'] },
      { title: 'Physics mechanics revision', subject: getSubId(1), priority: 'medium', status: 'completed', dueDate: format(subDays(today, 2), 'yyyy-MM-dd'), estimatedTime: 45, tags: ['revision'], completedAt: new Date() },
    ].map(t => ({ ...t, user: user._id }))
    
    await Task.insertMany(tasksData)
    console.log(`Created ${tasksData.length} tasks`)

    // 4. Create Goals
    /*
    const goalsData = [
      { title: 'Complete Mathematics syllabus', type: 'subject', subject: getSubId(0), target: 100, current: 65, unit: '%', deadline: new Date(addDays(today, 30)), priority: 'high', status: 'active', milestones: ['Ch 1-4 done', 'Ch 5-8 done', 'Ch 9-12 done'], completedMilestones: ['Ch 1-4 done', 'Ch 5-8 done'] },
      { title: 'Study 6 hours daily this week', type: 'weekly', target: 42, current: 28, unit: 'hours', deadline: new Date(addDays(today, 4)), priority: 'high', status: 'active' },
      { title: 'Score 90%+ in all exams this month', type: 'exam', target: 90, current: 85, unit: '%', deadline: new Date(addDays(today, 20)), priority: 'high', status: 'active' },
      { title: 'Solve 500 DSA problems', type: 'subject', subject: getSubId(5), target: 500, current: 287, unit: 'problems', deadline: new Date(addDays(today, 60)), priority: 'medium', status: 'active' },
      { title: 'Daily 2-hour morning study', type: 'daily', target: 120, current: 120, unit: 'minutes', deadline: new Date(), priority: 'medium', status: 'completed' },
    ].map(g => ({ ...g, user: user._id }))
    
    await Goal.insertMany(goalsData)

    // 5. Create Exams
    const examsData = [
      { name: 'Mathematics Final', subject: getSubId(0), date: new Date(addDays(today, 14)), syllabus: ['Calculus', 'Algebra', 'Statistics', 'Trigonometry'], completedSyllabus: ['Calculus', 'Algebra'], targetScore: 95, prepProgress: 65, priority: 'high' },
      { name: 'Physics Mid-term', subject: getSubId(1), date: new Date(addDays(today, 7)), syllabus: ['Mechanics', 'Waves', 'Thermodynamics'], completedSyllabus: ['Mechanics', 'Waves'], targetScore: 85, prepProgress: 70, priority: 'high' },
      { name: 'Chemistry Quiz', subject: getSubId(2), date: new Date(addDays(today, 3)), syllabus: ['Organic Chemistry Ch 1-4', 'Periodic Table'], completedSyllabus: ['Periodic Table'], targetScore: 80, prepProgress: 45, priority: 'medium' },
      { name: 'CS Practical', subject: getSubId(5), date: new Date(addDays(today, 21)), syllabus: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting'], completedSyllabus: ['Arrays', 'Linked Lists', 'Trees'], targetScore: 90, prepProgress: 55, priority: 'high' },
    ].map(e => ({ ...e, user: user._id }))
    
    await Exam.insertMany(examsData)

    // 6. Create Sessions
    const sessionsData = Array.from({ length: 14 }, (_, i) => ({
      subject: getSubId(i % subjects.length),
      date: new Date(subDays(today, i)),
      duration: Math.floor(Math.random() * 90) + 30,
      topic: ['Chapter revision', 'Problem solving', 'Note taking', 'Past papers', 'Video lectures'][Math.floor(Math.random() * 5)],
      rating: Math.floor(Math.random() * 2) + 4,
      startTime: new Date(subDays(today, i).setHours(9, 0, 0, 0)),
      endTime: new Date(subDays(today, i).setHours(10, 30, 0, 0)),
      user: user._id
    }))
    
    await Session.insertMany(sessionsData)
    */

    console.log('Database seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDB()
