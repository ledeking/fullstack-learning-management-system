import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function QuizzesPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      quizzes: {
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
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
          <h1 className="text-4xl font-bold mb-4">Quizzes</h1>
          <p className="text-muted-foreground">{course.title}</p>
        </div>
        <Button asChild>
          <Link href={`/instructor/courses/${course.id}/quizzes/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Quiz
          </Link>
        </Button>
      </div>

      {course.quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No quizzes yet</p>
            <Button asChild>
              <Link href={`/instructor/courses/${course.id}/quizzes/new`}>
                Add Your First Quiz
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {course.quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{quiz.title}</h3>
                    {quiz.description && (
                      <p className="text-sm text-muted-foreground">
                        {quiz.description}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {quiz._count.questions} questions • Passing: {quiz.passingScore}%
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/instructor/courses/${course.id}/quizzes/${quiz.id}`}>
                      Manage
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
