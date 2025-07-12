import Breadcrumbs from "../_components/common/Breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import SignOutButton from "./_components/SignOutButton";

const AdminPage = () => {
  return (
    <>
      <div>
        <Breadcrumbs />
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="max-w-md hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/admin/project">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>
                    Create, edit, and manage your portfolio projects
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add new projects, update existing ones, and organize your
                portfolio with ease.
              </p>
              <Button className="w-full">Manage Projects</Button>
            </CardContent>
          </Link>
        </Card>
        <SignOutButton />
      </div>
    </>
  );
};

export default AdminPage;
