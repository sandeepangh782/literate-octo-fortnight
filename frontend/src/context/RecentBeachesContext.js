import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RecentBeachesContext = createContext();

export const RecentBeachesProvider = ({ children }) => {
  const [recentBeaches, setRecentBeaches] = useState([]);

  useEffect(() => {
    loadRecentBeaches();
  }, []);

  const loadRecentBeaches = async () => {
    try {
      const storedBeaches = await AsyncStorage.getItem('recentBeaches');
      if (storedBeaches) {
        setRecentBeaches(JSON.parse(storedBeaches));
      }
    } catch (error) {
      console.error('Error loading recent beaches:', error);
    }
  };

  const addRecentBeach = async (beach) => {
    const updatedRecentBeaches = [beach, ...recentBeaches.filter(b => b.id !== beach.id)].slice(0, 5);
    setRecentBeaches(updatedRecentBeaches);
    try {
      await AsyncStorage.setItem('recentBeaches', JSON.stringify(updatedRecentBeaches));
    } catch (error) {
      console.error('Error saving recent beaches:', error);
    }
  };

  return (
    <RecentBeachesContext.Provider value={{ recentBeaches, addRecentBeach }}>
      {children}
    </RecentBeachesContext.Provider>
  );
};