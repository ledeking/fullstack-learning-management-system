import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { User, Clock } from "lucide-react";
import type { Course } from "@prisma/client";

type CourseCardProps = {
  course: Course & {
    instructor: { firstName: string | null; lastName: string | null };
    category: { name: string } | null;
    _count: { enrollments: number };
  };
};

export function CourseCard({ course }: CourseCardProps) {
  const instructorName = course.instructor.firstName || course.instructor.lastName
    ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim()
    : "Instructor";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
            {course.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.shortDescription || course.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{instructorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course._count.enrollments} students</span>
          </div>
        </div>
        {course.category && (
          <div className="mt-2">
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              {course.category.name}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-lg font-bold">
          {course.price === 0 ? "Free" : formatPrice(course.price)}
        </span>
        <Button asChild size="sm">
          <Link href={`/courses/${course.slug}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
