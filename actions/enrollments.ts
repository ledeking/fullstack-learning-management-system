"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
});

export async function enrollInCourse(courseId: string) {
  const user = await requireAuth();

  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (!course.isPublished || !course.isApproved) {
    throw new Error("Course is not available");
  }

  // Check if already enrolled
  const existing = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (existing) {
    return { success: true, enrolled: true };
  }

  // Free course - enroll directly
  if (course.price === 0) {
    await db.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    });

    revalidatePath("/my-courses");
    revalidatePath(`/courses/${course.slug}`);

    return { success: true, enrolled: true };
  }

  // Paid course - create Stripe checkout
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.shortDescription || course.description,
          },
          unit_amount: Math.round(course.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?enrolled=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`,
    client_reference_id: `${user.id}:${course.id}`,
  });

  return { success: true, sessionId: session.id, enrolled: false };
}

export async function checkEnrollment(courseId: string) {
  const user = await requireAuth();

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
  });

  return { enrolled: !!enrollment };
}
