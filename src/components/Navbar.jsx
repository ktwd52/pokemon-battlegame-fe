import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import Search from "./Search";

export default function Navbar() {
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", "business");
  }, []);

  return (
    <div className="bg-primary text-primary-content">
      <div className="  max-w-[60rem] m-auto flex justify-around items-center py-2 ">
        <NavLink to="battle" className={({ isActive }) => (isActive ? "bg-base-300 text-base-content" : "")}>
          <p className="btn btn-ghost text-xl">To Battle!</p>
        </NavLink>
        <Search />
        <nav className="">
          <ul className="menu menu-horizontal px-1 text-lg">
            <li>
              <NavLink to="/">Pokemons </NavLink>
            </li>
            <li>
              <NavLink to="roster">Roster</NavLink>
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
