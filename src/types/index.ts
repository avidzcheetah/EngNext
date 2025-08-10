export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  profilePicture?: string;
  role: 'student' | 'company' | 'admin';
  isApproved?: boolean;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  firstName: string;
  lastName: string;
  description?: string;
  skills: string[];
  cv?: string;
  isAvailable: boolean;
}

export interface Company extends User {
  role: 'company';
  companyName: string;
  website?: string;
  description: string;
  logo?: string;
  isApproved: boolean;
}

export interface Internship {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  duration: string;
  location: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Application {
  id: string;
  studentId: string;
  internshipId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: Date;
  message?: string;
}

export interface Lecturer {
  id: string;
  name: string;
  title: string;
  photo: string;
  specialization: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
}