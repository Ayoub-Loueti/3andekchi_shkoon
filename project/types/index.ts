export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  location: string;
  skills: string[];
  isVerified: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  budget: number;
  location: string;
  postedBy: User;
  postedAt: Date;
  deadline?: Date;
  status: TaskStatus;
  applicants: number;
  tags: string[];
  images?: string[];
}

export interface Application {
  id: string;
  taskId: string;
  applicant: User;
  message: string;
  proposedPrice: number;
  appliedAt: Date;
  status: ApplicationStatus;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
}

export type TaskCategory = 
  | 'babysitting'
  | 'gardening'
  | 'tutoring'
  | 'cleaning'
  | 'repairs'
  | 'delivery'
  | 'tech'
  | 'other';

export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';