import React, { useState, useEffect } from 'react';
import { BsFillSunFill, BsFillMoonStarsFill } from 'react-icons/bs';

const ThemeSelector: React.FC = () => {
  // Get the local storage key name from the environment variable
  const themePreferenceKey = import.meta.env.VITE_SOCIAL_MEDIA_THEME_PREFERENCE;

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem(themePreferenceKey) as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    // Check for theme preference in local storage and set the theme
    const themePreference = localStorage.getItem(themePreferenceKey) as 'light' | 'dark';
    if (themePreference) {
      setCurrentTheme(themePreference);
      document.documentElement.classList.add(themePreference);
    }
  }, [themePreferenceKey]);

  const handleThemeChange = () => {
    // Update the current theme state and add/remove classes accordingly
    if (currentTheme === 'dark') {
      setCurrentTheme('light');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      // Save theme preference in local storage
      localStorage.setItem(themePreferenceKey, 'light');
    } else {
      setCurrentTheme('dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      // Save theme preference in local storage
      localStorage.setItem(themePreferenceKey, 'dark');
    }
  };

  return (
    <button
      onClick={handleThemeChange}
      className="flex items-center justify-center rounded-full  text-yellow-400 dark:text-blue-500"
    >
      {currentTheme === 'light' ? (
        <BsFillSunFill className="text-3xl" />
      ) : (
        <BsFillMoonStarsFill className="text-3xl" />
      )}
    </button>
  );
};

export default ThemeSelector;
