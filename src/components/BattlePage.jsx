import PokemonCard from "./PokemonCard";
import { useState, useEffect } from "react";
import LogEntry from "./Battle/LogEntry";
import PokemonBattleCard from "./Battle/PokemonBattleCard";
import { dummyPokemon1, dummyPokemon2, roster } from "../utils/temporaryPokemons";
import { CapitalizeFirstLetter } from "../utils/utils";

const scoreKey = "poki-score";

export default function BattlePage() {
  const [playerPoki, setPlayerPoki] = useState(getBattlePoki(dummyPokemon1));
  const [enemyPoki, setEnemyPoki] = useState(getBattlePoki(dummyPokemon2));
  const [combatInProgress, setCombatInProgress] = useState(false);
  const [combatMode, setCombatMode] = useState(false);
  const [combatLog, setCombatLog] = useState([]);
  const [winner, setWinner] = useState("Undefined");
  const [score, setScore] = useState(JSON.parse(localStorage.getItem(scoreKey)) || { wins: 0, loses: 0 });

  const [fleshPlayer, setFleshPlayer] = useState(0);
  const [fleshEnemy, setFleshEnemy] = useState(0);
  const [playerAttack, setPlayerAttack] = useState(false);
  const [enemyAttack, setEnemyAttack] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [enemyWon, setEnemyWon] = useState(false);

  function resetBattle() {
    setEnemyWon(false);
    setPlayerWon(false);
    setWinner("Undefined");

    setEnemyPoki({ ...enemyPoki, hp: enemyPoki.maxHp });
    setCombatLog([]);
  }

  function handleStart(e) {
    setWinner("Undefined");
    setCombatMode(true);
    setCombatInProgress(true);
  }

  function handleRetry(e) {
    resetBattle();
    setCombatMode(true);
    setCombatInProgress(true);
    setPlayerPoki({ ...playerPoki, hp: playerPoki.maxHp });
  }

  let attacker = "player";

  // useEffect to handle the battle logic and interval
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
    const flashTime = 150;

    if (attacker == "player") {
      const afterAttack = attack(playerPoki, enemyPoki, "player");
      setEnemyPoki(afterAttack);
      setFleshEnemy(flashTime);
      setPlayerAttack(true);

      const fleshInterval = setInterval(() => {
        setFleshEnemy(0);
        clearInterval(fleshInterval);
      }, flashTime);
      const attackInterval = setInterval(() => {
        setPlayerAttack(false);
        clearInterval(attackInterval);
      }, flashTime);

      if (afterAttack.hp <= 0) {
        setScore({ ...score, wins: score.wins + 1 });
        setPlayerWon(true);
        localStorage.setItem(scoreKey, JSON.stringify({ ...score, wins: score.wins + 1 }));
      }
      attacker = "enemy";
    } else {
      const afterAttack = attack(enemyPoki, playerPoki, "enemy");
      setPlayerPoki(afterAttack);
      setFleshPlayer(flashTime);
      setEnemyAttack(true);

      const interval = setInterval(() => {
        setFleshPlayer(0);
        clearInterval(interval);
      }, flashTime);
      const attackInterval = setInterval(() => {
        setEnemyAttack(false);
        clearInterval(attackInterval);
      }, flashTime);

      if (afterAttack.hp <= 0) {
        setEnemyWon(true);
        setScore({ ...score, loses: score.loses + 1 });
        localStorage.setItem(scoreKey, JSON.stringify({ ...score, loses: score.loses + 1 }));
      }
      attacker = "player";
    }
  }

  function attack(attacker, defender, attackerText) {
    const dmg = calculateDamage(attacker, defender);
    defender.hp -= dmg;
    setCombatLog((prev) => [
      { color: attackerText, attacker: attacker.name, defender: defender.name, damage: dmg, defenderHp: defender.hp },
      ...prev,
    ]);
    if (defender.hp <= 0) {
      setWinner(attacker.name);
      setCombatInProgress(false);
      // setCombatLog()
    }
    return defender;
  }

  function calculateDamage(attacker, defender) {
    const randomFactor = Math.random() * 0.5 + 0.5; // Damage deviation [0.75 - 1.25]
    // alert(`Atk = ${attacker.atk}, Def = ${defender.def}, randomFactor = ${randomFactor * 10}`);
    return Math.floor((attacker.atk / defender.def) * randomFactor * 10);
  }

  // function ShopPopup(winnerName) {
  //   setWinner(winnerName);
  //   document.getElementById("battleResult").showModal();
  // }

  function getBattlePoki(pokemon) {
    return {
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      atk: pokemon.stats[1].base_stat,
      def: pokemon.stats[2].base_stat,
      spd: pokemon.stats[5].base_stat,
      hp: pokemon.stats[0].base_stat,
      maxHp: pokemon.stats[0].base_stat,
    };
  }

  return (
    <div className="min-h-screen flex">
      {/* Roster */}
      <div className="w-1/4  text-center text-3xl bg-base-300 pt-4">
        <p>Your Roster</p>
        {!combatInProgress ? (
          <div className="grid grid-cols-3 text-xs gap-4 px-2 py-4">
            {roster.map((pokemon) => {
              return (
                <div
                  key={pokemon.name}
                  onClick={(e) => {
                    setPlayerPoki(getBattlePoki(pokemon));
                    setCombatMode(false);
                    resetBattle();
                  }}
                  className="hover:cursor-pointer border-[2px] border-opacity-25 border-accent hover:border-opacity-100 rounded-xl">
                  <PokemonCard pokemon={pokemon} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        )}
      </div>
      {/* Battle Section */}
      <div className="w-1/2">
        <p className=" text-center text-3xl pt-4">Prepare for Battle!</p>
        <Popup winner={winner} />
        <div className="flex justify-evenly gap-4 mt-12 items-center max-w-[40rem] m-auto pb-4">
          <div
            className={`border-[2px] rounded-xl border-error border-opacity-0 transition-all duration-150 
              ${fleshPlayer && `border-opacity-100`} ${playerAttack && `scale-110`} ${playerWon && `scale-125 border-success border-opacity-100`}`}>
            <PokemonBattleCard pokemon={playerPoki} />
          </div>
          <p className="text-3xl">VS</p>
          <div
            className={`border-[2px] rounded-xl border-error border-opacity-0 transition-all duration-150 
            ${fleshEnemy && `border-opacity-100`} ${enemyAttack && `scale-110`}  ${enemyWon && `scale-125 border-success border-opacity-100`}`}>
            <PokemonBattleCard pokemon={enemyPoki} />
          </div>
        </div>
        {combatMode ? (
          <div className="max-w-[40rem] m-auto text-center ">
            {winner == "Undefined" ? (
              <div className="bg-primary py-4 mt-4 text-xl">Battle log</div>
            ) : (
              <div className="bg-error text-error-content font-semibold px-4 mt-4 text-xl flex justify-between items-center">
                <div className="text-xl">{CapitalizeFirstLetter(winner)} has won!</div>
                {!combatInProgress && (
                  <button onClick={handleRetry} className="btn btn-outline btn-base my-4">
                    Try again
                  </button>
                )}
              </div>
            )}
            <div className="mb-4 py-4  flex justify-center">
              <div className="text-left max-w-[30rem] m-auto ">
                {combatLog.map((entry, index) => {
                  return <LogEntry key={index} entry={entry} />;
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
      {/* Score Section */}
      <div className="w-1/4 text-center text-3xl bg-base-300 pt-4">
        <p>Your Score</p>
        <div className="mt-16 flex justify-around items-center text-2xl">
          <p>Wins: {score.wins}</p>
          <p>Loses: {score.loses}</p>
        </div>
      </div>
    </div>
  );
}

const Popup = ({ winner }) => {
  return (
    <>
      <dialog id="battleResult" className="modal text-center">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Battle finished!</h3>
          <p className="py-4">{`${winner} has won!`}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
