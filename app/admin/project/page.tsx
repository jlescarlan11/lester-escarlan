import Breadcrumbs from "@/app/_components/common/Breadcrumbs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";

const AdminProjectPage = () => {
  return (
    <div>
      <div>
        <Breadcrumbs />
      </div>
      <header>
        <h1>Project Management</h1>
      </header>
      <div>
        <Link href="/admin/project/create">
          <Button variant="default">
            <LuPlus />
          </Button>
        </Link>
        {/* <Dialog>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="project-title">Project Title</Label>
                <Input
                  type="text"
                  id="project-title"
                  name="project-title"
                  placeholder="Title"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea
                  id="project-description"
                  name="project-description"
                  placeholder="Description"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="project-link">Project Link</Label>
                <Input
                  type="url"
                  id="project-link"
                  name="project-link"
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="project-link">Project Link</Label>
                <Input
                  type="text"
                  id="project-link"
                  name="project-link"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
};

export default AdminProjectPage;
