import React, { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useSearch } from '@/hooks/useSearch';
import aiData from '@/data/aiData.json';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import CategoryCard from '@/components/CategoryCard';
import ToolItem from '@/components/ToolItem';
import ResourceItem from '@/components/ResourceItem';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import FavoritesDialog from '@/components/FavoritesDialog';
import Pagination from '@/components/Pagination';
import { LayoutGrid, List } from 'lucide-react';

const Home: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    currentCategory,
    currentPage,
    setCurrentPage,
    currentSection,
    searchTerm,
    favorites,
    itemsPerPage
  } = useAppContext();

  const { filterData } = useSearch(aiData);

  // Filter data based on search term and currentCategory
  const filteredData = filterData(searchTerm, currentCategory);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, setCurrentPage]);

  // Apply pagination based on current section
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    if (currentSection === 'categories') {
      if (currentCategory) {
        const category = filteredData.categories.find(cat => cat.name === currentCategory);
        if (!category) return { categories: [], tools: [] };
        
        return {
          categories: [
            {
              ...category,
              tools: category.tools.slice(startIndex, startIndex + itemsPerPage)
            }
          ],
          tools: []
        };
      } else {
        return {
          categories: filteredData.categories.slice(startIndex, startIndex + itemsPerPage),
          tools: []
        };
      }
    } else if (currentSection === 'favorites') {
      // Get all tools
      const allTools = [];
      aiData.categories.forEach(category => {
        category.tools.forEach(tool => {
          allTools.push({ ...tool, category: category.name });
        });
      });
      
      // Filter favorites and apply search term if any
      let favoriteTools = favorites
        .map(id => allTools.find(tool => tool.id === id))
        .filter(Boolean);
      
      if (searchTerm) {
        favoriteTools = favoriteTools.filter(tool => 
          tool.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      return {
        categories: [],
        tools: favoriteTools.slice(startIndex, startIndex + itemsPerPage)
      };
    } else {
      // Handle resource sections (datasets, databases, hosting)
      return {
        categories: [],
        tools: [],
        resources: filteredData[currentSection].slice(startIndex, startIndex + itemsPerPage)
      };
    }
  };

  const paginatedData = getPaginatedData();

  // Helper to set content title based on current section/category
  const getContentTitle = () => {
    if (currentSection === 'categories') {
      return currentCategory || 'AI Tools';
    } else if (currentSection === 'favorites') {
      return 'Your Favorites';
    } else {
      return currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
    }
  };

  const showLoadingState = false; // For future loading state implementation
  const isEmptyState = 
    (currentSection === 'categories' && filteredData.categories.length === 0) ||
    (currentSection === 'favorites' && favorites.length === 0 && !searchTerm) ||
    (currentSection === 'favorites' && paginatedData.tools.length === 0 && searchTerm) ||
    (currentSection !== 'categories' && currentSection !== 'favorites' && filteredData[currentSection].length === 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              {getContentTitle()}
            </h1>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              {/* View Toggle - Only show for categories and favorites */}
              {(currentSection === 'categories' || currentSection === 'favorites') && (
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-md shadow-sm p-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">View:</span>
                  <button
                    className={`px-2 py-1 rounded ${
                      currentView === 'grid'
                        ? 'text-primary dark:text-primary-light'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                    onClick={() => setCurrentView('grid')}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    className={`px-2 py-1 rounded ${
                      currentView === 'list'
                        ? 'text-primary dark:text-primary-light'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                    onClick={() => setCurrentView('list')}
                    aria-label="List view"
                  >
                    <List size={16} />
                  </button>
                </div>
              )}
              
              {/* Pagination */}
              <Pagination filteredData={filteredData} />
            </div>
          </div>
          
          {/* Content Section */}
          <div>
            {/* Categories Section */}
            {currentSection === 'categories' && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedData.categories.map(category => (
                  <CategoryCard key={category.name} category={category} view={currentView} />
                ))}
              </div>
            )}
            
            {/* Favorites Section */}
            {currentSection === 'favorites' && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedData.tools.map(tool => (
                  <ToolItem 
                    key={tool.id} 
                    tool={tool} 
                    categoryName={tool.category} 
                  />
                ))}
              </div>
            )}
            
            {/* Resource Sections */}
            {['datasets', 'databases', 'hosting'].includes(currentSection) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData.resources?.map(resource => (
                    <ResourceItem key={resource.name} resource={resource} />
                  ))}
                </ul>
              </div>
            )}
            
            {/* Empty State */}
            {isEmptyState && (
              <div className="flex flex-col items-center justify-center py-12">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">No results found</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search term' : 'No items available in this category'}
                </p>
              </div>
            )}
            
            {/* Loading State */}
            {showLoadingState && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
      <Chatbot />
      <FavoritesDialog />
    </div>
  );
};

export default Home;
