import React from 'react';
import { X, ExternalLink, Trash2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import aiData from '@/data/aiData.json';
import { Tool } from '@/types';

const FavoritesDialog: React.FC = () => {
  const { 
    favoritesDialogOpen, 
    setFavoritesDialogOpen, 
    favorites, 
    removeFromFavorites,
    searchTerm
  } = useAppContext();

  if (!favoritesDialogOpen) return null;

  // Get all tools from all categories
  const allTools: (Tool & { category: string })[] = [];
  aiData.categories.forEach(category => {
    category.tools.forEach(tool => {
      allTools.push({ ...tool, category: category.name });
    });
  });

  // Filter favorite tools
  let favoriteTools = favorites
    .map(id => allTools.find(tool => tool.id === id))
    .filter(Boolean) as (Tool & { category: string })[];

  // Apply search filter if there's a search term
  if (searchTerm) {
    favoriteTools = favoriteTools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75" />
        </div>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Your Favorites
                </h3>
                <div className="mt-4">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                    {favoriteTools.length === 0 ? (
                      <li className="py-4 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm 
                          ? "No favorites found matching your search."
                          : "No favorites yet. Click the heart icon on any tool to add it to your favorites."}
                      </li>
                    ) : (
                      favoriteTools.map(tool => (
                        <li key={tool.id} className="py-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-gray-900 dark:text-white font-medium">{tool.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{tool.category}</p>
                          </div>
                          <div className="flex space-x-3">
                            <a
                              href={tool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary dark:text-primary-light"
                              aria-label={`Visit ${tool.name} website`}
                            >
                              <ExternalLink size={18} />
                            </a>
                            <button
                              className="text-red-500"
                              onClick={() => removeFromFavorites(tool.id)}
                              aria-label={`Remove ${tool.name} from favorites`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setFavoritesDialogOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesDialog;
