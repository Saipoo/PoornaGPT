import React from 'react';
import { Category } from '@/types';
import ToolItem from './ToolItem';

interface CategoryCardProps {
  category: Category;
  view: 'grid' | 'list';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, view }) => {
  if (view === 'grid') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{category.name}</h2>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            {category.tools.map((tool) => (
              <ToolItem key={tool.id} tool={tool} compact={true} />
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  // List view
  return (
    <div className="col-span-full mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        {category.name}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {category.tools.map((tool) => (
          <div key={tool.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <ToolItem tool={tool} compact={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
