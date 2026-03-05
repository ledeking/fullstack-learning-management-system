import { PrismaClient, UserRole, CourseLevel, LessonType, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "web-development" },
      update: {},
      create: {
        name: "Web Development",
        slug: "web-development",
        description: "Learn modern web development technologies",
      },
    }),
    prisma.category.upsert({
      where: { slug: "data-science" },
      update: {},
      create: {
        name: "Data Science",
        slug: "data-science",
        description: "Master data analysis and machine learning",
      },
    }),
    prisma.category.upsert({
      where: { slug: "mobile-development" },
      update: {},
      create: {
        name: "Mobile Development",
        slug: "mobile-development",
        description: "Build mobile apps for iOS and Android",
      },
    }),
    prisma.category.upsert({
      where: { slug: "design" },
      update: {},
      create: {
        name: "Design",
        slug: "design",
        description: "UI/UX design and graphic design courses",
      },
    }),
  ]);

  // Create instructor user (you'll need to update this with a real Clerk ID)
  const instructor = await prisma.user.upsert({
    where: { email: "instructor@example.com" },
    update: {},
    create: {
      clerkId: "instructor_clerk_id",
      email: "instructor@example.com",
      firstName: "John",
      lastName: "Instructor",
      role: UserRole.INSTRUCTOR,
    },
  });

  // Create courses
  const courses = [
    {
      title: "Complete Next.js 15 Masterclass",
      slug: "complete-nextjs-15-masterclass",
      description: "Learn Next.js 15 from scratch with App Router, Server Components, and modern React patterns. Build production-ready applications with TypeScript, authentication, and database integration.",
      shortDescription: "Master Next.js 15 with App Router and Server Components",
      price: 99.99,
      level: CourseLevel.INTERMEDIATE,
      categoryId: categories[0].id,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    },
    {
      title: "Full Stack TypeScript Development",
      slug: "full-stack-typescript-development",
      description: "Build full-stack applications with TypeScript, React, Node.js, and PostgreSQL. Learn type safety, API design, and database management.",
      shortDescription: "Build type-safe full-stack applications",
      price: 79.99,
      level: CourseLevel.ADVANCED,
      categoryId: categories[0].id,
      thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    },
    {
      title: "Python for Data Science",
      slug: "python-for-data-science",
      description: "Learn Python programming for data analysis, visualization, and machine learning. Work with pandas, numpy, matplotlib, and scikit-learn.",
      shortDescription: "Master Python for data analysis and ML",
      price: 89.99,
      level: CourseLevel.BEGINNER,
      categoryId: categories[1].id,
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4f18ac5?w=800",
    },
    {
      title: "React Native Mobile App Development",
      slug: "react-native-mobile-app-development",
      description: "Build cross-platform mobile apps with React Native. Learn navigation, state management, API integration, and app deployment.",
      shortDescription: "Create mobile apps with React Native",
      price: 69.99,
      level: CourseLevel.INTERMEDIATE,
      categoryId: categories[2].id,
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    },
    {
      title: "UI/UX Design Fundamentals",
      slug: "ui-ux-design-fundamentals",
      description: "Learn the principles of user interface and user experience design. Master design tools, wireframing, prototyping, and user research.",
      shortDescription: "Master UI/UX design principles",
      price: 0,
      level: CourseLevel.BEGINNER,
      categoryId: categories[3].id,
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    },
  ];

  const createdCourses = [];
  for (const courseData of courses) {
    const course = await prisma.course.create({
      data: {
        ...courseData,
        instructorId: instructor.id,
        isPublished: true,
        isApproved: true,
      },
    });
    createdCourses.push(course);
  }

  // Create lessons for first course
  const lessons1 = [
    {
      title: "Introduction to Next.js 15",
      slug: "introduction-to-nextjs-15",
      description: "Get started with Next.js 15 and understand the new features",
      content: "<p>Welcome to Next.js 15! In this lesson, we'll cover the basics.</p>",
      type: LessonType.TEXT,
      order: 1,
      duration: 10,
      isFree: true,
    },
    {
      title: "App Router Deep Dive",
      slug: "app-router-deep-dive",
      description: "Learn about the App Router and its benefits",
      content: "<p>The App Router is the new routing system in Next.js 15.</p>",
      type: LessonType.TEXT,
      order: 2,
      duration: 15,
      isFree: false,
    },
    {
      title: "Server Components",
      slug: "server-components",
      description: "Understanding React Server Components",
      content: "<p>Server Components allow you to build faster applications.</p>",
      type: LessonType.TEXT,
      order: 3,
      duration: 20,
      isFree: false,
    },
  ];

  for (const lessonData of lessons1) {
    await prisma.lesson.create({
      data: {
        ...lessonData,
        courseId: createdCourses[0].id,
      },
    });
  }

  // Create quiz for first course
  const quiz1 = await prisma.quiz.create({
    data: {
      courseId: createdCourses[0].id,
      title: "Next.js 15 Fundamentals Quiz",
      description: "Test your knowledge of Next.js 15 basics",
      passingScore: 70,
      order: 1,
    },
  });

  const questions1 = [
    {
      question: "What is the default export format for Next.js 15?",
      type: QuestionType.MULTIPLE_CHOICE,
      options: ["CommonJS", "ES Modules", "AMD", "UMD"],
      correctAnswer: "1",
      points: 1,
      order: 1,
    },
    {
      question: "Server Components can use browser APIs like localStorage.",
      type: QuestionType.TRUE_FALSE,
      options: [],
      correctAnswer: "false",
      points: 1,
      order: 2,
    },
    {
      question: "What is the App Router?",
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        "A new routing system",
        "A database",
        "A CSS framework",
        "A testing library",
      ],
      correctAnswer: "0",
      points: 2,
      order: 3,
    },
  ];

  for (const questionData of questions1) {
    await prisma.question.create({
      data: {
        ...questionData,
        quizId: quiz1.id,
      },
    });
  }

  // Create lessons for free course
  const lessons2 = [
    {
      title: "Introduction to UI/UX Design",
      slug: "introduction-to-ui-ux-design",
      description: "Learn the basics of UI/UX design",
      content: "<p>UI/UX design is about creating great user experiences.</p>",
      type: LessonType.TEXT,
      order: 1,
      duration: 15,
      isFree: true,
    },
    {
      title: "Design Principles",
      slug: "design-principles",
      description: "Core principles of good design",
      content: "<p>Learn about balance, contrast, and hierarchy.</p>",
      type: LessonType.TEXT,
      order: 2,
      duration: 20,
      isFree: true,
    },
  ];

  for (const lessonData of lessons2) {
    await prisma.lesson.create({
      data: {
        ...lessonData,
        courseId: createdCourses[4].id,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
