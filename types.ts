
export enum UserRole {
  BASIC = 'BASIC',
  FULL = 'FULL',
  LEADERSHIP = 'LEADERSHIP'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  minRole: UserRole;
  thumbnail: string;
  lessons: Lesson[];
  category: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: string;
}

export interface UpgradeRequest {
  id: string;
  userId: string;
  userName: string;
  currentRole: UserRole;
  requestedRole: UserRole;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}
