const dummyPokemon1 = {
  name: "bulbasaur",
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
  },
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

const dummyPokemon2 = {
  name: "raticate",
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png",
  },
  stats: [
    {
      base_stat: 55,
      effort: 0,
      stat: {
        name: "hp",
        url: "https://pokeapi.co/api/v2/stat/1/",
      },
    },
    {
      base_stat: 81,
      effort: 0,
      stat: {
        name: "attack",
        url: "https://pokeapi.co/api/v2/stat/2/",
      },
    },
    {
      base_stat: 60,
      effort: 0,
      stat: {
        name: "defense",
        url: "https://pokeapi.co/api/v2/stat/3/",
      },
    },
    {
      base_stat: 50,
      effort: 0,
      stat: {
        name: "special-attack",
        url: "https://pokeapi.co/api/v2/stat/4/",
      },
    },
    {
      base_stat: 70,
      effort: 0,
      stat: {
        name: "special-defense",
        url: "https://pokeapi.co/api/v2/stat/5/",
      },
    },
    {
      base_stat: 97,
      effort: 2,
      stat: {
        name: "speed",
        url: "https://pokeapi.co/api/v2/stat/6/",
      },
    },
  ],
  types: [
    {
      slot: 1,
      type: {
        name: "normal",
        url: "https://pokeapi.co/api/v2/type/1/",
      },
    },
  ],
};

import PokemonCard from "./PokemonCard";
import { useState, useEffect } from "react";

