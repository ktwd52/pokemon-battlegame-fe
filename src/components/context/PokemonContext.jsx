import { createContext, useState, useEffect } from "react";

export const PokemonContext = createContext();
import { getRoster } from "../../utils/storage";

// import { dummyRoster } from "../../utils/temporaryPokemons";
export const PokemonProvider = ({ children }) => {
  const [roster, setRoster] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    setRoster(getRoster());
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        roster,
        setRoster,
        pokemonList,
        setPokemonList,
        searchResults,
        setSearchResults,
      }}>
      {children}
    </PokemonContext.Provider>
  );
};
