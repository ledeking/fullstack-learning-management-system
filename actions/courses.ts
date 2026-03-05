"use server";

import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createCourse(data: {
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  level: string;
  categoryId?: string;
  thumbnail?: string;
}) {
  const user = await requireRole(UserRole.INSTRUCTOR);

  const course = await db.course.create({
    data: {
      title: data.title,
      slug: slugify(data.title),
      description: data.description,
      shortDescription: data.shortDescription,
      price: data.price,
      level: data.level as any,
      categoryId: data.categoryId || null,
      thumbnail: data.thumbnail || null,
      instructorId: user.id,
      isPublished: false,
      isApproved: false,
    },
  });

  revalidatePath("/courses");
  revalidatePath("/instructor/courses");

  return course;
}

export async function updateCourse(
  courseId: string,
  data: {
    title?: string;
    description?: string;
    shortDescription?: string;
    price?: number;
    level?: string;
    categoryId?: string;
    thumbnail?: string;
    isPublished?: boolean;
  }
) {
  const user = await requireAuth();
  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (
    course.instructorId !== user.id &&
    user.role !== UserRole.ADMIN
  ) {
    throw new Error("Unauthorized");
  }

  const updateData: any = { ...data };
  if (data.title && data.title !== course.title) {
    updateData.slug = slugify(data.title);
  }

  const updated = await db.course.update({
    where: { id: courseId },
    data: updateData,
  });

  revalidatePath("/courses");
  revalidatePath(`/courses/${course.slug}`);
  revalidatePath("/instructor/courses");

  return updated;
}

export async function deleteCourse(courseId: string) {
  const user = await requireAuth();
  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (
    course.instructorId !== user.id &&
    user.role !== UserRole.ADMIN
  ) {
    throw new Error("Unauthorized");
  }

  await db.course.delete({
    where: { id: courseId },
  });

  revalidatePath("/courses");
  revalidatePath("/instructor/courses");

  return { success: true };
}

export async function getCourseBySlug(slug: string) {
  const course = await db.course.findUnique({
    where: { slug },
    include: {
      instructor: true,
      category: true,
      lessons: {
        orderBy: { order: "asc" },
      },
      quizzes: {
        orderBy: { order: "asc" },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  return course;
}
