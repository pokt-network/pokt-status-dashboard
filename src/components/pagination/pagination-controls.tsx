import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { useMemo } from "react";

export function PaginationControls({
  pageKeys,
  setPageKeys,
  setNextPageKey,
  nextPageKey,
}: {
  pageKeys: string[];
  setPageKeys: (pageKeys: string[]) => void;
  setNextPageKey?: (nextPageKey: string) => void;
  nextPageKey?: string;
}) {
  const currentPage = useMemo(() => {
    return pageKeys.length + 1;
  }, [pageKeys]);

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious aria-disabled={currentPage === 1} onClick={() => {
              const prevKey = pageKeys[pageKeys.length - 1];
              setPageKeys(pageKeys.slice(0, -1));
              setNextPageKey?.(prevKey);
            }} />
          </PaginationItem>
        )}
        <PaginationItem>
          {currentPage}
        </PaginationItem>
        <PaginationItem className={nextPageKey ? "cursor-pointer" : "cursor-not-allowed text-gray-400"}>
          <PaginationNext onClick={() => {
            if (nextPageKey) {
              setPageKeys([...pageKeys, nextPageKey]);
              setNextPageKey?.(nextPageKey);
            }
          }} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}