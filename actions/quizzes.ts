"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitQuiz(
  quizId: string,
  answers: Record<string, string>
) {
  const user = await requireAuth();

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      course: true,
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: quiz.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new Error("Not enrolled in this course");
  }

  // Calculate score
  let correctAnswers = 0;
  let totalPoints = 0;
  let earnedPoints = 0;

  quiz.questions.forEach((question) => {
    totalPoints += question.points;
    const userAnswer = answers[question.id];
    if (userAnswer === question.correctAnswer) {
      correctAnswers++;
      earnedPoints += question.points;
    }
  });

  const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const passed = score >= quiz.passingScore;

  // Save submission
  await db.quizSubmission.create({
    data: {
      userId: user.id,
      quizId: quiz.id,
      answers: answers as any,
      score,
      passed,
    },
  });

  revalidatePath(`/quiz/${quiz.course.slug}/${quiz.id}`);

  return {
    success: true,
    score,
    passed,
    correctAnswers,
    totalQuestions: quiz.questions.length,
  };
}

export async function getQuiz(quizId: string) {
  const user = await requireAuth();

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      course: true,
    },
  });

  if (!quiz) {
    return null;
  }

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: quiz.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new Error("Not enrolled in this course");
  }

  // Get previous submission if any
  const previousSubmission = await db.quizSubmission.findFirst({
    where: {
      userId: user.id,
      quizId: quiz.id,
    },
    orderBy: { submittedAt: "desc" },
  });

  return {
    quiz,
    previousSubmission,
  };
}
