export interface Tool {
  id: string;
  name: string;
  url: string;
}

export interface Category {
  name: string;
  tools: Tool[];
}

export interface Resource {
  name: string;
  url: string;
}

export interface AIData {
  categories: Category[];
  datasets: Resource[];
  databases: Resource[];
  hosting: Resource[];
}

export type ResourceType = 'datasets' | 'databases' | 'hosting';

export type ViewMode = 'grid' | 'list';

export interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentCategory: string | null;
  setCurrentCategory: (category: string | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  currentSection: 'categories' | 'favorites' | ResourceType;
  setCurrentSection: (section: 'categories' | 'favorites' | ResourceType) => void;
  favorites: string[];
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  chatbotOpen: boolean;
  setChatbotOpen: (open: boolean) => void;
  favoritesDialogOpen: boolean;
  setFavoritesDialogOpen: (open: boolean) => void;
}
