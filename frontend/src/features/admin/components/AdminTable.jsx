import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, X, Inbox } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';

export const AdminTable = ({
  columns = [],
  data = [],
  isLoading = false,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  pagination,
  onPageChange,
  actions,
  emptyTitle = 'No records found',
  emptyMessage = 'No data is currently available for this module.',
  emptyAction,
}) => {
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalRecords = pagination?.total || data.length;

  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (!onSearchChange) return;
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        onSearchChange(localSearch);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [localSearch, searchTerm, onSearchChange]);

  const clearSearch = () => {
    setLocalSearch('');
    onSearchChange?.('');
  };

  return (
    <div className="bg-white rounded-[18px] border border-[#E5E1D7] shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      {(onSearchChange || actions) && (
        <div className="p-4 border-b border-[#E5E1D7] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF8F2]/60">
          {onSearchChange ? (
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#68736D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#E5E1D7] rounded-[10px] text-[#17231D] focus:outline-none focus:border-[#164A35]"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#68736D] hover:text-[#17231D]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div />
          )}

          {actions && <div className="flex items-center gap-2 w-full sm:w-auto">{actions}</div>}
        </div>
      )}

      {/* Table Content */}
      {isLoading ? (
        <div className="p-4">
          <TableSkeleton rows={5} cols={columns.length} />
        </div>
      ) : data.length === 0 ? (
        <div className="p-8">
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            action={emptyAction}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E1D7] bg-[#FAF8F2] text-[11px] font-bold text-[#68736D] uppercase tracking-wider">
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-3.5 px-4 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D7]/60 text-xs sm:text-sm">
              {data.map((row, rowIdx) => (
                <tr
                  key={row._id || rowIdx}
                  className="hover:bg-[#FAF8F2]/60 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`py-3.5 px-4 ${col.className || ''}`}>
                      {col.render
                        ? col.render(row, rowIdx)
                        : col.accessor
                        ? row[col.accessor]
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[#E5E1D7] flex items-center justify-between gap-4 bg-[#FAF8F2]/40 text-xs text-[#68736D]">
          <span>
            Showing page {currentPage} of {totalPages} ({totalRecords} records)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronRight}
              iconPosition="right"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
