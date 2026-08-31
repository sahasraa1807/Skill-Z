export const SKILL_CATEGORIES = [
  {
    category: 'Frontend',
    skills: ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Next.js', 'Tailwind CSS']
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express', 'Django', 'FastAPI', 'Spring Boot', 'Ruby on Rails', 'Go', 'PHP']
  },
  {
    category: 'Database',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Prisma', 'Firebase']
  },
  {
    category: 'AI/ML',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Machine Learning', 'Computer Vision', 'NLP', 'Data Science']
  },
  {
    category: 'Mobile',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS']
  },
  {
    category: 'DevOps',
    skills: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Linux']
  },
  {
    category: 'Design',
    skills: ['Figma', 'UI/UX Design', 'Adobe XD', 'Canva', 'Graphic Design']
  },
  {
    category: 'Other',
    skills: ['Git', 'REST APIs', 'GraphQL', 'Blockchain', 'Cybersecurity', 'Testing', 'Agile']
  }
];

export const PROFICIENCY_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export const INTERESTS = [
  'AI / Machine Learning', 'Web Development', 'Mobile Development',
  'Computer Vision', 'NLP', 'EdTech', 'HealthTech', 'FinTech',
  'Cybersecurity', 'Open Source', 'Game Development', 'Blockchain',
  'Data Science', 'DevOps', 'Accessibility', 'AR/VR', 'IoT',
  'Social Impact', 'Climate Tech', 'E-commerce'
];

export const GOALS = [
  { value: 'PORTFOLIO', label: 'Portfolio Projects' },
  { value: 'HACKATHON', label: 'Hackathons' },
  { value: 'LEARNING', label: 'Learning & Upskilling' },
  { value: 'OPEN_SOURCE', label: 'Open Source' },
  { value: 'STARTUP', label: 'Startup / Product' },
  { value: 'LONG_TERM', label: 'Long-term Projects' },
  { value: 'SHORT_TERM', label: 'Short-term Projects' }
];

export const EXPERIENCE_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner', desc: 'Just starting out, learning the basics' },
  { value: 'INTERMEDIATE', label: 'Intermediate', desc: 'Built a few projects, comfortable with the stack' },
  { value: 'EXPERIENCED', label: 'Experienced', desc: 'Several years of experience, worked on real products' }
];

export const PROFICIENCY_COLORS = {
  BEGINNER: 'bg-green-100 text-green-700',
  INTERMEDIATE: 'bg-blue-100 text-blue-700',
  ADVANCED: 'bg-purple-100 text-purple-700'
};

export const PROJECT_TYPES = [
  { value: 'PORTFOLIO', label: 'Portfolio' },
  { value: 'HACKATHON', label: 'Hackathon' },
  { value: 'STARTUP', label: 'Startup' },
  { value: 'OPEN_SOURCE', label: 'Open Source' },
  { value: 'LEARNING', label: 'Learning' }
];

export const PROJECT_STATUSES = [
  { value: 'RECRUITING', label: 'Recruiting', color: 'bg-green-100 text-green-700' },
  { value: 'ACTIVE', label: 'Active', color: 'bg-blue-100 text-blue-700' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-gray-100 text-gray-700' },
  { value: 'PAUSED', label: 'Paused', color: 'bg-yellow-100 text-yellow-700' }
];

export const PROJECT_DOMAINS = [
  'Web Development', 'Mobile Development', 'AI / Machine Learning',
  'Data Science', 'DevOps', 'Game Development', 'Blockchain',
  'IoT', 'Cybersecurity', 'EdTech', 'HealthTech', 'FinTech',
  'E-commerce', 'Social Impact', 'Other'
];
