import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import aiData from '@/data/aiData.json';

const Sidebar: React.FC = () => {
  const { 
    currentCategory, 
    setCurrentCategory, 
    setCurrentSection, 
    setCurrentPage 
  } = useAppContext();

  const handleCategoryClick = (categoryName: string | null) => {
    setCurrentCategory(categoryName);
    setCurrentSection('categories');
    setCurrentPage(1);
  };

  const handleResourceClick = (resourceType: 'datasets' | 'databases' | 'hosting') => {
    setCurrentSection(resourceType);
    setCurrentPage(1);
  };

  return (
    <aside className="hidden md:flex md:w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors overflow-y-auto">
      <div className="w-full py-6 px-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
        <div className="space-y-1">
          {/* All Categories Option */}
          <button
            className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              currentCategory === null ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
            onClick={() => handleCategoryClick(null)}
          >
            All Categories
          </button>
          
          {/* Category List */}
          {aiData.categories.map((category) => (
            <button
              key={category.name}
              className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                currentCategory === category.name ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-4">Resources</h2>
        <div className="space-y-1">
          <button
            className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleResourceClick('datasets')}
          >
            Datasets
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleResourceClick('databases')}
          >
            Databases
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleResourceClick('hosting')}
          >
            Hosting
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
