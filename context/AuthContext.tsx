
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UpgradeRequest, Announcement } from '../types';
import { MOCK_ANNOUNCEMENTS } from '../constants';

interface AuthContextType {
  user: User | null;
  users: User[]; // Simulated user database
  requests: UpgradeRequest[];
  announcements: Announcement[];
  completedLessons: string[];
  login: (email: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  submitUpgradeRequest: (requestedRole: UserRole) => void;
  resolveUpgradeRequest: (requestId: string, status: 'APPROVED' | 'REJECTED') => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  toggleLessonCompletion: (lessonId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock users for admin view
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'admin@memberhub.com', role: UserRole.LEADERSHIP, joinDate: '2023-01-15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: 'u2', name: 'Bob Basic', email: 'bob@example.com', role: UserRole.BASIC, joinDate: '2023-06-20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: 'u3', name: 'Charlie Full', email: 'charlie@example.com', role: UserRole.FULL, joinDate: '2023-03-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('mh_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const storedUsers = localStorage.getItem('mh_all_users');
    if (storedUsers) setUsers(JSON.parse(storedUsers));

    const storedRequests = localStorage.getItem('mh_requests');
    if (storedRequests) setRequests(JSON.parse(storedRequests));

    const storedAnnouncements = localStorage.getItem('mh_announcements');
    if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));

    const storedProgress = localStorage.getItem('mh_progress');
    if (storedProgress) setCompletedLessons(JSON.parse(storedProgress));
  }, []);

  useEffect(() => {
    localStorage.setItem('mh_all_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mh_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('mh_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('mh_progress', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const login = async (email: string, role: UserRole) => {
    const existingUser = users.find(u => u.email === email);
    const mockUser: User = existingUser || {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      role: role,
      joinDate: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    if (!existingUser) {
      setUsers(prev => [...prev, mockUser]);
    }
    
    setUser(mockUser);
    localStorage.setItem('mh_user', JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string) => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: UserRole.BASIC,
      joinDate: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    setUsers(prev => [...prev, mockUser]);
    setUser(mockUser);
    localStorage.setItem('mh_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mh_user');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
      localStorage.setItem('mh_user', JSON.stringify(updated));
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (user?.id === userId) {
      logout();
    }
  };

  const submitUpgradeRequest = (requestedRole: UserRole) => {
    if (!user) return;
    const newRequest: UpgradeRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      currentRole: user.role,
      requestedRole: requestedRole,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0]
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const resolveUpgradeRequest = (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedRequest = { ...req, status };
        if (status === 'APPROVED') {
          setUsers(allUsers => allUsers.map(u => 
            u.id === req.userId ? { ...u, role: req.requestedRole } : u
          ));
          if (user && req.userId === user.id) {
            updateUser({ role: req.requestedRole });
          }
        }
        return updatedRequest;
      }
      return req;
    }));
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const toggleLessonCompletion = (lessonId: string) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users,
      requests, 
      announcements,
      completedLessons,
      login, 
      register, 
      logout, 
      updateUser, 
      deleteUser,
      submitUpgradeRequest, 
      resolveUpgradeRequest,
      addAnnouncement,
      toggleLessonCompletion
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
