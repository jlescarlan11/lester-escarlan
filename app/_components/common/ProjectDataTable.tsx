"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
} from "@tanstack/react-table";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";

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

interface ProjectDataTableProps {
  data: Project[];
  showActions?: boolean;
  onDelete?: (projectId: string, projectTitle: string) => void;
  showViewAction?: boolean;
  showAddButton?: boolean;
  addButtonHref?: string;
  addButtonText?: string;
}

// Fixed: Added display name for ESLint compliance
const SortableHeader = React.memo(
  ({ title, column }: { title: string; column: Column<Project, unknown> }) => {
    const sortDirection = column.getIsSorted();

    return (
      <Button
        variant="ghost"
        className="p-0"
        onClick={() => column.toggleSorting(sortDirection === "asc")}
      >
        {title}
        {sortDirection === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : sortDirection === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        )}
      </Button>
    );
  }
);

SortableHeader.displayName = "SortableHeader";

const ProjectDataTable = ({
  data,
  showActions = false,
  onDelete,
  showViewAction = false,
  showAddButton = false,
  addButtonHref = "/admin/project/create",
  addButtonText = "Add Project",
}: ProjectDataTableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<Project>[] = React.useMemo(() => {
    const baseColumns: ColumnDef<Project>[] = [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <SortableHeader title="Title" column={column} />
        ),
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("title") as string}</div>
        ),
        enableGlobalFilter: true,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-[300px] break-words whitespace-normal lowercase">
            {row.getValue("description") as string}
          </div>
        ),
        enableGlobalFilter: true,
      },
      {
        accessorKey: "technologies",
        header: "Technologies",
        cell: ({ row }) => {
          const technologies = row.getValue("technologies") as string[];
          return (
            <div className="flex flex-wrap gap-1">
              {technologies.slice(0, 3).map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs lowercase"
                >
                  {tech}
                </Badge>
              ))}
              {technologies.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{technologies.length - 3}
                </Badge>
              )}
            </div>
          );
        },
        enableGlobalFilter: true,
        filterFn: (row, id, value) => {
          const technologies = row.getValue(id) as string[];
          return technologies.some((tech) =>
            tech.toLowerCase().includes(value.toLowerCase())
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge
              variant={status === "featured" ? "default" : "secondary"}
              className="lowercase"
            >
              {status}
            </Badge>
          );
        },
        enableColumnFilter: true,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <SortableHeader title="Created" column={column} />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return <div>{date.toLocaleDateString()}</div>;
        },
      },
    ];

    // Add actions column conditionally
    if (showActions || showViewAction) {
      baseColumns.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const project = row.original;
          return (
            <div className="flex gap-2">
              {showViewAction && (
                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline" size="sm">
                    View
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
        },
      });
    }

    return baseColumns;
  }, [showActions, showViewAction, onDelete]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search all columns..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Columns</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
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

        {globalFilter && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            <Badge variant="secondary" className="text-xs">
              Search: &quot;{globalFilter}&quot;
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 text-xs"
                onClick={() => setGlobalFilter("")}
              >
                ×
              </Button>
            </Badge>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} project(s) total.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

ProjectDataTable.displayName = "ProjectDataTable";
export { ProjectDataTable };
