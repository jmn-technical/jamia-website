import {
  FaFlask,
  FaBrain,
  FaChartLine,
  FaLandmark,
  FaUsers,
  FaLanguage,
  FaBook,
  FaCalculator,
} from "react-icons/fa";

const bsProgrammes = [
  {
    id: 1,
    course: "Bachelor in Islamic Studies & Science (BISSc)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & science",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in science disciplines",
    ],
    icon: <FaFlask className="text-3xl text-blue-600" />,
  },
  {
    id: 2,
    course: "Bachelor in Islamic Studies & Psychology (BISP)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & psychology",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in psychology",
    ],
    icon: <FaBrain className="text-3xl text-purple-600" />,
  },
  {
    id: 3,
    course: "Bachelor in Islamic Studies & Commerce (BISC)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & commerce",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree B.Com",
    ],
    icon: <FaChartLine className="text-3xl text-green-600" />,
  },
  {
    id: 4,
    course: "Bachelor in Islamic Studies & History (BISH)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & history",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in history",
    ],
    icon: <FaLandmark className="text-3xl text-yellow-600" />,
  },
  {
    id: 5,
    course: "Bachelor in Islamic Studies & Sociology (BISSo)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & social science",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in sociology",
    ],
    icon: <FaUsers className="text-3xl text-red-600" />,
  },
  {
    id: 6,
    course: "Bachelor in Islamic Studies & Arabic Literature (BISAL)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & Arabic literature",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in Arabic literature",
    ],
    icon: <FaLanguage className="text-3xl text-indigo-600" />,
  },
  {
    id: 7,
    course: "Bachelor in Islamic Studies & English Literature (BISEL)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & English literature",
      "Complete Mukhthasar course in Islamic studies",
      "Complete degree in English literature",
    ],
    icon: <FaBook className="text-3xl text-teal-600" />,
  },
];

const hsProgrammes = [
  {
    id: 1,
    name: "School of Science and Technology",
    icon: <FaFlask className="text-3xl text-primary" />,
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & science and technology",
      "Complete Foundation course in Islamic studies",
      "Complete HS in Science",
    ],
    image: "/photos/27.jpg",
  },
  {
    id: 2,
    name: "School of Arts and Civil Service",
    icon: <FaLandmark className="text-3xl text-secondary" />,
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & Arts and Civil Service",
      "Complete Foundation course in Islamic studies",
      "Complete HS in Arts",
    ],
    image: "/photos/25.jpg",
  },
];

const hssProgrammes = [
  {
    id: 1,
    course: "Foundation in Islamic Studies & HSS Science with Biology (FISB)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & science",
      "Integrated studies between Islam & biology",
      "Complete Foundation course in Islamic studies",
      "Complete HSS in Science (Biology)",
    ],
    icon: <FaFlask className="text-3xl text-blue-600" />,
  },
  {
    id: 2,
    course: "Foundation in Islamic Studies & HSS Commerce with Maths (FICM)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & commerce",
      "Integrated studies between Islam & maths",
      "Complete Foundation course in Islamic studies",
      "Complete HSS in Commerce (Maths)",
    ],
    icon: <FaCalculator className="text-3xl text-green-600" />,
  },
  {
    id: 3,
    course: "Foundation in Islamic Studies & HSS Commerce with Politics (FICP)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & commerce",
      "Integrated studies between Islam & politics",
      "Complete Foundation course in Islamic studies",
      "Complete HSS in Commerce (Politics)",
    ],
    icon: <FaLandmark className="text-3xl text-purple-600" />,
  },
  {
    id: 4,
    course:
      "Foundation in Islamic Studies with Hifz Doura & HSS Commerce with Politics (FIHC)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & commerce",
      "Integrated studies between Islam & politics",
      "Complete Foundation course in Islamic studies",
      "Complete HSS in Commerce (Politics)",
      "Complete Qur'an Hifz Doura",
    ],
    icon: <FaBook className="text-3xl text-yellow-600" />,
  },
  {
    id: 5,
    course: "Foundation in Islamic Studies & HSS Humanities (FIH)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & humanity studies",
      "Integrated studies between Islam & social sciences",
      "Complete Foundation course in Islamic studies",
      "Complete HSS in Humanities",
    ],
    icon: <FaLandmark className="text-3xl text-red-600" />,
  },
  {
    id: 6,
    course:
      "Foundation in Islamic Studies with Hifz Doura & HSS Humanities (FIHH)",
    intake: 25,
    outcomes: [
      "Integrated studies between Islam & humanities",
      "Integrated studies between Islam & social sciences",
      "Complete Foundation course in Islamic studies",
      "Complete HSS in Humanities",
      "Complete Qur'an Hifz Doura",
    ],
    icon: <FaBook className="text-3xl text-indigo-600" />,
  },
];

export { hsProgrammes, bsProgrammes, hssProgrammes };
