import React, { createContext, useState } from 'react';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const [isFavorite, setIsFavorite] = useState(false);
  
  return (
    <FavoriteContext.Provider value={{ isFavorite, setIsFavorite  }}>
      {children}
    </FavoriteContext.Provider>
  );
};