"use server";

import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createLesson(
  courseId: string,
  data: {
    title: string;
    description?: string;
    content?: string;
    videoUrl?: string;
    type: string;
    order: number;
    duration?: number;
    isFree: boolean;
  }
) {
  const user = await requireAuth();
  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.instructorId !== user.id && user.role !== UserRole.ADMIN) {
    throw new Error("Unauthorized");
  }

  const lesson = await db.lesson.create({
    data: {
      courseId,
      title: data.title,
      slug: slugify(data.title),
      description: data.description || null,
      content: data.content || null,
      videoUrl: data.videoUrl || null,
      type: data.type as any,
      order: data.order,
      duration: data.duration || null,
      isFree: data.isFree,
    },
  });

  revalidatePath(`/instructor/courses/${courseId}/lessons`);

  return lesson;
}

export async function updateLesson(
  lessonId: string,
  data: {
    title?: string;
    description?: string;
    content?: string;
    videoUrl?: string;
    type?: string;
    order?: number;
    duration?: number;
    isFree?: boolean;
  }
) {
  const user = await requireAuth();
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  if (
    lesson.course.instructorId !== user.id &&
    user.role !== UserRole.ADMIN
  ) {
    throw new Error("Unauthorized");
  }

  const updateData: any = { ...data };
  if (data.title && data.title !== lesson.title) {
    updateData.slug = slugify(data.title);
  }

  const updated = await db.lesson.update({
    where: { id: lessonId },
    data: updateData,
  });

  revalidatePath(`/instructor/courses/${lesson.courseId}/lessons`);

  return updated;
}

export async function deleteLesson(lessonId: string) {
  const user = await requireAuth();
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  if (
    lesson.course.instructorId !== user.id &&
    user.role !== UserRole.ADMIN
  ) {
    throw new Error("Unauthorized");
  }

  await db.lesson.delete({
    where: { id: lessonId },
  });

  revalidatePath(`/instructor/courses/${lesson.courseId}/lessons`);

  return { success: true };
}

export async function getLesson(courseSlug: string, lessonSlug: string) {
  const user = await requireAuth();

  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    return null;
  }

  const lesson = course.lessons.find((l) => l.slug === lessonSlug);

  if (!lesson) {
    return null;
  }

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (!enrollment && !lesson.isFree) {
    throw new Error("Not enrolled in this course");
  }

  const currentIndex = course.lessons.findIndex((l) => l.id === lesson.id);
  const previousLesson =
    currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < course.lessons.length - 1
      ? course.lessons[currentIndex + 1]
      : null;

  const isCompleted = await db.progress.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: lesson.id,
      },
    },
  });

  return {
    course,
    lesson,
    previousLesson,
    nextLesson,
    isCompleted: !!isCompleted,
  };
}
