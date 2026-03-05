import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default async function InstructorCoursesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const courses = await db.course.findMany({
    where: { instructorId: user.id },
    include: {
      category: true,
      _count: {
        select: {
          enrollments: true,
          lessons: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">My Courses</h1>
          <p className="text-muted-foreground">
            Create and manage your courses
          </p>
        </div>
        <Button asChild>
          <Link href="/instructor/courses/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No courses yet</p>
            <Button asChild>
              <Link href="/instructor/courses/new">Create Your First Course</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{course._count.lessons} lessons</span>
                  <span>•</span>
                  <span>{course._count.enrollments} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      course.isPublished && course.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.isPublished && course.isApproved
                      ? "Published"
                      : "Draft"}
                  </span>
                  {course.category && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      {course.category.name}
                    </span>
                  )}
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/instructor/courses/${course.id}`}>
                    Edit Course
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
