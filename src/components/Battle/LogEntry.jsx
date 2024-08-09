import { CapitalizeFirstLetter } from "../../utils/utils.js";

const LogEntry = ({ entry: { color, attacker, defender, damage, defenderHp, weaknessLog } }) => {
  return (
    <div className="">
      {defenderHp <= 0 && <p className="text-warning text-lg">{`${CapitalizeFirstLetter(defender)} has been defeated!`}</p>}
      <div className={color == "player" ? "text-base" : "text-accent"}>
        {CapitalizeFirstLetter(attacker)} deals <span className="font-bold">{damage}</span> damage to
        {" " + CapitalizeFirstLetter(defender)}!
        {weaknessLog.length > 0 && <span className="text-secondary italic font-semibold"> {weaknessLog}! </span>}
      </div>
    </div>
  );
};

export default LogEntry;
