interface TablePaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  page,
  totalPages,
  onChange,
  className,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-3 mt-6 ${className ?? ""}`}>
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-5 py-2.5 label-mono text-ivory/70 rounded-full hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
      >
        PREV
      </button>
      <span className="label-mono text-ivory/50 px-3">
        {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-5 py-2.5 label-mono text-ivory/70 rounded-full hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
      >
        NEXT
      </button>
    </div>
  );
}
