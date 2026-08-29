import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Subject from './src/models/Subject.js';
import Task from './src/models/Task.js';
import StudySession from './src/models/StudySession.js';
import Habit from './src/models/Habit.js';
import Goal from './src/models/Goal.js';

const MONGODB_URI = 'mongodb://localhost:27017/studyflow';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Create Demo User
    await User.deleteOne({ email: 'demo@studyflow.com' });
    const user = new User({
      name: 'Demo User',
      email: 'demo@studyflow.com',
      password: 'password123',
      course: 'B.Tech Computer Science',
      college: 'MIT',
      streak: 15,
      longestStreak: 21,
      totalStudyMinutes: 4500
    });
    await user.save();
    console.log('Created Demo User:', user.email);

    // 2. Create Subjects
    await Subject.deleteMany({ user: user._id });
    const s1 = await Subject.create({ user: user._id, name: 'Data Structures', color: '#0EA5E9', icon: '💾', currentGrade: 'A', targetGrade: 'A+' });
    const s2 = await Subject.create({ user: user._id, name: 'Algorithms', color: '#10B981', icon: '💻', currentGrade: 'B+', targetGrade: 'A' });
    const s3 = await Subject.create({ user: user._id, name: 'Machine Learning', color: '#8B5CF6', icon: '🧠', currentGrade: 'A', targetGrade: 'A+' });

    // 3. Create Tasks
    await Task.deleteMany({ user: user._id });
    await Task.create([
      { user: user._id, title: 'Implement Binary Search Tree', subject: s1._id, priority: 'high', status: 'pending', dueDate: new Date().toISOString() },
      { user: user._id, title: 'Review Graph Algorithms', subject: s2._id, priority: 'medium', status: 'completed', dueDate: new Date().toISOString() },
      { user: user._id, title: 'Neural Networks Assignment', subject: s3._id, priority: 'high', status: 'pending', dueDate: new Date(Date.now() + 86400000).toISOString() },
      { user: user._id, title: 'Read Chapter 4', subject: s1._id, priority: 'low', status: 'pending', dueDate: new Date(Date.now() + 172800000).toISOString() }
    ]);

    // 4. Create Sessions
    await StudySession.deleteMany({ user: user._id });
    await StudySession.create([
      { user: user._id, subject: s1._id, topic_description: 'Trees', date: new Date().toISOString().split('T')[0], duration: 120, focusRating: 4, notes: 'Felt good about this one' },
      { user: user._id, subject: s2._id, topic_description: 'Dynamic Programming', date: new Date().toISOString().split('T')[0], duration: 90, focusRating: 5, notes: 'Finally understood knapsack' },
      { user: user._id, subject: s3._id, topic_description: 'CNNs', date: new Date().toISOString().split('T')[0], duration: 60, focusRating: 3, notes: 'Need to review max pooling' }
    ]);

    // 5. Create Habits
    await Habit.deleteMany({ user: user._id });
    await Habit.create([
      { user: user._id, name: 'LeetCode Daily', frequency: 'daily', streak: 12, longestStreak: 15 },
      { user: user._id, name: 'Read ML Paper', frequency: 'weekly', streak: 4, longestStreak: 4 },
      { user: user._id, name: 'Drink Water', frequency: 'daily', streak: 30, longestStreak: 30 }
    ]);

    // 6. Create Goals (Skipped to avoid validation errors)

    console.log('Seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
