import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCourseBySlug } from "@/actions/courses";
import { checkEnrollment } from "@/actions/enrollments";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, formatDuration } from "@/lib/utils";
import { BookOpen, Clock, User, CheckCircle } from "lucide-react";
import { EnrollButton } from "@/components/course/enroll-button";

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const user = await getCurrentUser();
  const enrollment = user
    ? await checkEnrollment(course.id)
    : { enrolled: false };

  const totalDuration = course.lessons.reduce(
    (acc, lesson) => acc + (lesson.duration || 0),
    0
  );

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative aspect-video w-full mb-6 rounded-lg overflow-hidden">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="prose max-w-none">
                <p className="text-lg">{course.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="curriculum" className="mt-4">
              <div className="space-y-4">
                {course.lessons.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Lessons</h3>
                    <div className="space-y-2">
                      {course.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <span className="text-sm text-muted-foreground">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">{lesson.title}</p>
                            {lesson.duration && (
                              <p className="text-sm text-muted-foreground">
                                {formatDuration(lesson.duration)}
                              </p>
                            )}
                          </div>
                          {lesson.isFree && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Free
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {course.quizzes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Quizzes</h3>
                    <div className="space-y-2">
                      {course.quizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <BookOpen className="h-5 w-5" />
                          <div className="flex-1">
                            <p className="font-medium">{quiz.title}</p>
                            {quiz.description && (
                              <p className="text-sm text-muted-foreground">
                                {quiz.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="instructor" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle>
                        {course.instructor.firstName || ""}{" "}
                        {course.instructor.lastName || ""}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Instructor
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <div className="text-3xl font-bold">
                {course.price === 0 ? "Free" : formatPrice(course.price)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{course.lessons.length} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{course._count.enrollments} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{course.level}</span>
                </div>
              </div>

              {enrollment.enrolled ? (
                <Button asChild className="w-full">
                  <Link href={`/learn/${course.slug}/${course.lessons[0]?.slug || ""}`}>
                    Continue Learning
                  </Link>
                </Button>
              ) : (
                <EnrollButton courseId={course.id} price={course.price} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
