"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import { Video, FileText, Trash2 } from "lucide-react";
import { deleteLesson } from "@/actions/lessons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Lesson } from "@prisma/client";

type LessonListProps = {
  courseId: string;
  lessons: Lesson[];
};

export function LessonList({ courseId, lessons }: LessonListProps) {
  const router = useRouter();

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      await deleteLesson(lessonId);
      toast.success("Lesson deleted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete lesson");
    }
  };

  if (lessons.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No lessons yet</p>
          <Button asChild>
            <Link href={`/instructor/courses/${courseId}/lessons/new`}>
              Add Your First Lesson
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson, index) => (
        <Card key={lesson.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {lesson.type === "VIDEO" ? (
                      <Video className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold">{lesson.title}</h3>
                    {lesson.isFree && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Free
                      </span>
                    )}
                  </div>
                  {lesson.duration && (
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(lesson.duration)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/instructor/courses/${courseId}/lessons/${lesson.id}/edit`}>
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(lesson.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
