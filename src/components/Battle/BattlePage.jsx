import PokemonCard from "../PokemonCard";
import { useState, useEffect, useContext } from "react";
import LogEntry from "./LogEntry";
import PokemonBattleCard from "./PokemonBattleCard";
import { dummyPokemon1, dummyPokemon2 } from "../../utils/temporaryPokemons";
import { CapitalizeFirstLetter } from "../../utils/utils";
import { PokemonContext } from "../context/PokemonContext";
import axios from "axios";
import serverConfig from "../../utils/serverConfig";
import { saveUsername, loadUsername } from "../../utils/storage";
import { useFetcher } from "react-router-dom";

const scoreKey = "poki-score";

export default function BattlePage() {
  const postToLeaderboard = `${serverConfig.serverUri}/leaderboard`;
  // console.log(postToLeaderboard);
  const [userName, setUserName] = useState(loadUsername());
  const [newUsername, setNewUsername] = useState(userName);
  const [editName, setEditName] = useState(false);
  const { roster } = useContext(PokemonContext);
  const [loading, setLoading] = useState(true);
  const [playerPoki, setPlayerPoki] = useState(null);
  const [enemyPoki, setEnemyPoki] = useState(null);
  const [combatInProgress, setCombatInProgress] = useState(false);
  const [combatMode, setCombatMode] = useState(false);
  const [combatLog, setCombatLog] = useState([]);
  const [winner, setWinner] = useState("Undefined");
  const [score, setScore] = useState(
    JSON.parse(localStorage.getItem(scoreKey)) || {
      wins: 0,
      loses: 0,
      score: 0,
    }
  );
  const [fleshPlayer, setFleshPlayer] = useState(0);
  const [fleshEnemy, setFleshEnemy] = useState(0);
  const [playerAttack, setPlayerAttack] = useState(false);
  const [enemyAttack, setEnemyAttack] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [enemyWon, setEnemyWon] = useState(false);
  const [newEnemy, setNewEnemy] = useState(false);
  const [refresh, setRefresh] = useState(false);
  let requestSent = false;

  const getUserScoreUrl = `${serverConfig.serverUri}/leaderboard/${userName}`;
  useEffect(() => {
    axios
      .get(getUserScoreUrl)
      .then((res) =>
        setScore({
          wins: res.data.wins,
          loses: res.data.losses,
          score: res.data.score,
        })
      )
      .catch((err) => console.log(err))
      .finally(() => {});
  }, [userName]);

  useEffect(() => {
    if (requestSent) return;
    requestSent = true; // Prevent multiple requests
    setLoading(true);
    const randomPokemon = Math.floor(Math.random() * 1025) + 1;
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`)
      .then((res) => {
        // console.log(res.data);
        setEnemyPoki(getBattlePoki(res.data));
        onEnemyPokiSet(getBattlePoki(res.data));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });

    return () => {
      // requestSent = false;
    };
  }, [newEnemy]);

  function onEnemyPokiSet() {}

  function onPlayerPokiSet() {}

  function resetBattle() {
    setEnemyWon(false);
    setPlayerWon(false);
    setWinner("Undefined");
    setCombatMode(false);
    setEnemyPoki({ ...enemyPoki, hp: enemyPoki.maxHp });
    onEnemyPokiSet({ ...enemyPoki, hp: enemyPoki.maxHp });
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
    onPlayerPokiSet({ ...playerPoki, hp: playerPoki.maxHp });
  }

  let attacker = "player";

  // useEffect to handle the battle logic and interval
  useEffect(() => {
    if (!enemyPoki || !playerPoki) return;
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
        const _score = { ...score, wins: score.wins + 1 };
        setScore(_score);
        setPlayerWon(true);
        localStorage.setItem(scoreKey, JSON.stringify(_score));
        EndGame(_score);
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
        const _score = { ...score, loses: score.loses + 1 };
        setScore(_score);
        localStorage.setItem(scoreKey, JSON.stringify(_score));
        EndGame(_score);
      }
      attacker = "player";
    }
  }

  function EndGame(_score) {
    const body = {
      username: userName,
      wins: _score.wins,
      losses: _score.loses,
    };
    axios.post(postToLeaderboard, body).catch((err) => console.log(err));
  }

  function attack(attacker, defender, attackerText) {
    let weaknessLog = "";
    const dmgResult = calculateDamage(attacker, defender, weaknessLog);
    // console.log(dmgResult.weaknessLog);
    defender.hp -= dmgResult.dmg;
    setCombatLog((prev) => [
      {
        color: attackerText,
        attacker: attacker.name,
        defender: defender.name,
        damage: dmgResult.dmg,
        defenderHp: defender.hp,
        weaknessLog: dmgResult.weaknessLog,
      },
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
    let dmgMul = 1;
    let weaknessLog = "";
    // console.log("Attacker types: " + attacker.types);
    // console.log("Defender weakness: " + defender.weakness);

    for (let weakness of defender.weakness) {
      // console.log(weakness);
      if (attacker.types.includes(weakness)) {
        dmgMul = 2;
        // console.log(attacker.name + " has weakness to " + weakness + "! Double damage!");
        weaknessLog =
          "Double damage! " +
          CapitalizeFirstLetter(defender.name) +
          " is weak to '" +
          CapitalizeFirstLetter(weakness) +
          "'";
        break;
      }
    }

    const randomFactor = Math.random() * 0.5 + 0.5; // Damage deviation [0.75 - 1.25]
    // alert(`Atk = ${attacker.atk}, Def = ${defender.def}, randomFactor = ${randomFactor * 10}`);
    return {
      dmg: Math.floor(
        (attacker.atk / defender.def) * randomFactor * 10 * dmgMul
      ),
      weaknessLog,
    };
  }

  // function ShopPopup(winnerName) {
  //   setWinner(winnerName);
  //   document.getElementById("battleResult").showModal();
  // }

  function getBattlePoki(pokemon) {
    if (!pokemon) return;
    // console.log(pokemon);

    const _weaknesses = [];
    for (let i = 0; i < pokemon.types.length; i++) {
      axios
        .get(pokemon.types[i].type.url)
        .then((res) => {
          for (let weakness of res.data.damage_relations.double_damage_from) {
            if (!_weaknesses.includes(weakness.name))
              _weaknesses.push(weakness.name);
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setRefresh(!refresh);
        });
    }

    const _types = pokemon.types.map((x) => {
      return x.type.name;
    });

    return {
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      atk: pokemon.stats[1].base_stat,
      def: pokemon.stats[2].base_stat,
      spd: pokemon.stats[5].base_stat,
      hp: pokemon.stats[0].base_stat,
      maxHp: pokemon.stats[0].base_stat,
      weakness: _weaknesses,
      types: _types,
    };
  }

  function handleUsernameChange(e) {
    setNewUsername(e.target.value);
  }

  return (
    <div className="min-h-screen flex flex-wrap bg">
      {/* Roster */}
      <div className="w-full md:w-1/3 text-center text-3xl bg-base-300 pt-4 ">
        <p>Your Roster</p>
        {!combatInProgress ? (
          <div className="grid grid-cols-4 text-xs gap-4 px-2 py-4">
            {roster.map((pokemon) => {
              return (
                <div
                  key={pokemon.name}
                  onClick={(e) => {
                    setPlayerPoki(getBattlePoki(pokemon));
                    onPlayerPokiSet(getBattlePoki(pokemon));
                    setCombatMode(false);
                    resetBattle();
                  }}
                  className="hover:cursor-pointer border-[2px] border-opacity-25 border-accent hover:border-opacity-100 rounded-xl"
                >
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
      <div className="w-full md:w-2/3">
        {/* Score Section */}
        <div className="w-full text-center text-3xl bg-base-300 py-4">
          <div className="">
            {!editName ? (
              <div className="flex justify-center items-center gap-4">
                <p> {userName}</p>
                {!combatInProgress && (
                  <button
                    className="btn btn-outline btn-warning btn-sm"
                    onClick={() => {
                      setNewUsername(userName);
                      setEditName(true);
                    }}
                  >
                    Change Name
                  </button>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center gap-4">
                <input
                  onChange={handleUsernameChange}
                  value={newUsername}
                  type="text"
                  placeholder="Enter Username"
                  className="input input-bordered w-full max-w-xs"
                />
                {newUsername != "" && (
                  <button
                    className="btn btn-outline btn-success btn-sm"
                    onClick={() => {
                      if (newUsername == "") return;
                      setEditName(false);
                      if (newUsername !== userName) {
                        setScore({ wins: 0, loses: 0 });
                        saveUsername(newUsername);
                      }
                      setUserName(newUsername);
                    }}
                  >
                    Confirm
                  </button>
                )}
                <button
                  onClick={() => setEditName(false)}
                  className="btn btn-outline btn-neutral btn-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-around items-center text-2xl ">
            <p className="font-semibold">Wins: {score.wins}</p>
            <p className="font-semibold">Loses: {score.loses}</p>
          </div>
        </div>
        <p className="text-center text-3xl py-4">Prepare for Battle!</p>
        <Popup winner={winner} />
        <div className=" flex justify-evenly gap-4 mt-6 items-center max-w-[60rem] m-auto pb-4">
          {playerPoki ? (
            <div className="flex gap-4">
              <div className="flex flex-col justify-between ">
                <PokemonTypes pokemon={playerPoki} />
                <PokemonWeaknesses pokemon={playerPoki} isCombat={combatMode} />
              </div>
              <div
                className={`border-[2px] rounded-xl border-error border-opacity-0 transition-all duration-150
                ${fleshPlayer && `border-opacity-100`} ${
                  playerAttack && `scale-110`
                } ${
                  playerWon && `scale-125 border-success border-opacity-100`
                }`}
              >
                <PokemonBattleCard pokemon={playerPoki} />
              </div>
            </div>
          ) : (
            <div className="skeleton bg-secondary rounded-xl h-[20rem] w-[12rem]"></div>
          )}
          <p className="text-3xl">VS</p>
          {!loading && enemyPoki ? (
            <div className="flex gap-4">
              <div
                className={`border-[2px] rounded-xl border-error border-opacity-0 transition-all duration-150 min-h-[20rem] min-w-[12rem]
            ${fleshEnemy && `border-opacity-100`} ${
                  enemyAttack && `scale-110`
                }  ${
                  enemyWon && `scale-125 border-success border-opacity-100`
                }`}
              >
                <PokemonBattleCard pokemon={enemyPoki} />
              </div>
              <div className="flex flex-col justify-between ">
                <PokemonTypes pokemon={enemyPoki} />
                <PokemonWeaknesses pokemon={enemyPoki} isCombat={combatMode} />
              </div>
            </div>
          ) : (
            <div>
              <div className="skeleton bg-primary rounded-xl h-[20rem] w-[12rem]"></div>
            </div>
          )}
        </div>
        {combatMode ? (
          <div className="max-w-[40rem] m-auto text-center ">
            {winner == "Undefined" ? (
              <div className="bg-primary py-4 mt-4 text-xl">Battle log</div>
            ) : (
              <div className="bg-error text-error-content font-semibold px-4 mt-4 text-xl flex justify-between items-center">
                <div className="text-xl">
                  {CapitalizeFirstLetter(winner)} has won!
                </div>
                {!combatInProgress && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleRetry}
                      className="btn btn-outline btn-base my-4"
                    >
                      Try again
                    </button>
                    <button
                      onClick={() => {
                        resetBattle();
                        setPlayerPoki({ ...playerPoki, hp: playerPoki.maxHp });
                        onPlayerPokiSet({
                          ...playerPoki,
                          hp: playerPoki.maxHp,
                        });
                        setNewEnemy(!newEnemy);
                      }}
                      className={`btn btn-outline btn-neutral my-4`}
                    >
                      Find Opponent
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="mb-4 py-4  flex justify-center">
              <div className="text-left w-full m-auto flex flex-col gap-3">
                {combatLog.map((entry, index) => {
                  return <LogEntry key={index} entry={entry} />;
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[60rem] m-auto text-center flex justify-around">
            {playerPoki && (
              <button
                onClick={handleStart}
                className="btn btn-outline btn-accent my-4 btn-lg"
              >
                Start Battle!
              </button>
            )}
            <button
              onClick={() => {
                resetBattle();
                setNewEnemy(!newEnemy);
              }}
              className={`btn btn-outline btn-neutral btn-lg my-4`}
            >
              Find Opponent
            </button>
          </div>
        )}
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

const PokemonTypes = ({ pokemon }) => {
  // console.log(pokemon);
  return (
    <div className="">
      <p className="text-center mb-1">Types:</p>
      <div className="flex flex-col gap-1">
        {pokemon.types.map((x, index) => {
          return (
            <div
              key={index}
              className="italic text-warning-content bg-warning px-2 rounded-md font-semibold"
            >
              {CapitalizeFirstLetter(x)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PokemonWeaknesses = ({ pokemon, isCombat }) => {
  // console.log(pokemon);
  // if (pokemon.weakness.length == 0) return;
  return (
    <div className="">
      <p className="text-center mb-1">Weakness:</p>
      {isCombat ? (
        <div className="flex flex-col gap-1">
          {pokemon.weakness.map((x, index) => {
            return (
              <div
                key={index}
                className="italic text-accent-content bg-accent px-2 rounded-md font-semibold"
              >
                {CapitalizeFirstLetter(x)}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center font-semibold text-warning">???</div>
      )}
    </div>
  );
};
