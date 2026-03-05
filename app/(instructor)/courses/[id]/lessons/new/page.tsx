import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { LessonForm } from "@/components/instructor/lesson-form";

export default async function NewLessonPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      lessons: {
        orderBy: { order: "desc" },
        take: 1,
      },
    },
  });

  if (!course) redirect("/instructor/courses");
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    redirect("/instructor/courses");
  }

  const nextOrder = course.lessons[0]?.order ? course.lessons[0].order + 1 : 1;

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Add New Lesson</h1>
        <p className="text-muted-foreground">{course.title}</p>
      </div>

      <LessonForm courseId={course.id} defaultOrder={nextOrder} />
    </div>
  );
}
