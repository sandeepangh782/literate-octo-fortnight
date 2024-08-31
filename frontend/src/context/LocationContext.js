import React, { createContext, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  return (
    <LocationContext.Provider value={{ latitude, setLatitude, longitude, setLongitude }}>
      {children}
    </LocationContext.Provider>
  );
};
