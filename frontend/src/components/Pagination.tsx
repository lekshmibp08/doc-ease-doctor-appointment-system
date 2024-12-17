import { IPaginationProps } from "../types/interfaces";


const Pagination = ({ currentPage, totalPages, onPageChange }: IPaginationProps) => {
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page); // Trigger the parent component's page change handler
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <nav className="flex space-x-2 text-sm font-semibold">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-customTeal hover:underline disabled:text-gray-400"
        >
          Previous
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-customTeal text-white"
                : "text-customTeal hover:bg-gray-200"
            } transition`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-customTeal hover:underline disabled:text-gray-400"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
