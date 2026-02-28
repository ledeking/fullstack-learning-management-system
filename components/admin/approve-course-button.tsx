"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCourse } from "@/actions/courses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ApproveCourseButtonProps = {
  courseId: string;
};

export function ApproveCourseButton({ courseId }: ApproveCourseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await updateCourse(courseId, { isApproved: true, isPublished: true });
      toast.success("Course approved successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleApprove} disabled={loading} size="sm">
      {loading ? "Approving..." : "Approve"}
    </Button>
  );
}
