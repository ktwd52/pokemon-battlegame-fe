import { CapitalizeFirstLetter } from "../../utils/utils.js";

const PokemonBattleCard = ({ pokemon }) => {
  return (
    <div className="bg-black text-base-content flex flex-col items-center rounded-xl shadow">
      <img className="w-full" src={pokemon.sprite} alt="" />
      <h2 className="font-semibold text-lg">{CapitalizeFirstLetter(pokemon.name)}</h2>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label htmlFor="hp">HP</label>
        <meter className="duration-500 transition-all" value={pokemon.hp} max="100" id="hp">
          HP
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label htmlFor="attack">Attack</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-red-500" value={pokemon.atk} max="100" id="attack">
          Attack
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label htmlFor="defense">Defense</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-blue-500" value={pokemon.def} max="100" id="defense">
          Defense
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3 pb-3">
        <label htmlFor="defense">Speed</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-amber-500" value={pokemon.spd} max="100" id="speed">
          Defense
        </meter>
      </div>
    </div>
  );
};

export default PokemonBattleCard;
