'use client';

import { usePathname, useRouter } from 'next/navigation';
import "./Pagination.css"

interface PaginationProps {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    currentPage: number;
    perPage: number;
    totalPages: number;
}

export const Pagination = ({
    hasNextPage,
    hasPrevPage,
    currentPage,
    perPage,
    totalPages
}: PaginationProps) => {
    const router = useRouter();
    const pathName = usePathname()

    const handlePageChange = (newPage: number) => {
        router.push(`${pathName}?page=${newPage}&perPage=${perPage}`, {
            scroll: true
        });
    };

    return <>
        {totalPages <= perPage ? undefined : <div className="pagination">
            <button
                className={`btn btn-primary btn-sm ${hasPrevPage ? '' : 'btn-secondary cursor-not-allowed'}`}
                disabled={!hasPrevPage}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                Precedent
            </button>

            {Array.from({ length: Math.ceil(totalPages / perPage) }, (_, index) => {
                const page = index + 1;
                return (
                    <button
                        key={page}
                        className={`btn ${page === currentPage ? 'btn-primary bg-primary text-white' : ''}`}
                        onClick={() => handlePageChange(page)}
                        disabled={page === currentPage}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                className={`btn btn-primary btn-sm ${hasNextPage ? '' : 'btn-secondary cursor-not-allowed'}`}
                disabled={!hasNextPage}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Suivant
            </button>
        </div>}
    </>
};
