import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseForm } from "@/components/instructor/course-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteCourse } from "@/actions/courses";
import { DeleteCourseButton } from "@/components/instructor/delete-course-button";

export default async function EditCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      lessons: {
        orderBy: { order: "asc" },
      },
      quizzes: {
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

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Edit Course</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CourseForm
            course={{
              id: course.id,
              title: course.title,
              description: course.description,
              shortDescription: course.shortDescription,
              price: course.price,
              level: course.level,
              categoryId: course.categoryId,
              thumbnail: course.thumbnail,
            }}
            categories={categories}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Lessons ({course.lessons.length})</h3>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/instructor/courses/${course.id}/lessons`}>
                    Manage Lessons
                  </Link>
                </Button>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quizzes ({course.quizzes.length})</h3>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/instructor/courses/${course.id}/quizzes`}>
                    Manage Quizzes
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <DeleteCourseButton courseId={course.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
