import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus } from "lucide-react";
import { LessonList } from "@/components/instructor/lesson-list";

export default async function LessonsPage({
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
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    notFound();
  }

  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    redirect("/instructor/courses");
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Lessons</h1>
          <p className="text-muted-foreground">{course.title}</p>
        </div>
        <Button asChild>
          <Link href={`/instructor/courses/${course.id}/lessons/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Link>
        </Button>
      </div>

      <LessonList courseId={course.id} lessons={course.lessons} />
    </div>
  );
}
