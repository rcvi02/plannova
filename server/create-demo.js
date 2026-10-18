import mongoose from 'mongoose';
import User from './src/models/User.js';
import Subject from './src/models/Subject.js';
import Task from './src/models/Task.js';
import StudySession from './src/models/StudySession.js';
import Habit from './src/models/Habit.js';
import Goal from './src/models/Goal.js';
import Exam from './src/models/Exam.js';
import Note from './src/models/Note.js';
import Revision from './src/models/Revision.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plannova';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Create Demo User
    await User.deleteOne({ email: 'demo@plannova.com' });
    const user = new User({
      name: 'Demo Student',
      email: 'demo@plannova.com',
      password: 'password123',
      course: 'B.Tech Computer Science',
      college: 'MIT',
      streak: 15,
      longestStreak: 21,
      totalStudyMinutes: 4500,
      dailyStudyGoal: 360,
    });
    await user.save();
    console.log('✅ Created Demo User:', user.email);

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const nextWeekStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    // 2. Create Subjects
    await Subject.deleteMany({ user: user._id });
    const s1 = await Subject.create({ user: user._id, name: 'Data Structures', color: '#0EA5E9', icon: 'Database', priority: 'high', studyHours: 24, totalChapters: 8, completedChapters: 5 });
    const s2 = await Subject.create({ user: user._id, name: 'Algorithms', color: '#10B981', icon: 'Code', priority: 'high', studyHours: 18, totalChapters: 10, completedChapters: 4 });
    const s3 = await Subject.create({ user: user._id, name: 'Machine Learning', color: '#8B5CF6', icon: 'Brain', priority: 'medium', studyHours: 12, totalChapters: 6, completedChapters: 2 });

    // 3. Create Tasks
    await Task.deleteMany({ user: user._id });
    await Task.create([
      { user: user._id, title: 'Implement Binary Search Tree', subject: s1._id, priority: 'high', status: 'pending', dueDate: todayStr, estimatedTime: 60 },
      { user: user._id, title: 'Review Graph Algorithms', subject: s2._id, priority: 'medium', status: 'completed', dueDate: todayStr, estimatedTime: 45, completedAt: new Date() },
      { user: user._id, title: 'Neural Networks Assignment', subject: s3._id, priority: 'high', status: 'pending', dueDate: tomorrowStr, estimatedTime: 90 },
      { user: user._id, title: 'Read Chapter 4 (Sorting)', subject: s1._id, priority: 'low', status: 'pending', dueDate: tomorrowStr, estimatedTime: 30 }
    ]);

    // 4. Create Sessions
    await StudySession.deleteMany({ user: user._id });
    await StudySession.create([
      { user: user._id, subject: s1._id, topic_description: 'Trees & BST', date: todayStr, duration: 120, focusRating: 4, notes: 'Felt very productive' },
      { user: user._id, subject: s2._id, topic_description: 'Dynamic Programming', date: todayStr, duration: 90, focusRating: 5, notes: 'Finally grasped memoization' },
      { user: user._id, subject: s3._id, topic_description: 'CNN Architectures', date: todayStr, duration: 60, focusRating: 4, notes: 'Review backpropagation' }
    ]);

    // 5. Create Habits
    await Habit.deleteMany({ user: user._id });
    await Habit.create([
      { user: user._id, name: 'LeetCode Daily', icon: 'Code', color: '#7C3AED', frequency: 'daily', currentStreak: 12, longestStreak: 15, completionHistory: [{ date: todayStr, value: 1 }] },
      { user: user._id, name: 'Read ML Paper', icon: 'BookOpen', color: '#0EA5E9', frequency: 'weekly', currentStreak: 4, longestStreak: 4, completionHistory: [{ date: todayStr, value: 1 }] },
      { user: user._id, name: 'Focus Study 2h', icon: 'Sun', color: '#10B981', frequency: 'daily', currentStreak: 15, longestStreak: 15, completionHistory: [{ date: todayStr, value: 1 }] }
    ]);

    // 6. Create Goals
    await Goal.deleteMany({ user: user._id });
    await Goal.create([
      { user: user._id, title: 'Master Dynamic Programming', goalType: 'subject', subject: s2._id, targetValue: 50, current: 20, unit: 'problems', targetDate: nextWeekStr, priority: 'high' },
      { user: user._id, title: 'Study 20 Hours This Week', goalType: 'weekly', targetValue: 20, current: 8, unit: 'hours', targetDate: nextWeekStr, priority: 'medium' }
    ]);

    // 7. Create Exams
    await Exam.deleteMany({ user: user._id });
    await Exam.create([
      {
        user: user._id,
        name: 'Algorithms Mid-Term',
        subject: s2._id,
        date: nextWeekStr,
        totalMarks: 100,
        targetMarks: 85,
        preparationProgress: 60,
        syllabusTopics: [
          { title: 'Sorting & Searching', completed: true },
          { title: 'Graph Traversals', completed: true },
          { title: 'Dynamic Programming', completed: false }
        ]
      }
    ]);

    // 8. Create Notes
    await Note.deleteMany({ user: user._id });
    await Note.create([
      { user: user._id, title: 'Tree Traversal Cheatsheet', subject: s1._id, content: '<p>Inorder: Left, Root, Right<br/>Preorder: Root, Left, Right<br/>Postorder: Left, Right, Root</p>', isPinned: true },
      { user: user._id, title: 'Big-O Cheat Sheet', subject: s2._id, content: '<p>Binary Search: O(log n)<br/>Merge Sort: O(n log n)<br/>Hash Map: O(1) avg</p>' }
    ]);

    // 9. Create Revisions
    await Revision.deleteMany({ user: user._id });
    await Revision.create([
      { user: user._id, topicTitle: 'Dijkstra Algorithm', subject: s2._id, dueDate: todayStr, scheduledDate: todayStr, status: 'due', revisionNumber: 1 },
      { user: user._id, topicTitle: 'Backpropagation Calculus', subject: s3._id, dueDate: tomorrowStr, scheduledDate: tomorrowStr, status: 'upcoming', revisionNumber: 2 }
    ]);

    console.log('🎉 Seeded successfully with all models and relations!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
