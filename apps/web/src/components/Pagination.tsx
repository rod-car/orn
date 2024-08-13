import { config } from "@base/config";
import { ReactNode } from "react";
import { Pagination as ReactPagination } from "react-laravel-paginex";

type PaginationProps = {
    data: unknown[],
    options?: Record<string, unknown>,
    changePage: (data: {page: number}) => void
}

export function Pagination({data, options, changePage}: PaginationProps): ReactNode {
    return <ReactPagination changePage={changePage} data={data} options={{ ...config.pagination, ...options }} />
}