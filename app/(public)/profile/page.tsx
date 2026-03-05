import { getCurrentUser } from "@/lib/auth";
import { getEnrolledCourses } from "@/actions/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const courses = await getEnrolledCourses();

  if (!user) {
    return null;
  }

  const totalProgress =
    courses.length > 0
      ? courses.reduce((acc, course) => acc + course.progress, 0) / courses.length
      : 0;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Profile</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.imageUrl || undefined} />
                  <AvatarFallback>
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {user.firstName || ""} {user.lastName || ""}
                  </h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Progress</p>
                  <p className="text-2xl font-bold">{Math.round(totalProgress)}%</p>
                </div>
              </div>
              <Progress value={totalProgress} className="mt-4" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete courses to earn certificates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/my-courses"
                className="block text-sm text-primary hover:underline"
              >
                My Courses
              </a>
              <a
                href="/courses"
                className="block text-sm text-primary hover:underline"
              >
                Browse Courses
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
