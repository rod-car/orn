// components/Pagination.js
import Link from 'next/link';

export default function Pagination({ currentPage, lastPage }: { currentPage: number, lastPage: number }) {
    const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

    return (
        <div className="pagination">
            {currentPage > 1 && (
                <Link href={`?page=${currentPage - 1}`}>
                    <a>Previous</a>
                </Link>
            )}
            {pages.map((page) => (
                <Link key={page} href={`?page=${page}`}>
                    <a className={page === currentPage ? 'active' : ''}>{page}</a>
                </Link>
            ))}
            {currentPage < lastPage && (
                <Link href={`?page=${currentPage + 1}`}>
                    <a>Next</a>
                </Link>
            )}
        </div>
    );
}
