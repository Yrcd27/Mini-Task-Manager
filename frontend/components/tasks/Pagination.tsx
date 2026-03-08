"use client";

import Button from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    // Show all pages if total is small
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show first page, current page neighbors, and last page with ellipsis
    pages.push(0); // First page

    if (currentPage > 2) {
      pages.push("...");
    }

    // Show pages around current page
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages - 2, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages - 1); // Last page
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1"
      >
        Previous
      </Button>

      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {pageNum + 1}
          </button>
        );
      })}

      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-1"
      >
        Next
      </Button>
    </div>
  );
}
