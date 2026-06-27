"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TablePagination } from "./TablePagination";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  basePath?: string;
}

export function PaginationBar({
  page,
  totalPages,
  basePath = "",
}: PaginationBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  };

  return (
    <TablePagination
      page={page}
      totalPages={totalPages}
      onChange={handleChange}
    />
  );
}
