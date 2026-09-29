export interface DepartmentCoordinator {
  facultyName: string;
  facultyDesignation: string;
  facultyPhone: string;
  studentName: string;
  studentClass: string;
  studentPhone: string;
  email: string;
}

export interface DepartmentOption {
  code: string;
  name: string;
  wingName: string;
  shortName: string;
  badgeColor: string;
  events: string[];
  coordinator: DepartmentCoordinator;
}

export const COLLEGE_INFO = {
  name: 'Sengunthar Engineering College',
  autonomous: 'AUTONOMOUS',
  anniversary: '25th ANNIVERSARY',
  estd: 'Estd. 2001',
  tagline: 'Approved by AICTE, New Delhi and Affiliated to Anna University, Chennai',
  ugcRecognition: 'Recognized under sections 2(f) and 12(B) of the UGC Act 1956',
  accreditation: "Accredited by NAAC with 'A' Grade",
  location: 'TIRUCHENGODE - 637 205, NAMAKKAL(Dt), TAMIL NADU',
  website: 'www.sect.edu.in',
  websiteUrl: 'https://www.sect.edu.in',
  socialHandle: '/senguntharengineeringcollege',
  contactEmail: 'techsym26@sengunthar.edu.in',
  helpline: '+91 94433 12345 / 04288-255716',
};

export const SYMPOSIUM_INFO = {
  name: 'TechSym SaRaYu-26',
  fullTitle: 'TechSym SaRaYu-26 National-Level Students\' Technical Symposium',
  subTitle: 'NATIONAL-LEVEL STUDENTS\' TECHNICAL SYMPOSIUM',
  theme: 'Innovate • Inspire • Impact',
  dates: '30th SEP & 01st OCT 2026',
  dateStart: '2026-09-30',
  dateEnd: '2026-10-01',
  venue: 'Sengunthar Campus Auditorium & Respective Department Blocks, Tiruchengode',
  yearPrefix: 'TS26',
  registrationFee: '₹250 PER PARTICIPANT',
  registrationFeeAmount: 250,
  importantDates: [
    { label: 'Paper Submission Deadline', date: '19.09.2026' },
    { label: 'Selection Intimation', date: '22.09.2026' },
    { label: 'Registration Ends On', date: '23.09.2026 / 26.09.2026' },
    { label: 'Paper Presentation (Day 1)', date: '30.09.2026' },
    { label: 'Technical Events & Valediction (Day 2)', date: '01.10.2026' },
  ],
  perks: [
    { title: 'Win Exciting Prizes', icon: 'trophy', desc: 'Cash rewards, mementos & excellence certificates' },
    { title: 'Food & Refreshments', icon: 'utensils', desc: 'Delicious lunch, snacks & high-tea provided' },
    { title: 'Fun Games', icon: 'gamepad', desc: 'Interactive non-technical gaming & entertainment' },
    { title: 'Pre-Symposium Events', icon: 'sparkles', desc: 'Workshops, hack battles & hands-on prep' },
  ],
};

