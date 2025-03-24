import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Tool } from '@/types';
import { useAppContext } from '@/contexts/AppContext';

interface ToolItemProps {
  tool: Tool;
  compact?: boolean;
  categoryName?: string;
}

const ToolItem: React.FC<ToolItemProps> = ({ tool, compact = false, categoryName }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useAppContext();
  
  const isToolFavorite = isFavorite(tool.id);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToolFavorite) {
      removeFromFavorites(tool.id);
    } else {
      addToFavorites(tool.id);
    }
  };
  
  if (compact) {
    return (
      <li className="flex items-center justify-between">
        <span className="text-gray-700 dark:text-gray-300">{tool.name}</span>
        <div className="flex items-center space-x-2">
          <button 
            className={`text-gray-400 hover:text-red-500 transition-colors`}
            onClick={toggleFavorite}
            aria-label={isToolFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isToolFavorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
          <a 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:text-primary-dark dark:text-primary-light text-sm"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </li>
    );
  }
  
  // Expanded card for favorites view
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{tool.name}</h2>
          <button 
            className="text-red-500" 
            onClick={toggleFavorite}
            aria-label="Remove from favorites"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {categoryName && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{categoryName}</p>
        )}
      </div>
      <div className="px-6 py-4">
        <a 
          href={tool.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center text-primary hover:text-primary-dark dark:text-primary-light"
        >
          <span>Visit Website</span>
          <ExternalLink size={16} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default ToolItem;
