import { useState, useEffect } from 'react';

export function useDarkMode(): [boolean, () => void] {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check for system preference or stored preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches && 
       localStorage.getItem('darkMode') === null);
    
    if (isDarkMode) {
      enableDarkMode();
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  };

  const enableDarkMode = () => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
    setDarkMode(true);
  };

  const disableDarkMode = () => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
    setDarkMode(false);
  };

  return [darkMode, toggleDarkMode];
}
