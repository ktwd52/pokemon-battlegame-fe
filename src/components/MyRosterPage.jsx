import { useContext, useState, useEffect } from "react";
import { PokemonContext } from "./context/PokemonContext";
import PokemonCard from "./PokemonCard";
import { NavLink } from "react-router-dom";
import { saveRoster } from "../utils/storage";

export default function MyRosterPage() {
  const { roster, setRoster } = useContext(PokemonContext);

  return (
    <div className="min-h-screen text-center max-w-[80rem] m-auto">
      <p className="text-3xl py-4">My Roster</p>
      <div className="grid grid-cols-6 gap-4 mx-4 my-4  m-auto pb-6">
        {roster &&
          roster.map((pokemon) => {
            return <RosterCard key={pokemon.name} pokemon={pokemon} roster={roster} setRoster={setRoster} />;
          })}
      </div>
    </div>
  );
}

const RosterCard = ({ pokemon, roster, setRoster }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      key={pokemon.name}
      className={`hover:cursor-pointer border-[2px] rounded-xl border-primary hover:border-accent relative`}>
      <button
        onClick={(e) => {
          const newRoster = roster.filter((x) => x.name !== pokemon.name);
          setRoster(newRoster);
          saveRoster(newRoster);
        }}
        className={`absolute btn btn-outline btn-error right-0  rounded-tr-lg btn-xs border-[1px] ${hover ? "opacity-100" : "opacity-0"}`}>
        ✕
      </button>
      <NavLink to={`/pokemon/${pokemon.id}`} className="">
        <PokemonCard pokemon={pokemon} />
      </NavLink>
    </div>
  );
};
