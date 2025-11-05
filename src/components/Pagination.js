import React from 'react';
import './Pagination.css'; // (हम 'इसके' (Its) 'लिए' (for) 'CSS' (सीएसएस) (CSS (सीएसएस)) 'भी' (also) 'बनाएँगे' (will create))

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    
    const renderPageNumbers = () => {
        // (यह '1 ... 4, 5, 6 ... 10' (1 ... 4, 5, 6 ... 10) 'जैसा' (like) 'लॉजिक' (logic) (तर्क) 'बनाएगा' (will create))
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`page-item ${i === currentPage ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="pagination-container">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="page-item"
            >
                First
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-item"
            >
                Prev
            </button>
            
            {renderPageNumbers()}
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-item"
            >
                Next
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="page-item"
            >
                Last
            </button>
        </div>
    );
};

export default Pagination;