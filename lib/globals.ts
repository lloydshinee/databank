export const colleges: College[] = [
  {
    name: "Engineering",
    shortname: "COE",
    color: "#5521B5",
    image: "/colleges/coe.png",
    programs: [
      {
        name: "Bachelor of Science in Civil Engineering",
        shortname: "BSCE",
      },
      {
        name: "Bachelor of Science in Mechanical Engineering",
        shortname: "BSME",
      },
      {
        name: "Bachelor of Science in Electrical Engineering",
        shortname: "BSEE",
      },
      {
        name: "Bachelor of Science in Electronics Engineering",
        shortname: "BSEE",
      },
    ],
  },
  {
    name: "Education",
    shortname: "CED",
    color: "#808080",
    image: "/colleges/ced.png",
    programs: [
      {
        name: "Bachelor in Elementary Education",
        shortname: "BED",
      },
      {
        name: "Bachelor in Secondary Education - Major in English",
        shortname: "BME",
      },
      {
        name: "Bachelor in Secondary Education - Major in Filipino",
        shortname: "BMF",
      },
      {
        name: "Bachelor in Secondary Education - Major in Math",
        shortname: "BMM",
      },
    ],
  },
  {
    name: "Computer Studies",
    shortname: "CCS",
    color: "#16a34a",
    image: "/colleges/ccs.png",
    programs: [
      {
        name: "Bachelor of Science in Information Technology",
        shortname: "BSIT",
      },
      {
        name: "Bachelor of Science in Computer Science",
        shortname: "BSCS",
      },
    ],
  },
  {
    name: "Arts & Sciences",
    shortname: "CAS",
    color: "#E3A008",
    image: "/colleges/cas.png",
    programs: [],
  },
  {
    name: "Business Administration",
    shortname: "CBA",
    color: "#723B13",
    image: "/colleges/cba.png",
    programs: [],
  },
  {
    name: "Criminology",
    shortname: "COC",
    color: "#751A3D",
    image: "/colleges/coc.png",
    programs: [
      {
        name: "Bachelor Of Science In Criminology",
        shortname: "BSCRIM",
      },
    ],
  },
];

export interface Program {
  name: string;
  shortname: string;
}

export interface Reviewer {
  title: string;
  college: string;
  description: string | null;
  program: string;
  status: string;
}

export interface College {
  name: string;
  shortname: string;
  color: string;
  image: string;
  programs: Program[];
}

export interface Student {
  id: string;
  firstName: string | null;
  email: string;
  contactNumber: string | null;
  lastName: string | null;
  yearLevel: number | null;
  college: string | null;
  program: string | null;
  schoolId: string | null;
}

export interface Faculty {
  id: string;
  firstName: string;
  email: string;
  contactNumber: string | null;
  lastName: string;
  college: string;
  schoolId: string | null;
}

export interface Topic {
  id: string; // Topic ID
  title: string; // Title of the topic
  description?: string | null | undefined; // Optional description for the topic
  reviewerId: string; // Reviewer ID, relates to the reviewer
  subtopics: Subtopic[]; // Array of subtopics
}

export interface Subtopic {
  id: string; // Subtopic ID
  title: string; // Title of the subtopic
  description?: string | null | undefined; // Optional description for the subtopic
  topicId: string; // Topic ID, relates to the parent topic
}

export interface Question {
  id: string;
  content: string;
  correctAnswer: string;
  subtopicId?: string | null;
  topicId?: string | null;
  status: string;
  reviewerId: string;
  points: number;
  choices: QuestionChoice[];
}

export interface QuestionChoice {
  id: string;
  content: string;
  index: string;
  questionId: string;
}

export interface ReviewerAttempt {
  id: string;
  reviewerId: string;
  userId: string;
  status: string;
  score: number;
  dateCreated: Date;
  expiresAt: Date;
  questionAmount: number;
  timeLimit: number;
  user: Student;
  questions?: ReviewerAttemptQuestion[];
  scopes?: ReviewerAttemptScope[];
}

export interface ReviewerAttemptScope {
  id: string;
  topicId: string;
  subtopicId?: string | null;
  attemptId: string;
  topic: { title: string } | null;
  subtopic: { title: string } | null;
}

export interface ReviewerAttemptQuestion {
  id: string;
  questionId: string;
  attemptId: string;
  userAnswer?: string | null;
  number: number;
  question: Question;
}
