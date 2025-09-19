import { Lecturer, Partner, Internship, Company } from '../types';

export const lecturers: Lecturer[] = [
  {
    id: '1',
    name: 'Dr. A. Kaneswaran',
    title: 'Dean of the Faculty',
    photo: 'https://www.eng.jfn.ac.lk/wp-content/uploads/Staff_photos/dr_kanes.jpg',
    specialization: 'BSc. Eng (Hons) (Peradeniya), PhD (QUT, Australia), AMIE(SL), MIEEE'
  },
  {
    id: '2',
    name: 'Prof. T. Thiruvaran',
    title: 'Professor & HOD of EEE',
    photo: 'https://www.eng.jfn.ac.lk/wp-content/uploads/Staff_photos/Tharmarajah_Thiruvaran.png',
    specialization: 'B.Sc.Eng.(Hons)(Peradeniya), PhD (UNSW, Australia), AMIE(SL), MIEEE'
  },
  {
    id: '3',
    name: 'Dr. (Mrs.) P. Jeyananthan',
    title: 'HOD of Computer Engineering',
    photo: 'https://www.eng.jfn.ac.lk/wp-content/uploads/2017/01/pratheeba.jpg',
    specialization: 'B.Sc (Hons) in Computer Science (Jaffna), PhD (Southampton, UK)'
  },
  {
    id: '4',
    name: 'Dr. (Mrs.) J. Jananie',
    title: 'Senior Lecturer Grade II, Com Dept.',
    photo: 'https://www.eng.jfn.ac.lk/wp-content/uploads/Staff_photos/jananie.jpg',
    specialization: 'B.Sc [Hons] in Computer Science, PhD(University of Louisiana)'
  },
  {
    id: '5',
    name: 'Dr. T. Mukunthan',
    title: 'Senior Lecturer Grade II, EEE Dept.',
    photo: 'https://www.eng.jfn.ac.lk/wp-content/uploads/Staff_photos/mukunthan.jpg',
    specialization: 'B.Sc.Eng.(Hons)(Moratuwa), AMIE(SL)'
  },
  {
    id: '6',
    name: 'Mr. R. Valluvan',
    title: 'Senior Lecturer, EEE Dept.',
    photo: 'https://www.eng.jfn.ac.lk/wp-content/uploads/Staff_photos/valluvan_EEE.jpg',
    specialization: ' B.Sc. Eng (Hons) (Peradeniya), M.Sc in Electrical Engineering, AMIE(SL)'
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