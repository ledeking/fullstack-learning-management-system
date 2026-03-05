import { getCurrentUser } from "@/lib/auth";
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  await requireRole(UserRole.ADMIN);

  const users = await db.user.findMany({
    include: {
      _count: {
        select: {
          coursesCreated: true,
          enrollments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">User Management</h1>
        <p className="text-muted-foreground">
          Manage users and their roles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.imageUrl || undefined} />
                    <AvatarFallback>
                      {user.firstName?.[0] || user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {user.firstName || ""} {user.lastName || ""}
                      </h3>
                      <Badge variant="outline" className="capitalize">
                        {user.role.toLowerCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {user._count.coursesCreated} courses • {user._count.enrollments} enrollments
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
