export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'portfolio_db';
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'portfolio_files';

export const COLLECTIONS = {
  PERSONAL: import.meta.env.VITE_APPWRITE_COLLECTION_PERSONAL || 'personal_info',
  EDUCATION: import.meta.env.VITE_APPWRITE_COLLECTION_EDUCATION || 'education',
  EXPERIENCES: import.meta.env.VITE_APPWRITE_COLLECTION_EXPERIENCES || 'experiences',
  CERTIFICATES: import.meta.env.VITE_APPWRITE_COLLECTION_CERTIFICATES || 'certificates',
  SKILLS: import.meta.env.VITE_APPWRITE_COLLECTION_SKILLS || 'skills',
  LANGUAGES: import.meta.env.VITE_APPWRITE_COLLECTION_LANGUAGES || 'languages',
  MESSAGES: import.meta.env.VITE_APPWRITE_COLLECTION_MESSAGES || 'messages',
  SECTION_TITLES: import.meta.env.VITE_APPWRITE_COLLECTION_SECTION_TITLES || 'section_titles',
};

export const DEFAULT_DATA = {
  personal: {
    name: 'Mohamed Ezzat',
    title: 'Business Development Consultant',
    bio: 'I am Mohammed, a fourth-year E-Commerce student. I have developed a passion for business development, which has driven me to embark on a journey of learning and reading to become well-versed in all aspects of this field.',
    email: 'ezzatm768@gmail.com',
    phone: '+201507623769',
  },
  education: [
    {
      $id: '1',
      institution: 'Higher Institute of E-Commerce Systems',
      degree: 'Very Good',
      description: 'Student at the Higher Institute of E-Commerce Systems',
      order: 0,
    },
  ],
  experiences: [
    {
      $id: '1',
      title: 'Social Media Accounts Developer',
      description: 'Own business - Developing and managing social media accounts for clients, creating growth strategies and content plans.',
      period: '2021 - 2023',
      order: 0,
    },
    {
      $id: '2',
      title: 'Business Consultant for Startup Companies',
      description: 'Providing strategic consulting for startup companies, helping them develop business models, growth strategies, and operational frameworks.',
      period: '2024 - Present',
      order: 1,
    },
  ],
  certificates: [
    { $id: '1', name: 'Professional Diploma in Digital Business Development', institution: 'MTF Institute', order: 0 },
    { $id: '2', name: 'Diploma of Administration Manager / in Administration Management', institution: 'MTF Institute', order: 1 },
    { $id: '3', name: 'Executive Diploma in Business Strategy, Business Module, Strategic Management', institution: 'MTF Institute', order: 2 },
    { $id: '4', name: 'Business Model Canvas: A Tool for Entrepreneurs and Innovators', institution: 'Kennesaw State University', order: 3 },
    { $id: '5', name: 'Creative Thinking: Techniques and Tools for Success', institution: 'Imperial College London', order: 4 },
    { $id: '6', name: 'Digital Product Management: Modern Fundamentals', institution: 'University of Virginia', order: 5 },
    { $id: '7', name: 'New Venture Finance: Startup Funding for Entrepreneurs', institution: 'University of Virginia', order: 6 },
  ],
  skills: [
    { $id: '1', name: 'Innovation', level: 90, order: 0 },
    { $id: '2', name: 'Resource Management', level: 85, order: 1 },
    { $id: '3', name: 'Business Modeling', level: 88, order: 2 },
    { $id: '4', name: 'Business Strategy', level: 92, order: 3 },
  ],
  languages: [
    { $id: '1', name: 'Arabic', proficiency: 'Native', level: 100, order: 0 },
    { $id: '2', name: 'English', proficiency: 'Professional', level: 80, order: 1 },
    { $id: '3', name: 'Japanese', proficiency: 'Beginner', level: 25, order: 2 },
  ],
  sectionTitles: {
    hero: { title: '', subtitle: 'Business Development Consultant', tagline: 'Helping businesses grow through strategic development and digital innovation.' },
    about: { title: 'About Me', subtitle: 'Get to know me' },
    experience: { title: 'Experience', subtitle: 'Professional Path' },
    education: { title: 'Education', subtitle: 'Academic Journey' },
    certificates: { title: 'Certificates & Courses', subtitle: 'Continuous Learning' },
    skills: { title: 'Skills', subtitle: 'What I Excel At' },
    languages: { title: 'Languages', subtitle: 'Communication' },
    contact: { title: 'Get In Touch', subtitle: "Let's Connect" },
  },
};
