import React, { createContext, useState } from 'react';

const ListContext = createContext();

const ListProvider = ({ children }) => {
  const [selectedListing, setSelectedListing] = useState({});

  return (
    <ListContext.Provider value={{ selectedListing, setSelectedListing }}>
      {children}
    </ListContext.Provider>
  );
};

export { ListContext, ListProvider };
