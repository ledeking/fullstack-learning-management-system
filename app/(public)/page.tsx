import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";
import { CourseCard } from "@/components/course/course-card";

export default async function HomePage() {
  const featuredCourses = await db.course.findMany({
    where: {
      isPublished: true,
      isApproved: true,
    },
    include: {
      instructor: true,
      category: true,
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Learn Anything, Anytime
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Discover thousands of courses from expert instructors. Start your
            learning journey today.
          </p>
          <div className="flex gap-4 mt-4">
            <Button asChild size="lg">
              <Link href="/courses">Browse Courses</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/courses">Start Learning</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Expert Instructors</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Learn from industry professionals with years of experience.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Interactive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Engage with quizzes, assignments, and hands-on projects.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Earn certificates upon course completion to showcase your skills.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your learning journey with detailed progress tracking.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container py-12 md:py-20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Courses</h2>
              <p className="text-muted-foreground">
                Handpicked courses to get you started
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/courses">View All</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
