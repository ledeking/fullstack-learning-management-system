import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseForm } from "@/components/instructor/course-form";

export default async function NewCoursePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Create New Course</h1>
        <p className="text-muted-foreground">
          Fill in the details to create your course
        </p>
      </div>

      <CourseForm categories={categories} />
    </div>
  );
}
