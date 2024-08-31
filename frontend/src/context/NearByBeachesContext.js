import React, { createContext, useState } from 'react';

export const NearbyBeachesContext = createContext();

export const NearbyBeachesProvider = ({ children }) => {
  const [nearbyBeaches, setNearbyBeaches] = useState([]);

  return (
    <NearbyBeachesContext.Provider value={{ nearbyBeaches, setNearbyBeaches }}>
      {children}
    </NearbyBeachesContext.Provider>
  );
};