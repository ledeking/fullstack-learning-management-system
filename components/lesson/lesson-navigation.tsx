"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markLessonComplete } from "@/actions/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { Lesson } from "@prisma/client";

type LessonNavigationProps = {
  courseSlug: string;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
};

export function LessonNavigation({
  courseSlug,
  previousLesson,
  nextLesson,
  lessonId,
  courseId,
  isCompleted,
}: LessonNavigationProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await markLessonComplete(courseId, lessonId);
      setCompleted(true);
      toast.success("Lesson marked as complete!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to mark lesson as complete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t">
      <div>
        {previousLesson ? (
          <Button asChild variant="outline">
            <Link href={`/learn/${courseSlug}/${previousLesson.slug}`}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Lesson
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        {!completed && (
          <Button onClick={handleComplete} disabled={loading}>
            <CheckCircle className="h-4 w-4 mr-2" />
            {loading ? "Marking..." : "Mark as Complete"}
          </Button>
        )}
        {completed && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Completed</span>
          </div>
        )}

        {nextLesson ? (
          <Button asChild>
            <Link href={`/learn/${courseSlug}/${nextLesson.slug}`}>
              Next Lesson
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href={`/courses/${courseSlug}`}>Back to Course</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
