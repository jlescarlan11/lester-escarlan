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

  // Memoized filtered data
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const startIndex = currentPage * pageSize;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + pageSize
  );

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  // Helper for pagination input clearing
  function clearInput(ref: React.RefObject<HTMLInputElement>) {
    if (ref.current) ref.current.value = "";
  }

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

  if (totalPages <= 1) {
    return (
      <>
        {/* Search and Add Button Header */}
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative max-w-sm">
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
                {/* Project Image */}
                <div className="hidden sm:block sm:w-24 sm:h-24 flex-shrink-0 relative bg-muted">
                  <Image
                    src={project.preview || "/alliance-logo.svg"}
                    alt={`${project.title} preview`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                </div>

                {/* Project Content */}
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
  }

  return (
    <>
      {/* Search and Add Button Header */}
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative max-w-sm">
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
              {/* Project Image */}
              <div className="hidden sm:block sm:w-24 sm:h-24 flex-shrink-0 relative bg-muted">
                <Image
                  src={project.preview || "/alliance-logo.svg"}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 128px"
                />
              </div>

              {/* Project Content */}
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
      <div className="flex justify-start items-center gap-2 mt-6">
        {(() => {
          const pageButtons = [];
          const showInput = totalPages > 3;
          const lastPage = totalPages - 1;
          // Helper to render a page button
          const renderPageBtn = (page: number, highlight = false) => (
            <Button
              key={page}
              variant={highlight ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-12"
            >
              {page + 1}
            </Button>
          );

          if (totalPages <= 1) {
            // Only one page, show [1] [input]
            pageButtons.push(renderPageBtn(0));
            if (showInput) {
              pageButtons.push(
                <input
                  key="input"
                  ref={inputRef}
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="Page"
                  className="w-16 text-center border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = Number((e.target as HTMLInputElement).value);
                      if (!isNaN(val) && val >= 1 && val <= totalPages) {
                        handlePageChange(val - 1);
                        clearInput(
                          inputRef as React.RefObject<HTMLInputElement>
                        );
                      }
                    }
                  }}
                />
              );
            }
          } else if (totalPages === 2) {
            // [1] [2] [input]
            pageButtons.push(renderPageBtn(0));
            pageButtons.push(renderPageBtn(1));
            if (showInput) {
              pageButtons.push(
                <input
                  key="input"
                  ref={inputRef}
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="Page"
                  className="w-16 text-center border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = Number((e.target as HTMLInputElement).value);
                      if (!isNaN(val) && val >= 1 && val <= totalPages) {
                        handlePageChange(val - 1);
                        clearInput(
                          inputRef as React.RefObject<HTMLInputElement>
                        );
                      }
                    }
                  }}
                />
              );
            }
          } else if (totalPages === 3) {
            // [1] [2] [3] [input]
            for (let i = 0; i < 3; i++) pageButtons.push(renderPageBtn(i));
            if (showInput) {
              pageButtons.push(
                <input
                  key="input"
                  ref={inputRef}
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="Page"
                  className="w-16 text-center border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = Number((e.target as HTMLInputElement).value);
                      if (!isNaN(val) && val >= 1 && val <= totalPages) {
                        handlePageChange(val - 1);
                        clearInput(
                          inputRef as React.RefObject<HTMLInputElement>
                        );
                      }
                    }
                  }}
                />
              );
            }
          } else {
            // 4+ pages
            if (currentPage <= 1) {
              // [1 (highlighted)] [2] [3] [input] [last] (page 1)
              // [1] [2 (highlighted)] [3] [input] [last] (page 2)
              pageButtons.push(renderPageBtn(0, currentPage === 0));
              pageButtons.push(renderPageBtn(1, currentPage === 1));
              pageButtons.push(renderPageBtn(2, false));
              pageButtons.push(
                <input
                  key="input"
                  ref={inputRef}
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="Page"
                  className="w-16 text-center border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = Number((e.target as HTMLInputElement).value);
                      if (!isNaN(val) && val >= 1 && val <= totalPages) {
                        handlePageChange(val - 1);
                        clearInput(
                          inputRef as React.RefObject<HTMLInputElement>
                        );
                      }
                    }
                  }}
                />
              );
              if (lastPage > 2) {
                pageButtons.push(renderPageBtn(lastPage, false));
              }
            } else if (currentPage === lastPage) {
              // [last-2] [last-1] [last (highlighted)] [input]
              pageButtons.push(renderPageBtn(lastPage - 2, false));
              pageButtons.push(renderPageBtn(lastPage - 1, false));
              pageButtons.push(renderPageBtn(lastPage, true));
              pageButtons.push(
                <input
                  key="input"
                  ref={inputRef}
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="Page"
                  className="w-16 text-center border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = Number((e.target as HTMLInputElement).value);
                      if (!isNaN(val) && val >= 1 && val <= totalPages) {
                        handlePageChange(val - 1);
                        clearInput(
                          inputRef as React.RefObject<HTMLInputElement>
                        );
                      }
                    }
                  }}
                />
              );
            } else {
              // [current-1] [current (highlighted)] [current+1] [input] [last] (only if last is not in visible)
              pageButtons.push(renderPageBtn(currentPage - 1, false));
              pageButtons.push(renderPageBtn(currentPage, true));
              pageButtons.push(renderPageBtn(currentPage + 1, false));
              pageButtons.push(
                <input
                  key="input"
                  ref={inputRef}
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="Page"
                  className="w-16 text-center border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = Number((e.target as HTMLInputElement).value);
                      if (!isNaN(val) && val >= 1 && val <= totalPages) {
                        handlePageChange(val - 1);
                        clearInput(
                          inputRef as React.RefObject<HTMLInputElement>
                        );
                      }
                    }
                  }}
                />
              );
              if (currentPage + 1 < lastPage) {
                pageButtons.push(renderPageBtn(lastPage, false));
              }
            }
          }
          return pageButtons;
        })()}
      </div>

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
