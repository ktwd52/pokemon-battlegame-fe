import { CapitalizeFirstLetter } from "../../utils/utils.js";

const LogEntry = ({ entry: { color, attacker, defender, damage, defenderHp } }) => {
  return (
    <div className="">
      {defenderHp <= 0 && <p className="text-warning text-lg">{`${CapitalizeFirstLetter(defender)} has been defeated!`}</p>}
      <div className={color == "player" ? "text-base" : "text-accent"}>
        {CapitalizeFirstLetter(attacker)} deals <span className="font-bold">{damage}</span> damage to {CapitalizeFirstLetter(defender)}!
      </div>
    </div>
  );
};

export default LogEntry;
