import { CapitalizeFirstLetter } from "../../utils/utils.js";

const LogEntry = ({ entry: { color, attacker, defender, damage, defenderHp, weaknessLog } }) => {
  return (
    <div className={`px-2 py-1 rounded-lg  ${color == "player" ? "bg-primary " : "bg-secondary "}}`}>
      {defenderHp <= 0 && (
        <p className={`rounded-lg text-lg font-bold ${color == "player" ? "text-warning " : "text-neutral "}`}>{`${CapitalizeFirstLetter(
          defender
        )} has been defeated!`}</p>
      )}
      <div className={color == "player" ? "text-primary-content" : "text-accent-content font-semibold"}>
        <strong>{CapitalizeFirstLetter(attacker)}</strong> deals <span className="font-bold">{damage}</span> damage to
        {" " + CapitalizeFirstLetter(defender)}!
        {weaknessLog.length > 0 && (
          <span className={`italic font-semibold ${color == "player" ? "text-primary-content  " : "text-secondary-content  "}`}>
            <br></br> {weaknessLog}!
          </span>
        )}
      </div>
    </div>
  );
};

export default LogEntry;
