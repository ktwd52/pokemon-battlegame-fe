export default function PokemonCard({ pokemon }) {
  function CapitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  return (
    <div className="bg-black text-base-content flex flex-col items-center rounded-xl shadow text-sm">
      <img className="w-full" src={pokemon.sprites.front_default} alt="" />
      <h2 className="font-semibold text-lg">{CapitalizeFirstLetter(pokemon.name)}</h2>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label htmlFor="hp">HP</label>
        <meter value={pokemon.stats[0].base_stat} max="200" id="hp">
          HP
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label htmlFor="attack">Attack</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-red-500" value={pokemon.stats[1].base_stat} max="200" id="attack">
          Attack
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label htmlFor="defense">Defense</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-blue-500" value={pokemon.stats[2].base_stat} max="200" id="defense">
          Defense
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3 pb-3">
        <label htmlFor="defense">Speed</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-amber-500" value={pokemon.stats[5].base_stat} max="200" id="speed">
          Defense
        </meter>
      </div>
    </div>
  );
}
