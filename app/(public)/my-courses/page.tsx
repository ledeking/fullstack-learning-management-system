import { getEnrolledCourses } from "@/actions/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export default async function MyCoursesPage() {
  const courses = await getEnrolledCourses();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">My Courses</h1>
        <p className="text-muted-foreground">
          Continue your learning journey
        </p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">
              Start learning by enrolling in a course
            </p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <Link href={`/courses/${course.slug}`}>
                <div className="relative aspect-video w-full overflow-hidden">
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
              </Link>
              <CardHeader>
                <Link href={`/courses/${course.slug}`}>
                  <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                </Link>
                <CardDescription>
                  {course.shortDescription || course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">
                      {Math.round(course.progress)}%
                    </span>
                  </div>
                  <Progress value={course.progress} />
                  <p className="text-sm text-muted-foreground">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link
                    href={`/learn/${course.slug}/${course.lessons[0]?.slug || ""}`}
                  >
                    Continue Learning
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
