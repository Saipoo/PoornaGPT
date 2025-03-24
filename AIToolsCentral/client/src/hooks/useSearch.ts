import { useState, useCallback } from 'react';
import { AIData, Category, Tool, Resource } from '../types';

interface SearchResults {
  categories: Category[];
  datasets: Resource[];
  databases: Resource[];
  hosting: Resource[];
}

export function useSearch(data: AIData) {
  const [searchTerm, setSearchTerm] = useState('');

  const filterData = useCallback((term: string, currentCategory: string | null): SearchResults => {
    const normalizedTerm = term.toLowerCase().trim();
    
    // Filter categories and their tools
    let filteredCategories = [...data.categories];
    
    if (currentCategory) {
      // Filter by specific category
      filteredCategories = filteredCategories.filter(cat => cat.name === currentCategory);
    }
    
    if (normalizedTerm) {
      if (currentCategory) {
        // Already filtered to one category, just filter the tools
        filteredCategories = filteredCategories.map(category => {
          return {
            ...category,
            tools: category.tools.filter(tool => 
              tool.name.toLowerCase().includes(normalizedTerm)
            )
          };
        });
      } else {
        // Filter categories by name or by matching tools
        filteredCategories = filteredCategories.filter(category => {
          if (category.name.toLowerCase().includes(normalizedTerm)) {
            return true;
          }
          
          const hasMatchingTools = category.tools.some(tool => 
            tool.name.toLowerCase().includes(normalizedTerm)
          );
          
          if (hasMatchingTools) {
            // Only include matching tools
            category = {
              ...category,
              tools: category.tools.filter(tool => 
                tool.name.toLowerCase().includes(normalizedTerm)
              )
            };
            return true;
          }
          
          return false;
        });
      }
    }

    // Filter resources by name
    const filteredDatasets = normalizedTerm 
      ? data.datasets.filter(dataset => dataset.name.toLowerCase().includes(normalizedTerm))
      : data.datasets;
    
    const filteredDatabases = normalizedTerm
      ? data.databases.filter(database => database.name.toLowerCase().includes(normalizedTerm))
      : data.databases;
    
    const filteredHosting = normalizedTerm
      ? data.hosting.filter(hosting => hosting.name.toLowerCase().includes(normalizedTerm))
      : data.hosting;

    return {
      categories: filteredCategories,
      datasets: filteredDatasets,
      databases: filteredDatabases,
      hosting: filteredHosting
    };
  }, [data]);

  return {
    searchTerm,
    setSearchTerm,
    filterData
  };
}
