import { getCurrentUser } from "@/lib/auth";
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApproveCourseButton } from "@/components/admin/approve-course-button";

export default async function AdminCoursesPage() {
  await requireRole(UserRole.ADMIN);

  const courses = await db.course.findMany({
    include: {
      instructor: true,
      category: true,
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const pendingCourses = courses.filter((c) => !c.isApproved);
  const approvedCourses = courses.filter((c) => c.isApproved);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Course Management</h1>
        <p className="text-muted-foreground">
          Approve and manage courses
        </p>
      </div>

      {pendingCourses.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Approval ({pendingCourses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      by {course.instructor.firstName} {course.instructor.lastName} • {course._count.enrollments} enrollments
                    </p>
                  </div>
                  <ApproveCourseButton courseId={course.id} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Courses ({approvedCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvedCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {course.instructor.firstName} {course.instructor.lastName} • {course._count.enrollments} enrollments
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a href={`/courses/${course.slug}`}>View</a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
