import { createContext, useState, useEffect } from "react";

export const PokemonContext = createContext();
import { getRoster } from "../../utils/storage";

// import { dummyRoster } from "../../utils/temporaryPokemons";
export const PokemonProvider = ({ children }) => {
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    setRoster(getRoster());
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        roster,
        setRoster,
      }}>
      {children}
    </PokemonContext.Provider>
  );
};