export function CapitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export default function BattlePage() {
  const [playerPoki, setPlayerPoki] = useState({
    name: CapitalizeFirstLetter(dummyPokemon1.name),
    sprite: dummyPokemon1.sprites.front_default,
    atk: dummyPokemon1.stats[1].base_stat,
    def: dummyPokemon1.stats[2].base_stat,
    spd: dummyPokemon1.stats[5].base_stat,
    hp: dummyPokemon1.stats[0].base_stat,
  });

  const [enemyPoki, setEnemyPoki] = useState({
    name: CapitalizeFirstLetter(dummyPokemon2.name),
    sprite: dummyPokemon2.sprites.front_default,
    atk: dummyPokemon2.stats[1].base_stat,
    def: dummyPokemon2.stats[2].base_stat,
    spd: dummyPokemon2.stats[5].base_stat,
    hp: dummyPokemon2.stats[0].base_stat,
  });

  const [combatInProgress, setCombatInProgress] = useState(false);
  const [combatMode, setCombatMode] = useState(false);
  const [combatLog, setCombatLog] = useState([]);
  const [winner, setWinner] = useState("Undefined");
  // const [attacker, setAttacker] = useState("player");

  function handleStart(e) {
    setWinner("Undefined");
    setCombatMode(true);
    setCombatInProgress(true);
  }

  function handleRetry(e) {
    setWinner("Undefined");
    setCombatLog([]);
    setCombatMode(true);
    setCombatInProgress(true);
    setPlayerPoki({ ...playerPoki, hp: dummyPokemon1.stats[0].base_stat });
    setEnemyPoki({ ...enemyPoki, hp: dummyPokemon2.stats[0].base_stat });
  }

  let attacker = "player";
  useEffect(() => {
    if (enemyPoki.spd > playerPoki.spd) attacker = "enemy";

    const interval = setInterval(() => {
      if (combatInProgress) {
        BattleController();
      } else {
        // console.log("Battle ended!");
        clearInterval(interval);
      }
    }, 1000);
    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [combatInProgress]);

  function BattleController() {
    if (attacker == "player") {
      const dmg = calculateDamage(playerPoki, enemyPoki);
      damageEnemy(dmg);
      setCombatLog((prev) => [{ color: "player", attacker: playerPoki.name, defender: enemyPoki.name, damage: dmg }, ...prev]);
      attacker = "enemy";
    } else {
      const dmg = calculateDamage(enemyPoki, playerPoki);
      damagePlayer(dmg);
      setCombatLog((prev) => [{ color: "enemy", attacker: enemyPoki.name, defender: playerPoki.name, damage: dmg }, ...prev]);
      attacker = "player";
    }
  }

  function calculateDamage(attacker, defender) {
    const randomFactor = Math.random() * 0.5 + 0.5;
    return Math.floor((attacker.atk / defender.def) * (randomFactor * 10));
  }

  function damageEnemy(damage) {
    setEnemyPoki((prev) => {
      const hpLeft = prev.hp - damage;
      if (hpLeft <= 0) {
        // ShopPopup(playerPoki.name);
        setWinner(playerPoki.name);
        setCombatInProgress(false);
      }
      return { ...prev, hp: hpLeft };
    });
  }

  function damagePlayer(damage) {
    setPlayerPoki((prev) => {
      const hpLeft = prev.hp - damage;

      if (hpLeft <= 0) {
        // ShopPopup(enemyPoki.name);
        setWinner(enemyPoki.name);
        setCombatInProgress(false);
      }
      return { ...prev, hp: hpLeft };
    });
  }

  function ShopPopup(winnerName) {
    setWinner(winnerName);
    document.getElementById("battleResult").showModal();
  }

  return (
    <div className="min-h-screen">
      <p className=" text-center text-3xl mt-4">Prepare for the Battle!</p>
      <Popup winner={winner} />
      <div className="flex justify-evenly gap-4 mt-12 items-center max-w-[40rem] m-auto">
        <PokemonBattleCard pokemon={playerPoki} />
        <p className="text-3xl">VS</p>
        <PokemonBattleCard pokemon={enemyPoki} />
      </div>
      {combatMode ? (
        <div className="max-w-[40rem] m-auto text-center">
          {winner == "Undefined" ? (
            <div className="bg-primary py-4 mt-4 text-xl">Battle log</div>
          ) : (
            <div className="bg-error text-error-content font-semibold px-4 mt-4 text-xl flex justify-between items-center">
              <div className="text-xl">{winner} has won!</div>
              {!combatInProgress && (
                <button onClick={handleRetry} className="btn btn-outline btn-base my-4">
                  Try again
                </button>
              )}
            </div>
          )}
          <div className="text-left mb-4 py-4 bg-base-300">
            <div className="max-w-[30rem] m-auto">
              {combatLog.map((entry) => {
                return <LogEntry entry={entry} />;
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-[60rem] m-auto text-center">
          <button onClick={handleStart} className="btn btn-outline btn-accent my-4 btn-lg">
            Start Battle!
          </button>
        </div>
      )}
    </div>
  );
}

const LogEntry = ({ entry: { color, attacker, defender, damage } }) => {
  return (
    <div>
      <p className={color == "player" ? "text-base" : "text-accent"}>{`${attacker} deals ${damage} to ${defender}!`}</p>
    </div>
  );
};

const PokemonBattleCard = ({ pokemon }) => {
  return (
    <div className="bg-black text-base-content flex flex-col items-center rounded-xl shadow">
      <img className="w-full" src={pokemon.sprite} alt="" />
      <h2 className="font-semibold text-lg">{CapitalizeFirstLetter(pokemon.name)}</h2>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label for="hp">HP</label>
        <meter className="duration-500 transition-all" value={pokemon.hp} max="100" id="hp">
          HP
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label for="attack">Attack</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-red-500" value={pokemon.atk} max="100" id="attack">
          Attack
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3">
        <label for="defense">Defense</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-blue-500" value={pokemon.def} max="100" id="defense">
          Defense
        </meter>
      </div>
      <div className="flex gap-2 items-center justify-between w-full px-3 pb-3">
        <label for="defense">Speed</label>
        <meter className="[&::-webkit-meter-optimum-value]:bg-amber-500" value={pokemon.spd} max="100" id="speed">
          Defense
        </meter>
      </div>
    </div>
  );
};

const Popup = ({ winner }) => {
  return (
    <>
      <dialog id="battleResult" className="modal text-center">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Battle finished!</h3>
          <p className="py-4">{`${CapitalizeFirstLetter(winner)} has won!`}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
