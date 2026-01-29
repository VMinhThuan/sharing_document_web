const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/category.model");

dotenv.config();

const categories = [
  {
    name: "Computer Science",
    description: "Lecture notes, algorithms, and programming resources.",
  },
  {
    name: "Business Administration",
    description: "Resources for management, marketing, and finance.",
  },
  {
    name: "Mathematics",
    description: "Calculus, linear algebra, and statistics materials.",
  },
  {
    name: "Languages",
    description: "Study guides for English, Japanese, and other languages.",
  },
  {
    name: "General Science",
    description: "Physics, Chemistry, and Biology documents.",
  },
  {
    name: "Law",
    description: "Legal documents, case studies, and constitution notes.",
  },
  {
    name: "Web Development",
    description: "HTML, CSS, JavaScript, React, Node.js resources.",
  },
  {
    name: "Artificial Intelligence",
    description: "Machine Learning, Deep Learning, Neural Networks docs.",
  },
  {
    name: "Data Science",
    description: "Data analysis, Python, R, and visualization tools.",
  },
  {
    name: "Cybersecurity",
    description: "Network security, ethical hacking, and cryptography.",
  },
  {
    name: "Mobile Development",
    description: "Android, iOS, Flutter, and React Native tutorials.",
  },
  {
    name: "DevOps & Cloud",
    description: "AWS, Docker, Kubernetes, and CI/CD pipelines.",
  },
  {
    name: "Blockchain & Crypto",
    description: "Smart contracts, Solidity, Web3, and DeFi.",
  },
  {
    name: "Game Development",
    description: "Unity, Unreal Engine, C#, and Game Design.",
  },
  {
    name: "Software Testing",
    description: "Manual testing, Automation, Selenium, and QA processes.",
  },
  {
    name: "Database Systems",
    description: "SQL, MongoDB, Redis, and Database Design.",
  },
  {
    name: "Electrical Engineering",
    description: "Circuits, Electronics, and Signal Processing.",
  },
  {
    name: "Mechanical Engineering",
    description: "Thermodynamics, Mechanics, and CAD design.",
  },
  {
    name: "Graphic Design",
    description: "UI/UX, Photoshop, Illustrator, and Design Theory.",
  },
  {
    name: "History & Culture",
    description: "World history, Vietnamese history, and culture studies.",
  },
  {
    name: "Psychology",
    description: "Human behavior, cognitive science, and counseling.",
  },
  {
    name: "Economics",
    description: "Microeconomics, Macroeconomics, and Econometrics.",
  },
  {
    name: "Medical & Nursing",
    description: "Anatomy, Pharmacology, and Patient Care.",
  },
  {
    name: "Soft Skills",
    description: "Communication, Leadership, and Time management.",
  },
  {
    name: "Exam Prep (TOEIC/IELTS)",
    description: "Practice tests, vocabulary, and grammar for exams.",
  },
  {
    name: "Marketing & SEO",
    description: "Digital marketing, Content strategy, and SEO optimization.",
  },
  {
    name: "Other",
    description: "General or miscellaneous documents.",
  },
];

const seedCategories = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI);
    // console.log("MongoDB Connected");

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
      }
    }

    console.log("Category seeding completed");
    // process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    // process.exit(1);
  }
};

// seedCategories();
module.exports = seedCategories;
