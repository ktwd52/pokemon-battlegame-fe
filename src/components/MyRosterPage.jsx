import { useContext, useState, useEffect } from "react";
import { PokemonContext } from "./context/PokemonContext";
import PokemonCard from "./PokemonCard";
import { NavLink } from "react-router-dom";

export default function MyRosterPage() {
  const { roster, setRoster } = useContext(PokemonContext);
  // console.log(roster);

  return (
    <div className="min-h-screen text-center max-w-[80rem] m-auto">
      <p className="text-3xl py-4">My Roster</p>
      <div className="grid grid-cols-6 gap-4 mx-4 my-4  m-auto">
        {roster &&
          roster.map((pokemon) => {
            return (
              <div key={pokemon.name} className="hover:cursor-pointer border-[2px] rounded-xl border-primary hover:border-accent relative">
                <button
                  onClick={(e) => setRoster(roster.filter((x) => x.name !== pokemon.name))}
                  className="absolute btn btn-outline btn-error right-0  rounded-tr-lg btn-xs border-[1px]">
                  ✕
                </button>
                <NavLink to={`/pokemon/${pokemon.id}`} className="">
                  <PokemonCard pokemon={pokemon} />
                </NavLink>
              </div>
            );
          })}
      </div>
    </div>
  );
}
