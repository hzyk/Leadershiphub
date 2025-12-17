
import { UserRole, Course, Announcement } from './types';

export const WHATSAPP_NUMBER = "+254 726 177696";

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Foundations of Excellence',
    description: 'Master the core principles of organizational success and personal productivity.',
    minRole: UserRole.BASIC,
    category: 'Soft Skills',
    thumbnail: 'https://picsum.photos/seed/course1/800/600',
    lessons: [
      { id: 'l1', title: 'Introduction to Core Values', content: 'Our values define our path...', duration: '15m' },
      { id: 'l2', title: 'Communication Basics', content: 'Effective communication is key...', duration: '25m' }
    ]
  },
  {
    id: 'c2',
    title: 'Advanced Strategic Planning',
    description: 'Learn how to build and execute high-level business strategies.',
    minRole: UserRole.FULL,
    category: 'Strategy',
    thumbnail: 'https://picsum.photos/seed/course2/800/600',
    lessons: [
      { id: 'l3', title: 'Market Analysis', content: 'Deep dive into market dynamics...', duration: '45m' },
      { id: 'l4', title: 'Risk Assessment', content: 'Identifying organizational risks...', duration: '30m' }
    ]
  },
  {
    id: 'c3',
    title: 'Executive Leadership Workshop',
    description: 'Exclusive training for the leadership team on decision making and culture.',
    minRole: UserRole.LEADERSHIP,
    category: 'Leadership',
    thumbnail: 'https://picsum.photos/seed/course3/800/600',
    lessons: [
      { id: 'l5', title: 'The Leader Mindset', content: 'What makes a leader...', duration: '60m' },
      { id: 'l6', title: 'Crisis Management', content: 'Handling the unexpected...', duration: '90m' }
    ]
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'Welcome to MemberHub', content: 'We are thrilled to launch our new platform!', date: '2023-10-01', priority: 'medium' },
  { id: 'a2', title: 'Upcoming Leadership Retreat', content: 'Leadership members check your email for details.', date: '2023-11-15', priority: 'high' }
];
