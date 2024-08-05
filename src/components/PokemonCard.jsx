export default function PokemonCard({ pokemon }) {
  return (
    <div className="bg-black text-base-content flex flex-col items-center rounded-xl shadow">
      <img src={pokemon.sprites.front_default} alt="" />
      <h2 className="font-semibold text-lg">{pokemon.name}</h2>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label for="hp">HP</label>
        <meter value={pokemon.stats[0].base_stat} max="100" id="hp">
          HP
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label for="attack">Attack</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-red-500" value={pokemon.stats[1].base_stat} max="100" id="attack">
          Attack
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label for="defense">Defense</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-blue-500" value={pokemon.stats[2].base_stat} max="100" id="defense">
          Defense
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3 pb-3">
        <label for="defense">Speed</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-amber-500" value={pokemon.stats[2].base_stat} max="100" id="defense">
          Defense
        </meter>
      </div>
    </div>
  );
}
