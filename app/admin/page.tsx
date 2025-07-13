import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import Link from "next/link";
import SectionTitle from "../_components/common/SectionTitle";
import SignOutButton from "./_components/SignOutButton";

const AdminPage = () => {
  return (
    <>
      <SectionTitle
        section="Admin Dashboard"
        description="Manage your portfolio and projects"
      />

      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
