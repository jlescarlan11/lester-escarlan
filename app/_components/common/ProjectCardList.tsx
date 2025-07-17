"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { LuPlus } from "react-icons/lu";
import { useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import OverflowBadges from "./OverflowBadges";

export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link: string;
  status: "featured" | "archived";
  preview: string | null;
  createdAt: string;
  updatedAt: string;
};

interface ProjectCardListProps {
  data: Project[];
  showActions?: boolean;
  onDelete?: (projectId: string, projectTitle: string) => void;
  showViewAction?: boolean;
  showAddButton?: boolean;
  addButtonHref?: string;
  addButtonText?: string;
  pageSize?: number;
}

const ProjectCardList = ({
  data,
  showActions = false,
  onDelete,
  showViewAction = false,
  showAddButton = false,
  addButtonHref = "/admin/project/create",
  addButtonText = "Add Project",
  pageSize = 5,
}: ProjectCardListProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredProjects = React.useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query))
    );
  }, [data, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = Number((e.target as HTMLInputElement).value);
      if (!isNaN(val) && val >= 1 && val <= totalPages) {
        handlePageChange(val - 1);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    }
  };

  const renderPageButton = (page: number, isActive: boolean) => (
    <Button
      key={page}
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={() => handlePageChange(page)}
      className="w-12"
    >
      {page + 1}
    </Button>
  );

  const renderPageInput = () => (
    <input
      key="input"
      ref={inputRef}
      type="number"
      min={1}
      max={totalPages}
      placeholder="Page"
      className="w-16 text-center border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      onKeyDown={handlePageInput}
    />
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const lastPage = totalPages - 1;

    if (totalPages <= 3) {
      // Simple cases: 1-3 pages, show all
      for (let i = 0; i < totalPages; i++) {
        buttons.push(renderPageButton(i, currentPage === i));
      }
    } else if (totalPages === 4) {
      // 4-page logic with specific requirements
      const pageConfigs = [
        [0, 1, 2, "input", 3], // Page 1: [1 h] [2] [3] [input] [4]
        [0, 1, 2, "input", 3], // Page 2: [1] [2 h] [3] [input] [4]
        [1, 2, 3, "input"], // Page 3: [2] [3 h] [4] [input]
        [1, 2, 3, "input"], // Page 4: [2] [3] [4 h] [input]
      ];

      pageConfigs[currentPage].forEach((item) => {
        if (item === "input") {
          buttons.push(renderPageInput());
        } else {
          buttons.push(renderPageButton(item as number, currentPage === item));
        }
      });
    } else {
      // More than 4 pages, always 5 boxes
      if (currentPage <= 1) {
        // [1/2] [2/3] [3] [input] [last]
        buttons.push(renderPageButton(0, currentPage === 0));
        buttons.push(renderPageButton(1, currentPage === 1));
        buttons.push(renderPageButton(2, currentPage === 2));
        buttons.push(renderPageInput());
        if (2 < lastPage) buttons.push(renderPageButton(lastPage, false));
      } else if (currentPage >= lastPage - 1) {
        // [last-2] [last-1] [last] [input]
        buttons.push(
          renderPageButton(lastPage - 2, currentPage === lastPage - 2)
        );
        buttons.push(
          renderPageButton(lastPage - 1, currentPage === lastPage - 1)
        );
        buttons.push(renderPageButton(lastPage, currentPage === lastPage));
        buttons.push(renderPageInput());
      } else {
        // [current-1] [current] [current+1] [input] [last]
        buttons.push(renderPageButton(currentPage - 1, false));
        buttons.push(renderPageButton(currentPage, true));
        buttons.push(renderPageButton(currentPage + 1, false));
        buttons.push(renderPageInput());
        if (currentPage + 1 < lastPage) {
          buttons.push(renderPageButton(lastPage, false));
        }
      }
    }

    return buttons;
  };

  const renderProjectActions = (project: Project) => (
    <div className="flex items-center gap-2 md:justify-end mt-2 md:mt-0">
      {showViewAction && (
        <Link href={`/project/${project.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      )}
      {project.link && (
        <Link href={project.link} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            View App
          </Button>
        </Link>
      )}
      {showActions && onDelete && (
        <>
          <Link href={`/admin/project/edit/${project.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(project.id, project.title)}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Search and Add Button Header */}
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative max-w-sm min-w-full sm:min-w-fit">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {showAddButton && (
            <Link href={addButtonHref}>
              <Button>
                <LuPlus className="mr-2 h-4 w-4" />
                {addButtonText}
              </Button>
            </Link>
          )}
        </div>

        {/* Active Search Filter */}
        {searchQuery && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            <Badge variant="secondary" className="text-xs">
              Search: &quot;{searchQuery}&quot;
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 text-xs hover:bg-transparent"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ×
              </Button>
            </Badge>
          </div>
        )}
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {paginatedProjects.length > 0 ? (
          paginatedProjects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-row items-stretch p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="hidden sm:block sm:w-24 sm:h-24 flex-shrink-0 relative bg-muted">
                <Image
                  src={project.preview || "/alliance-logo.svg"}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 128px"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col sm:flex-row justify-center px-4 py-4 min-w-0 gap-2">
                <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
                  <h3
                    className="font-semibold text-lg truncate"
                    title={project.title}
                  >
                    {project.title}
                  </h3>
                  <OverflowBadges technologies={project.technologies} />
                </div>
                {renderProjectActions(project)}
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery
              ? "No projects match your search."
              : "No projects found."}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-start items-center gap-2 mt-6">
          {renderPaginationButtons()}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground py-4 mt-4">
        {filteredProjects.length} project
        {filteredProjects.length !== 1 ? "s" : ""} total
        {searchQuery &&
          filteredProjects.length !== data.length &&
          ` (filtered from ${data.length})`}
      </div>
    </>
  );
};

ProjectCardList.displayName = "ProjectCardList";
export { ProjectCardList };
