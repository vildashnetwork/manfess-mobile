// data/dummyData.js
export const teachers = [
  {
    id: 't1',
    name: 'Teacher 1 - Marie Johnson',
    subject: 'Mathematics',
    rating: 4.8,
    studentsCount: 28,
    bio: 'Experienced math teacher. Loves making algebra fun.',
    avatar: null // put asset uri or require('../assets/avatar1.png')
  },
  {
    id: 't2',
    name: 'Teacher 2 - Peter Mensah',
    subject: 'Physics',
    rating: 4.6,
    studentsCount: 22,
    bio: 'Physics teacher focusing on practical experiments.',
    avatar: null
  },
  {
    id: 't3',
    name: 'Teacher 3 - Aisha Bello',
    subject: 'English',
    rating: 4.9,
    studentsCount: 30,
    bio: 'Passionate about literature and language.',
    avatar: null
  }
];

export const subjects = [
  { id: 's1', title: 'Mathematics' },
  { id: 's2', title: 'Physics' },
  { id: 's3', title: 'English' },
  { id: 's4', title: 'Chemistry' },
  { id: 's5', title: 'Biology' }
];

export const messages = [
  { id: 'm1', from: 'Peter Mensah', text: 'Exam tomorrow — please revise chapter 3', time: '09:00 AM' },
  { id: 'm2', from: 'Aisha Bello', text: 'Homework posted to the portal', time: 'Yesterday' }
];
