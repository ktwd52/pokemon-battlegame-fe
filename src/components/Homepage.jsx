import PokemonCard from "./PokemonCard";

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
  return (
    <div className="min-h-screen text-center bg-base-100 max-w-[80rem] m-auto">
      <p className="text-2xl my-6">Pokemons</p>
      <div className="grid grid-cols-6 gap-4">
        <PokemonCard pokemon={dummyPokemon} />
        <PokemonCard pokemon={dummyPokemon} />
        <PokemonCard pokemon={dummyPokemon} />
        <PokemonCard pokemon={dummyPokemon} />
        <PokemonCard pokemon={dummyPokemon} />
        <PokemonCard pokemon={dummyPokemon} />
        <PokemonCard pokemon={dummyPokemon} />
        <PokemonCard pokemon={dummyPokemon} />
        <PokemonCard pokemon={dummyPokemon} />
        <PokemonCard pokemon={dummyPokemon} />
      </div>
    </div>
  );
}
