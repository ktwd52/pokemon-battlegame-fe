import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { PokemonContext } from "./context/PokemonContext";
import { CapitalizeFirstLetter } from "../utils/utils";
import { NavLink } from "react-router-dom";

//Find a parent element from child element
// function FindParentElement(elementToFind, startingElement) {
//   let currentElement = startingElement;
//   if (currentElement == elementToFind) return true;
//   while (currentElement.parentElement) {
//     currentElement = currentElement.parentElement;
//     if (currentElement == elementToFind) return true;
//   }
//   return false;
// }

export default function Search() {
  const [search, setSearch] = useState("");
  const { pokemonList, setPokemonList, searchResults, setSearchResults } = useContext(PokemonContext);
  const [searchIsReady, setSearchIsReady] = useState(false);
  //   const dropdown = document.getElementById("dropdown");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fullListUrl = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
    axios
      .get(fullListUrl)
      .then((res) => {
        setPokemonList(res.data.results);
        setSearchIsReady(true);
      })
      .catch((err) => {
        console.log(err);
        setSearchIsReady(false);
      })
      .finally(() => {});
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (e.target.id == "search") {
      setIsOpen(true);
      return;
    }
    if (e.target.parentElement?.parentElement?.parentElement?.id != "dropdown" && isOpen) {
      setIsOpen(false);
    }
  };

  function handleChange(e) {
    const query = e.target.value;
    setSearch(query);
    const results = searchProperties(query);
    setSearchResults(results);
  }

  function searchProperties(query) {
    const lowerCaseQuery = query.toLowerCase();

    // filter to return only objects whose name starts with the query
    return pokemonList.filter((property) => property.name.toLowerCase().startsWith(lowerCaseQuery));
  }

  return (
    <div>
      <label className="input input-bordered rounded-lg input-md flex items-center gap-2">
        <input
          autoComplete="off"
          id="search"
          onChange={handleChange}
          value={search}
          disabled={!searchIsReady}
          type="text"
          className="grow "
          placeholder="Search"
        />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-6 w-6 opacity-70">
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      <SearchResults searchResults={searchResults} search={search} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

const SearchResults = ({ searchResults, search, isOpen, setIsOpen }) => {
  const dropdownRef = useRef(null);

  if (!searchResults) return;
  if (search.length <= 1 || searchResults.length == 0) return;

  //   const handleClick = (e) => {
  //     // e.preventDefault();
  //     isOpen(false);
  //   };

  return (
    <div id="dropdown" ref={dropdownRef} className={`dropdown absolute ${isOpen && "dropdown-open"} `}>
      <ul tabIndex={0} className="overflow-y-auto max-h-96 dropdown-content menu-vertical bg-base-300 rounded-box z-[1] w-52 p-2 shadow gap-2">
        {searchResults.map((pokemon) => {
          return (
            <li key={pokemon.name}>
              <NavLink
                //   onClick={handleClick}
                to={`pokemon/${pokemon.url.split("/")[6]}`}
                className="w-full hover:cursor-pointer hover:bg-base-100 pb-1 px-2 rounded-lg">
                {CapitalizeFirstLetter(pokemon.name)}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
