'use client';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="border border-black/10 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>
      
      <div className="flex items-center space-x-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={page === '...' ? `ellipsis-${index}` : page}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? 'bg-gray-800 text-white'
                : page === '...'
                ? 'cursor-default text-black/50'
                : 'text-black/50 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="border border-black/10 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;