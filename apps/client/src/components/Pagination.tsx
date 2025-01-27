'use client';

import { useRouter } from 'next/navigation';
import "./Pagination.css"
import { useState } from 'react';

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

    const handlePageChange = (newPage: number) => {
        router.push(`/activites?page=${newPage}&perPage=${perPage}`, {
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
                Page precedente
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
                Page suivante
            </button>
        </div>}
    </>
};
