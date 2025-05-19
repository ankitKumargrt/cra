"use client"

import { Button } from "@/components/ui/button"

interface L1ApplicationsTableFooterProps {
  filteredApplications: [string, any][]
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  totalPages: number
}

export function L1ApplicationsTableFooter({
  filteredApplications,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalPages,
}: L1ApplicationsTableFooterProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium">
          {Math.min(filteredApplications.length, (currentPage - 1) * itemsPerPage + 1)}
        </span>{" "}
        to <span className="font-medium">{Math.min(filteredApplications.length, currentPage * itemsPerPage)}</span> of{" "}
        <span className="font-medium">{filteredApplications.length}</span> applications
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          // Show at most 5 page buttons
          let pageNum = i + 1

          // If we have more than 5 pages and we're not on the first few pages
          if (totalPages > 5 && currentPage > 3) {
            // Start from currentPage - 2, unless that would push us past the last page
            pageNum = Math.min(currentPage - 2 + i, totalPages - (4 - i))
          }

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className="w-9"
            >
              {pageNum}
            </Button>
          )
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
