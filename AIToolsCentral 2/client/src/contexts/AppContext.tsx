import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useFavorites } from '@/hooks/useFavorites';
import { useSearch } from '@/hooks/useSearch';
import aiData from '@/data/aiData.json';
import { AppState, ViewMode, ResourceType } from '@/types';

const AppContext = createContext<AppState | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [favorites, addToFavorites, removeFromFavorites, isFavorite] = useFavorites();
  const { searchTerm, setSearchTerm } = useSearch(aiData);
  
  const [currentView, setCurrentView] = useState<ViewMode>('grid');
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentSection, setCurrentSection] = useState<'categories' | 'favorites' | ResourceType>('categories');
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [favoritesDialogOpen, setFavoritesDialogOpen] = useState<boolean>(false);

  const itemsPerPage = 9;

  const value: AppState = {
    darkMode,
    toggleDarkMode,
    currentView,
    setCurrentView,
    searchTerm,
    setSearchTerm,
    currentCategory,
    setCurrentCategory,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    currentSection,
    setCurrentSection,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    chatbotOpen,
    setChatbotOpen,
    favoritesDialogOpen,
    setFavoritesDialogOpen
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
