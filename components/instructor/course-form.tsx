"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCourse, updateCourse } from "@/actions/courses";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { Category } from "@prisma/client";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  price: z.number().min(0),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  categoryId: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
});

type CourseFormProps = {
  categories: Category[];
  course?: {
    id: string;
    title: string;
    description: string;
    shortDescription: string | null;
    price: number;
    level: string;
    categoryId: string | null;
    thumbnail: string | null;
  };
};

export function CourseForm({ categories, course }: CourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          title: course.title,
          description: course.description,
          shortDescription: course.shortDescription || "",
          price: course.price,
          level: course.level as any,
          categoryId: course.categoryId || "",
          thumbnail: course.thumbnail || "",
        }
      : {
          title: "",
          description: "",
          shortDescription: "",
          price: 0,
          level: "BEGINNER",
          categoryId: "",
          thumbnail: "",
        },
  });

  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    setLoading(true);
    try {
      if (course) {
        await updateCourse(course.id, data);
        toast.success("Course updated successfully!");
      } else {
        await createCourse(data);
        toast.success("Course created successfully!");
      }
      router.push("/instructor/courses");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{course ? "Edit Course" : "Course Details"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter course title"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              {...register("shortDescription")}
              placeholder="Brief description (max 500 characters)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="description">Full Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Detailed course description"
              rows={6}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="level">Level *</Label>
              <Select
                value={watch("level")}
                onValueChange={(value) => setValue("level", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select
              value={watch("categoryId") || ""}
              onValueChange={(value) => setValue("categoryId", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              {...register("thumbnail")}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
            {errors.thumbnail && (
              <p className="text-sm text-red-500 mt-1">{errors.thumbnail.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : course ? "Update Course" : "Create Course"}
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
