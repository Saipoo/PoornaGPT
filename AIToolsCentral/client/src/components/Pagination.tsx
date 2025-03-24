import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { AIData, Category, Resource, Tool } from '@/types';
import aiData from '@/data/aiData.json';

interface PaginationProps {
  filteredData: {
    categories: Category[];
    datasets: Resource[];
    databases: Resource[];
    hosting: Resource[];
  };
}

const Pagination: React.FC<PaginationProps> = ({ filteredData }) => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentSection, 
    currentCategory,
    itemsPerPage,
    searchTerm,
    favorites
  } = useAppContext();

  // Get total items count based on current section
  const getTotalItemsCount = (): number => {
    if (currentSection === 'categories') {
      if (currentCategory) {
        // Count tools in the selected category
        const category = filteredData.categories.find(cat => cat.name === currentCategory);
        return category ? category.tools.length : 0;
      } else {
        // Count categories
        return filteredData.categories.length;
      }
    } else if (currentSection === 'favorites') {
      if (searchTerm) {
        // Get all tools
        const allTools: Tool[] = [];
        aiData.categories.forEach(category => {
          category.tools.forEach(tool => {
            allTools.push(tool);
          });
        });
        
        // Count favorites that match the search term
        return favorites.filter(id => {
          const tool = allTools.find(t => t.id === id);
          return tool && tool.name.toLowerCase().includes(searchTerm.toLowerCase());
        }).length;
      }
      return favorites.length;
    } else {
      // Count resources (datasets, databases, hosting)
      return filteredData[currentSection].length;
    }
  };

  const totalItems = getTotalItemsCount();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="pagination flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-md shadow-sm p-2">
      <button
        className="px-2 py-1 text-gray-500 dark:text-gray-400 disabled:opacity-50"
        onClick={goToPreviousPage}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        Page <span>{currentPage}</span> of <span>{totalPages || 1}</span>
      </span>
      <button
        className="px-2 py-1 text-gray-500 dark:text-gray-400 disabled:opacity-50"
        onClick={goToNextPage}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
