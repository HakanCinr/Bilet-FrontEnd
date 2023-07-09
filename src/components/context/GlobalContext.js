import { createContext, useState } from 'react';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [favoriler, setFavoriler] = useState([]);

  const favorilereEkle = (event) => {
    const eskiFavoriler = [...favoriler];
    const yeniFavoriler = eskiFavoriler.concat(event);

    setFavoriler(yeniFavoriler);
  };

  const favorilerdenCikar = (eventID) => {
    const eskiFavoriler = [...favoriler];
    const yeniFavoriler = eskiFavoriler.filter((event) => event.eventID !== eventID);

    setFavoriler(yeniFavoriler);
  };

  return (
    <AppContext.Provider
      value={{ favoriler, favorilereEkle, favorilerdenCikar }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
