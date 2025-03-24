import { useState, useEffect } from 'react';

export function useFavorites(): [string[], (id: string) => void, (id: string) => void, (id: string) => boolean] {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('poornaGptFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('poornaGptFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (id: string) => {
    if (!favorites.includes(id)) {
      setFavorites([...favorites, id]);
    }
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(favorites.filter(favoriteId => favoriteId !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  return [favorites, addToFavorites, removeFromFavorites, isFavorite];
}
