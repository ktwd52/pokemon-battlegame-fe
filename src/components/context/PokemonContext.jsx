import { createContext, useState } from "react";

export const PokemonContext = createContext();

import { dummyRoster } from "../../utils/temporaryPokemons";
export const PokemonProvider = ({ children }) => {
  const [roster, setRoster] = useState(dummyRoster);

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
