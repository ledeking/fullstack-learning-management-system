"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(courseId: string, lessonId: string) {
  const user = await requireAuth();

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
  });

  if (!enrollment) {
    throw new Error("Not enrolled in this course");
  }

  // Check if already completed
  const existing = await db.progress.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
  });

  if (existing) {
    return { success: true };
  }

  await db.progress.create({
    data: {
      userId: user.id,
      courseId,
      lessonId,
    },
  });

  revalidatePath(`/learn/${courseId}`);
  revalidatePath("/my-courses");

  return { success: true };
}

export async function getCourseProgress(courseId: string) {
  const user = await requireAuth();

  const [enrollment, completedLessons, totalLessons] = await Promise.all([
    db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    }),
    db.progress.count({
      where: {
        userId: user.id,
        courseId,
        lessonId: { not: null },
      },
    }),
    db.lesson.count({
      where: { courseId },
    }),
  ]);

  if (!enrollment) {
    return null;
  }

  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return {
    enrolled: true,
    progress,
    completedLessons,
    totalLessons,
  };
}

export async function getEnrolledCourses() {
  const user = await requireAuth();

  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          instructor: true,
          category: true,
          lessons: true,
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const coursesWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const completedLessons = await db.progress.count({
        where: {
          userId: user.id,
          courseId: enrollment.courseId,
          lessonId: { not: null },
        },
      });

      const progress =
        enrollment.course._count.lessons > 0
          ? (completedLessons / enrollment.course._count.lessons) * 100
          : 0;

      return {
        ...enrollment.course,
        progress,
        completedLessons,
        totalLessons: enrollment.course._count.lessons,
      };
    })
  );

  return coursesWithProgress;
}
