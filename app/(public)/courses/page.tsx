import { db } from "@/lib/db";
import { CourseCard } from "@/components/course/course-card";
import { CourseFilters } from "@/components/course/course-filters";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SearchParams = {
  search?: string;
  category?: string;
  level?: string;
  sort?: string;
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { search, category, level, sort } = searchParams;

  const where: any = {
    isPublished: true,
    isApproved: true,
  };

  if (category) {
    where.category = { slug: category };
  }

  if (level) {
    where.level = level;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy.price = "asc";
  if (sort === "price-desc") orderBy.price = "desc";
  if (sort === "popular") orderBy.enrollments = { _count: "desc" };

  const [courses, categories] = await Promise.all([
    db.course.findMany({
      where,
      include: {
        instructor: true,
        category: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy,
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Courses</h1>
        <p className="text-muted-foreground">
          Discover courses that match your interests
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <CourseFilters categories={categories} />
        </aside>

        <div className="flex-1">
          <div className="mb-6">
            <form action="/courses" method="get" className="relative">
              <Input
                name="search"
                placeholder="Search courses..."
                defaultValue={search}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
