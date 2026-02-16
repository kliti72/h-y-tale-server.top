// src/components/Pagination.tsx
import { Component, createMemo, For } from "solid-js";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

const Pagination: Component<PaginationProps> = (props) => {
  const totalPages = createMemo(() =>
    Math.ceil(props.totalItems / props.itemsPerPage)
  );

  const pageNumbers = createMemo(() => {
    const total = totalPages();
    const current = props.currentPage;
    const maxVisible = 7;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    if (start > 1) pages.unshift(-1); // -1 = "..."
    if (end < total) pages.push(-2); // -2 = "..."

    return pages;
  });

  return (
    <div class="flex justify-center items-center gap-2 md:gap-3 mt-10 py-6">
      {/* Freccia sinistra */}
      <button
        disabled={props.currentPage === 1}
        onClick={() => props.onPageChange(Math.max(1, props.currentPage - 1))}
        class={`
          px-4 py-2.5 rounded-xl text-lg font-bold transition-all duration-200
          ${props.currentPage === 1
            ? "bg-violet-950/40 text-violet-600 cursor-not-allowed border border-violet-800/40"
            : "bg-violet-800/80 hover:bg-violet-700 text-white border border-violet-700/60 hover:border-violet-500/80 shadow-md"}
        `}
      >
        ←
      </button>

      {/* Numeri di pagina */}
      <For each={pageNumbers()}>
        {(page) => (
          <>
            {page > 0 ? (
              <button
                onClick={() => props.onPageChange(page)}
                class={`
                  px-4 py-2.5 rounded-xl min-w-[42px] text-center font-semibold transition-all duration-200
                  ${page === props.currentPage
                    ? "bg-fuchsia-700/90 text-white shadow-lg shadow-fuchsia-900/50 border border-fuchsia-600/70"
                    : "bg-violet-950/70 text-violet-200 hover:bg-violet-800/90 border border-violet-700/60 hover:border-violet-500/70"}
                `}
              >
                {page}
              </button>
            ) : (
              <span class="px-4 py-2.5 text-violet-400 font-semibold">...</span>
            )}
          </>
        )}
      </For>

      {/* Freccia destra */}
      <button
        disabled={props.currentPage === totalPages()}
        onClick={() => props.onPageChange(Math.min(totalPages(), props.currentPage + 1))}
        class={`
          px-4 py-2.5 rounded-xl text-lg font-bold transition-all duration-200
          ${props.currentPage === totalPages()
            ? "bg-violet-950/40 text-violet-600 cursor-not-allowed border border-violet-800/40"
            : "bg-violet-800/80 hover:bg-violet-700 text-white border border-violet-700/60 hover:border-violet-500/80 shadow-md"}
        `}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;