import { NavLink } from "react-router-dom";
import { useEffect } from "react";

export default function Navbar() {
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", "business");
  }, []);

  return (
    <div className="bg-primary text-primary-content">
      <div className="navbar  max-w-[60rem] m-auto">
        <div className="flex-1 ">
          <NavLink to="battle" className={({ isActive }) => (isActive ? "bg-base-300 text-base-content" : "")}>
            <p className="btn btn-ghost text-xl">To Battle!</p>
          </NavLink>
        </div>
        <nav className="flex-none">
          <ul className="menu menu-horizontal px-1 text-lg">
            <li>
              <NavLink to="/">Pokemons </NavLink>
            </li>
            <li>
              <NavLink to="roaster">Roster</NavLink>
            </li>
            <li>
              <NavLink to="leaderboard">Leaderboard</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
