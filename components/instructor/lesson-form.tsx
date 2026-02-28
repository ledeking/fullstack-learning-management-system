"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createLesson, updateLesson } from "@/actions/lessons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  type: z.enum(["VIDEO", "TEXT"]),
  order: z.number().min(0),
  duration: z.number().min(0).optional(),
  isFree: z.boolean(),
});

type LessonFormProps = {
  courseId: string;
  defaultOrder: number;
  lesson?: {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    videoUrl: string | null;
    type: string;
    order: number;
    duration: number | null;
    isFree: boolean;
  };
};

export function LessonForm({ courseId, defaultOrder, lesson }: LessonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: lesson
      ? {
          title: lesson.title,
          description: lesson.description || "",
          content: lesson.content || "",
          videoUrl: lesson.videoUrl || "",
          type: lesson.type as any,
          order: lesson.order,
          duration: lesson.duration || undefined,
          isFree: lesson.isFree,
        }
      : {
          title: "",
          description: "",
          content: "",
          videoUrl: "",
          type: "VIDEO",
          order: defaultOrder,
          duration: undefined,
          isFree: false,
        },
  });

  const onSubmit = async (data: z.infer<typeof lessonSchema>) => {
    setLoading(true);
    try {
      if (lesson) {
        await updateLesson(lesson.id, data);
        toast.success("Lesson updated successfully!");
      } else {
        await createLesson(courseId, data);
        toast.success("Lesson created successfully!");
      }
      router.push(`/instructor/courses/${courseId}/lessons`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{lesson ? "Edit Lesson" : "Lesson Details"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Lesson Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter lesson title"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="type">Lesson Type *</Label>
            <Select
              value={watch("type")}
              onValueChange={(value) => setValue("type", value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="TEXT">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {watch("type") === "VIDEO" && (
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                {...register("videoUrl")}
                placeholder="https://example.com/video.mp4"
                type="url"
              />
              {errors.videoUrl && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.videoUrl.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of the lesson"
              rows={3}
            />
          </div>

          {watch("type") === "TEXT" && (
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                {...register("content")}
                placeholder="Lesson content (HTML supported)"
                rows={10}
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                {...register("order", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                {...register("duration", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFree"
              checked={watch("isFree")}
              onCheckedChange={(checked) => setValue("isFree", checked as boolean)}
            />
            <Label htmlFor="isFree" className="cursor-pointer">
              This lesson is free to preview
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : lesson ? "Update Lesson" : "Create Lesson"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
