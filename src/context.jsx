import React, { createContext, useState, useCallback } from 'react';

const GlobalContext = createContext({});

const GlobalProvider = ({ children }) => {
  const [path, setPath] = useState('home');
  const [appearance, setAppearance] = useState('light');
  const [cats, setCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);

  const go = useCallback((newPath) => setPath(newPath), []);
  const Appearance = useCallback((newAppearance) => setAppearance(newAppearance), []);

  const fetchCats = async () => {
    const response = await fetch('info.json');
    const data = await response.json();
    setCats(data);
  };

  return (
      <GlobalContext.Provider value={{ path, appearance, Appearance, go, cats, fetchCats, selectedCat, setSelectedCat }}>
        {children}
      </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
