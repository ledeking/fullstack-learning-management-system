import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { LessonForm } from "@/components/instructor/lesson-form";

export default async function EditLessonPage({
  params,
}: {
  params: { id: string; lessonId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId },
    include: { course: true },
  });

  if (!lesson) {
    notFound();
  }

  if (lesson.course.instructorId !== user.id && user.role !== "ADMIN") {
    redirect("/instructor/courses");
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Edit Lesson</h1>
        <p className="text-muted-foreground">{lesson.course.title}</p>
      </div>

      <LessonForm
        courseId={lesson.courseId}
        defaultOrder={lesson.order}
        lesson={{
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          type: lesson.type,
          order: lesson.order,
          duration: lesson.duration,
          isFree: lesson.isFree,
        }}
      />
    </div>
  );
}
