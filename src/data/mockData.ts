import { Lecturer, Partner, Internship, Company } from '../types';

export const lecturers: Lecturer[] = [
  {
    id: '1',
    name: 'Prof. T. Thiruvaran',
    title: 'Professor & HOD of EEE',
    photo: 'https://www.eng.jfn.ac.lk/wp-content/uploads/Staff_photos/Tharmarajah_Thiruvaran.png',
    specialization: 'Automatic speaker recognition, Speech signal processing, Pattern recognition'
  },
  {
    id: '2',
    name: 'Dr. T. Mukunthan',
    title: 'Senior Lecturer Grade II',
    photo: 'https://www.eng.jfn.ac.lk/wp-content/uploads/Staff_photos/mukunthan.jpg',
    specialization: 'IoT, Electronic design and application, Network design, Signal Processing'
  },
  {
    id: '3',
    name: 'Dr. Ravi Kumar',
    title: 'Senior Lecturer',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialization: 'Control Systems & Automation'
  },
  {
    id: '4',
    name: 'Dr. Priya Sharma',
    title: 'Lecturer',
    photo: 'https://images.pexels.com/photos/3783725/pexels-photo-3783725.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialization: 'Signal Processing & AI'
  }
];

export const partners: Partner[] = [
  {
    id: '1',
    name: 'TechCorp Lanka',
    logo: 'https://images.pexels.com/photos/248515/pexels-photo-248515.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: 'https://techcorp.lk'
  },
  {
    id: '2',
    name: 'Innovation Labs',
    logo: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: 'https://innovationlabs.com'
  },
  {
    id: '3',
    name: 'Smart Solutions',
    logo: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: 'https://smartsolutions.lk'
  },
  {
    id: '4',
    name: 'Digital Dynamics',
    logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
    website: 'https://digitaldynamics.com'
  }
];

export const mockInternships: Internship[] = [
  {
    id: '1',
    companyId: '1',
    title: 'Electronics Engineering Intern',
    description: 'Work on cutting-edge electronic systems design and testing.',
    requirements: ['Electronics fundamentals', 'Circuit design', 'MATLAB/Simulink'],
    duration: '6 months',
    location: 'Colombo',
    isActive: true,
    createdAt: new Date('2025-01-01')
  },
  {
    id: '2',
    companyId: '2',
    title: 'Software Development Intern',
    description: 'Develop innovative software solutions for engineering applications.',
    requirements: ['Programming (Python/JavaScript)', 'Database knowledge', 'Problem solving'],
    duration: '4 months',
    location: 'Remote',
    isActive: true,
    createdAt: new Date('2025-01-02')
  }
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    email: 'hr@techcorp.lk',
    companyName: 'TechCorp Lanka',
    role: 'company',
    website: 'https://techcorp.lk',
    description: 'Leading technology company specializing in electronics and software solutions.',
    logo: 'https://images.pexels.com/photos/248515/pexels-photo-248515.jpeg?auto=compress&cs=tinysrgb&w=200',
    isApproved: true,
    createdAt: new Date('2024-12-01')
  },
  {
    id: '2',
    email: 'careers@innovationlabs.com',
    companyName: 'Innovation Labs',
    role: 'company',
    website: 'https://innovationlabs.com',
    description: 'Research and development company focused on emerging technologies.',
    logo: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=200',
    isApproved: true,
    createdAt: new Date('2024-12-02')
  }
];