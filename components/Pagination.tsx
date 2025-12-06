import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginateProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Paginate = ({ page, totalPages, onChange }: PaginateProps) => {
  const handlePrev = () => {
    if (page > 1) onChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onChange(page + 1);
  };

  // generate simple window (1 ... 3 4 5 ... total)
  const getPages = () => {
    const pages: number[] = [];

    if (totalPages <= 5) {
      // show all pages if small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // always show first + last + a small window
    const windowStart = Math.max(2, page - 1);
    const windowEnd = Math.min(totalPages - 1, page + 1);

    pages.push(1);

    if (windowStart > 2) pages.push(-1); // ellipsis indicator

    for (let p = windowStart; p <= windowEnd; p++) {
      pages.push(p);
    }

    if (windowEnd < totalPages - 1) pages.push(-2); // ellipsis indicator

    pages.push(totalPages);

    return pages;
  };

  const renderedPages = getPages();

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrev}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {renderedPages.map((p, i) =>
          p < 0 ? (
            <PaginationItem key={i}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={i}>
              <PaginationLink isActive={p === page} onClick={() => onChange(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginate;
