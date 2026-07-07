"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
};

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50],
}: PaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * itemsPerPage + 1;
  const end = Math.min(safePage * itemsPerPage, totalItems);

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white/35 px-4 py-3 text-sm text-slate-600 ring-1 ring-white/60 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-medium">
        Menampilkan {start}-{end} dari {totalItems} data
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 font-medium">
          Per halaman
          <select
            className="h-9 rounded-xl border border-white/60 bg-white/65 px-3 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
            value={itemsPerPage}
            onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
          >
            {itemsPerPageOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-2">
          <button
            className="flex size-9 items-center justify-center rounded-xl bg-white/60 text-slate-700 ring-1 ring-white/70 disabled:cursor-not-allowed disabled:opacity-45"
            type="button"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-20 text-center font-semibold text-slate-700">
            {safePage} / {totalPages}
          </span>
          <button
            className="flex size-9 items-center justify-center rounded-xl bg-white/60 text-slate-700 ring-1 ring-white/70 disabled:cursor-not-allowed disabled:opacity-45"
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
