import { notFound } from "next/navigation";
import { getLesson } from "@/actions/lessons";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { LessonNavigation } from "@/components/lesson/lesson-navigation";
import { Card } from "@/components/ui/card";

export default async function LessonPage({
  params,
}: {
  params: { courseSlug: string; lessonSlug: string };
}) {
  const data = await getLesson(params.courseSlug, params.lessonSlug);

  if (!data) {
    notFound();
  }

  const { course, lesson, previousLesson, nextLesson, isCompleted } = data;

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
            <p className="text-muted-foreground">{course.title}</p>
          </div>

          <Card className="mb-6">
            <LessonPlayer lesson={lesson} />
          </Card>

          {lesson.description && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">About this lesson</h2>
              <div className="prose max-w-none">
                <p>{lesson.description}</p>
              </div>
            </Card>
          )}

          {lesson.content && (
            <Card className="p-6 mt-6">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </Card>
          )}

          <LessonNavigation
            courseSlug={course.slug}
            previousLesson={previousLesson}
            nextLesson={nextLesson}
            lessonId={lesson.id}
            courseId={course.id}
            isCompleted={isCompleted}
          />
        </div>

        <aside>
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Course Content</h3>
            <div className="space-y-2">
              {course.lessons.map((l, index) => (
                <div
                  key={l.id}
                  className={`p-2 rounded ${
                    l.id === lesson.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <a
                    href={`/learn/${course.slug}/${l.slug}`}
                    className="text-sm"
                  >
                    {index + 1}. {l.title}
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