export const DEPARTMENTS: DepartmentOption[] = [
  {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    wingName: 'I-TRENDERS',
    shortName: 'CSE',
    badgeColor: '#1e3a8a',
    events: ['Paper Presentation', 'Byte Battle', 'Reverse Coding'],
    coordinator: {
      facultyName: 'Mr. Perumala Maheshraj',
      facultyDesignation: 'AP/CSE',
      facultyPhone: '9629280723',
      studentName: 'A. Ganesh Shankar',
      studentClass: 'IV-CSE',
      studentPhone: '9789394854',
      email: 'itrenders26@gmail.com',
    },
  },
  {
    code: 'IT',
    name: 'Information Technology',
    wingName: 'AMAZE IT',
    shortName: 'IT',
    badgeColor: '#0e7490',
    events: ['Paper Presentation', 'Project Expo', 'UX Explore'],
    coordinator: {
      facultyName: 'Mrs. S.B. Narmada',
      facultyDesignation: 'AP/IT',
      facultyPhone: '99427 33244',
      studentName: 'A. Syed Basha',
      studentClass: 'IV-IT',
      studentPhone: '6383178717',
      email: 'amazeit2026@gmail.com',
    },
  },
  {
    code: 'CYBER',
    name: 'Cyber Security',
    wingName: 'CYBORG',
    shortName: 'CYBER',
    badgeColor: '#0f766e',
    events: ['Paper Presentation', 'Brute Force Brain', 'Cyber Challenge'],
    coordinator: {
      facultyName: 'Mr. P. Rengasamy',
      facultyDesignation: 'AP/CSE(CS)',
      facultyPhone: '8072572747',
      studentName: 'R. Deepanraj',
      studentClass: 'IV-Cyber',
      studentPhone: '9123547492',
      email: 'cyborg2k26@gmail.com',
    },
  },
  {
    code: 'AIDS',
    name: 'Artificial Intelligence & Data Science',
    wingName: 'ARTI',
    shortName: 'AI&DS',
    badgeColor: '#581c87',
    events: ['Paper Presentation', 'Tech-Swap', 'Prompt Battle'],
    coordinator: {
      facultyName: 'Mr. M. Premkumar',
      facultyDesignation: 'AP/AI&DS',
      facultyPhone: '8144828828',
      studentName: 'S. Samuel',
      studentClass: 'IV-AI&DS',
      studentPhone: '9361809304',
      email: 'arti.sec26@gmail.com',
    },
  },
  {
    code: 'AIML',
    name: 'Artificial Intelligence & Machine Learning',
    wingName: 'AURA ML',
    shortName: 'AI&ML',
    badgeColor: '#be123c',
    events: ['Paper Presentation', 'Prompt Verse'],
    coordinator: {
      facultyName: 'Mrs. R. Rathika',
      facultyDesignation: 'AP/AI&ML',
      facultyPhone: '9952941094',
      studentName: 'N. Deepak Kishore',
      studentClass: 'II-AI&ML',
      studentPhone: '7695820575',
      email: 'auraml2k26@gmail.com',
    },
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    wingName: 'TRAGGA TALENTA',
    shortName: 'ECE',
    badgeColor: '#c2410c',
    events: ['Paper Presentation', 'Tricky Circuits', 'Googler'],
    coordinator: {
      facultyName: 'Dr. M. Arunkumar',
      facultyDesignation: 'AP/ECE',
      facultyPhone: '9894093603',
      studentName: 'V. Tharshan',
      studentClass: 'IV-ECE',
      studentPhone: '9597790653',
      email: 'traggatalenta26@gmail.com',
    },
  },
  {
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    wingName: 'LUMINUS',
    shortName: 'EEE',
    badgeColor: '#d97706',
    events: ['Paper Presentation', 'Link-Up', 'Tech Hunt'],
    coordinator: {
      facultyName: 'Mrs. R. Gohila',
      facultyDesignation: 'AsP/EEE',
      facultyPhone: '6381746620',
      studentName: 'P. J. Praveenkumar',
      studentClass: 'IV-EEE',
      studentPhone: '6383972289',
      email: 'luminuseee2k26@gmail.com',
    },
  },
  {
    code: 'MDE',
    name: 'Medical Electronics Engineering',
    wingName: 'I AM',
    shortName: 'MDE',
    badgeColor: '#991b1b',
    events: ['Paper Presentation', 'Ad-Zap', 'Med Quest'],
    coordinator: {
      facultyName: 'Mr. G. Syed Zabiyullah',
      facultyDesignation: 'AP/MDE',
      facultyPhone: '9566845948',
      studentName: 'M.K. Naresh',
      studentClass: 'IV-MDE',
      studentPhone: '8903604965',
      email: 'mdetechsym2026@gmail.com',
    },
  },
  {
    code: 'MECH',
    name: 'Mechanical Engineering',
    wingName: 'GEAR MECH',
    shortName: 'MECH',
    badgeColor: '#0369a1',
    events: ['Paper Presentation', 'Quiz Master', 'Audio Clipping'],
    coordinator: {
      facultyName: 'Mr. S. Murugesan',
      facultyDesignation: 'AP/MECH',
      facultyPhone: '9942227548',
      studentName: 'M. Bala Krishnan',
      studentClass: 'IV-MECH',
      studentPhone: '7094239674',
      email: 'gearmech2026@gmail.com',
    },
  },
  {
    code: 'CIVIL',
    name: 'Civil Engineering',
    wingName: 'ASTHIVARA',
    shortName: 'CIVIL',
    badgeColor: '#15803d',
    events: ['Paper Presentation', 'Technical Quiz', 'Mind Blogger'],
    coordinator: {
      facultyName: 'Ms. G. Dhusitha',
      facultyDesignation: 'AP/CIVIL',
      facultyPhone: '8870768939',
      studentName: 'R. Thirunavukkarasu',
      studentClass: 'IV-CIVIL',
      studentPhone: '94888 74974',
      email: 'asthivara2026@gmail.com',
    },
  },
  {
    code: 'ROAM',
    name: 'Robotics & Automation',
    wingName: 'ROAM',
    shortName: 'R&A',
    badgeColor: '#4338ca',
    events: ['Paper Presentation', 'ROBOTIQ', 'ROBO ARENA'],
    coordinator: {
      facultyName: 'Mr. P. Naveenkumar',
      facultyDesignation: 'AP/R&A',
      facultyPhone: '9578088660',
      studentName: 'I. Gokul',
      studentClass: 'IV-R&A',
      studentPhone: '9360105586',
      email: 'roam2k26@gmail.com',
    },
  },
  {
    code: 'PT',
    name: 'Pharmaceutical Technology',
    wingName: 'PHARMAKON',
    shortName: 'PT',
    badgeColor: '#831843',
    events: ['Paper Presentation', 'Pharma Quiz'],
    coordinator: {
      facultyName: 'Mr. V.M. Balakrishnan',
      facultyDesignation: 'AP/PT',
      facultyPhone: '6380668961',
      studentName: 'M. Deepika',
      studentClass: 'IV-PT',
      studentPhone: '6374728469',
      email: 'Pharm.tech2k26@gmail.com',
    },
  },
  {
    code: 'MBA',
    name: 'Master of Business Administration',
    wingName: 'AIMS',
    shortName: 'MBA',
    badgeColor: '#1e1b4b',
    events: ['Paper Presentation', 'Ad-Zap', 'Best Manager'],
    coordinator: {
      facultyName: 'Ms. M. Selvajayalakshmi',
      facultyDesignation: 'AP/MBA',
      facultyPhone: '9842836197',
      studentName: 'S. Swetha',
      studentClass: 'II-MBA',
      studentPhone: '6381031970',
      email: 'aimsmba2k26@gmail.com',
    },
  },
];

export const YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Post Graduate (PG / MBA)',
] as const;

export const PARTICIPANT_TYPES = [
  'Internal Participant (Sengunthar Student)',
  'External Participant (Other Engineering / Tech College)',
  'Paper Presenter',
  'Technical Event Competitor',
  'Event Coordinator / Student Volunteer',
] as const;
