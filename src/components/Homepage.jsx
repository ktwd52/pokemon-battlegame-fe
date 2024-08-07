import PokemonCard from "./PokemonCard";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { CapitalizeFirstLetter } from "../utils/utils";
import { NavLink } from "react-router-dom";
import heartIcon from "../assets/heart-icon.svg";
import heartIconSelected from "../assets/heart-icon-selected.svg";
import { PokemonContext } from "./context/PokemonContext";
// import PokemonBattleCard from "./Battle/PokemonBattleCard";
import { saveRoster } from "../utils/storage";

const dummyPokemon = {
  name: "bulbasaur",
  sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  stats: [
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: "hp",
        url: "https://pokeapi.co/api/v2/stat/1/",
      },
    },
    {
      base_stat: 49,
      effort: 0,
      stat: {
        name: "attack",
        url: "https://pokeapi.co/api/v2/stat/2/",
      },
    },
    {
      base_stat: 49,
      effort: 0,
      stat: {
        name: "defense",
        url: "https://pokeapi.co/api/v2/stat/3/",
      },
    },
    {
      base_stat: 65,
      effort: 1,
      stat: {
        name: "special-attack",
        url: "https://pokeapi.co/api/v2/stat/4/",
      },
    },
    {
      base_stat: 65,
      effort: 0,
      stat: {
        name: "special-defense",
        url: "https://pokeapi.co/api/v2/stat/5/",
      },
    },
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: "speed",
        url: "https://pokeapi.co/api/v2/stat/6/",
      },
    },
  ],
};

export default function HomePage() {
  const { roster, setRoster } = useContext(PokemonContext);
  const [limit, setLimit] = useState(18);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [url, setUrl] = useState(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

  useEffect(() => {
    // const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    axios
      .get(url)
      .then((res) => {
        // console.log(res.data);
        setPokemons(res.data.results);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);

        // axios.get(url);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return (
    <div className="min-h-screen text-center bg-base-100 max-w-[70rem] m-auto ">
      {/* <p className="text-3xl my-3">Pokemons</p> */}
      <div className="m-auto my-4">
        <Pagination nextPage={nextPage} prevPage={prevPage} setUrl={setUrl} />
      </div>
      {loading ? (
        <div className="">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4 pb-12 relative">
          {pokemons.map((pokemon) => {
            return (
              // <div
              //   className="hover:cursor-pointer hover:border-opacity-100 border-opacity-0 bg-error text-error-content py-4 font-semibold text-lg border-[2px] border-neutral-content"
              //   key={pokemon.name}>
              //   {CapitalizeFirstLetter(pokemon.name)}
              // </div>
              <HomePokemonCard key={pokemon.name} roster={roster} setRoster={setRoster} pokemon={pokemon} />
            );
          })}
        </div>
      )}
    </div>
  );
}

const PokemonBase = ({ pokemonBase }) => {
  const [loaded, setLoaded] = useState(false);
  const [pokemon, setPokemon] = useState({});

  useEffect(() => {
    axios
      .get(pokemonBase.url)
      .then((res) => {
        setPokemon(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  return (
    <div>
      {loaded ? <PokemonCard pokemon={pokemon} /> : <div>{/* <span className="loading loading-spinner loading-lg scale-150 "></span> */}</div>}
    </div>
  );
};

const Pagination = ({ nextPage, prevPage, setUrl }) => {
  return (
    <div className="flex justify-between  m-auto">
      <div>
        {prevPage && (
          <button onClick={() => setUrl(prevPage)} className="btn btn-outline btn-warning">
            Previous page
          </button>
        )}
      </div>
      <div>
        {nextPage && (
          <button onClick={() => setUrl(nextPage)} className="btn btn-outline btn-warning px-8">
            Next Page
          </button>
        )}
      </div>
    </div>
  );
};

const HomePokemonCard = ({ pokemon, roster, setRoster }) => {
  const [inRoster, setInRoster] = useState(false);

  useEffect(() => {
    const found = roster.find((x) => x.name === pokemon.name);
    if (found) setInRoster(true);
    else setInRoster(false);
  }, []);

  return (
    <div key={pokemon.name} className="relative hover:cursor-pointer hover:border-opacity-100 border-opacity-0 border-[2px] border-accent rounded-xl">
      <img
        onClick={() => {
          if (!inRoster) {
            setInRoster(true);
            axios
              .get(pokemon.url)
              .then((res) => {
                setRoster([...roster, res.data]);
                saveRoster([...roster, res.data]);
              })
              .catch((err) => console.log(err));
          } else {
            const r = roster.filter((x) => x.name !== pokemon.name);
            setRoster(r);
            saveRoster(r);
            setInRoster(false);
          }
        }}
        className="absolute right-2 top-2 opacity-80 hover:cursor-pointer hover:animate-pulse"
        src={inRoster ? heartIconSelected : heartIcon}
        alt=""
      />
      <NavLink to={`pokemon/${pokemon.url.split("/")[6]}`} className="">
        <PokemonBase pokemonBase={pokemon} />
      </NavLink>
    </div>
  );
};
