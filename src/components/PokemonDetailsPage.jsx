import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CapitalizeFirstLetter } from "../utils/utils";
import LoadingSpinner from "./LoadingSpinner";
import { saveRoster } from "../utils/storage";
import heartIcon from "../assets/heart-icon.svg";
import heartIconSelected from "../assets/heart-icon-selected.svg";
import { PokemonContext } from "./context/PokemonContext";

export default function PokemonDetailsPage() {
  const { roster, setRoster } = useContext(PokemonContext);
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [flavorText, setFlavorText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const [inRoster, setInRoster] = useState(false);
  const { id } = useParams();
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  useEffect(() => {
    if (!pokemon) return;
    const found = roster.find((x) => x.name === pokemon.name);
    if (found) setInRoster(true);
    else setInRoster(false);
  }, [pokemon]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        // console.log(res.data.types);
        setPokemon(res.data);

        const _weaknesses = [];
        for (let i = 0; i < res.data.types.length; i++) {
          axios
            .get(res.data.types[i].type.url)
            .then((res) => {
              for (let weakness of res.data.damage_relations.double_damage_from) {
                if (!_weaknesses.includes(weakness.name)) _weaknesses.push(weakness.name);
              }
            })
            .catch((err) => console.log(err))
            .finally(() => setWeaknesses(_weaknesses));
        }

        axios.get(res.data.species.url).then((res) => {
          setSpecies(res.data);

          const category = res.data.genera.find((x) => x.language.name == "en").genus.replace(/Pokémon/g, "");
          setCategory(category);

          const flText = res.data.flavor_text_entries.find((x) => x.language.name == "en").flavor_text;
          setFlavorText(flText.replace(/\f/g, " "));
        });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function calcGender(rate) {
    // console.log(rate);
    if (!rate) return "Unknown";
    if (rate == -1) return "Genderless";
    const female = (rate / 8) * 100;
    const male = 100 - female;
    if (female > male) return "Female";
    else return "Male";
  }

  // Function to map stat names to more readable formats
  const formatStatName = (name) => {
    switch (name) {
      case "hp":
        return "HP";
      case "attack":
        return "Attack";
      case "defense":
        return "Defense";
      case "special-attack":
        return "Special Attack";
      case "special-defense":
        return "Special Defense";
      case "speed":
        return "Speed";
      default:
        return name;
    }
  };

  // Set a max value for the stats
  const MAX_STAT_VALUE = 220;

  return (
    <div className="min-h-screen max-w-[80rem] m-auto bg-base-300">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {/* Top Part */}
          <div className="flex items-center justify-center gap-6">
            <p className="text-3xl font-semibold text-center pt-4">{`${CapitalizeFirstLetter(pokemon.name)} #${id}`}</p>
            <img
              onClick={() => {
                if (!inRoster) {
                  setInRoster(true);
                  setRoster([...roster, pokemon]);
                  saveRoster([...roster, pokemon]);
                } else {
                  const r = roster.filter((x) => x.name !== pokemon.name);
                  setRoster(r);
                  saveRoster(r);
                  setInRoster(false);
                }
              }}
              className="w-8 pt-4 opacity-80 hover:cursor-pointer hover:animate-pulse"
              src={inRoster ? heartIconSelected : heartIcon}
              alt=""
            />
          </div>
          <div className="flex justify-center gap-12 mt-4">
            <img className="w-1/3" src={pokemon.sprites.front_default} alt="" />
            <div className="w-1/3 flex flex-col gap-4">
              <p className="mt-12 font-semibold text-xl text-warning">{flavorText}</p>
              <div className="flex justify-between bg-primary py-4 px-8 rounded-xl text-primary-content font-semibold">
                <div className="flex flex-col gap-4">
                  <div>
                    <p>Height</p>
                    <p className="text-accent">{pokemon.height / 10} meters</p>
                  </div>
                  <div>
                    <p>Weight</p>
                    <p className="text-accent">{pokemon.weight / 10} kg</p>
                  </div>
                  <div>
                    <p>Gender</p>
                    <p className="text-accent">{calcGender(species?.gender_rate)}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <p>Category</p>
                    <p className="text-accent">{category}</p>
                  </div>
                  <div>
                    <p>Abilities</p>
                    <div>
                      {pokemon.abilities.map((ability, index) => {
                        return (
                          <p className="text-accent" key={index}>
                            {CapitalizeFirstLetter(ability.ability.name)}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Part */}
          <div className="flex justify-center gap-12 mt-4 pb-12">
            {/* Stats */}
            <div className="flex flex-col gap-3 w-1/3">
              <div className="flex flex-wrap gap-4">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="flex flex-col items-center">
                    {/* <span className="text-sm font-medium mt-1 text-accent">{stat.base_stat}</span> */}
                    <div className="relative w-12 bg-primary-content rounded-none h-48">
                      <div
                        className="bg-primary rounded-none absolute bottom-0"
                        style={{
                          height: `${(stat.base_stat / MAX_STAT_VALUE) * 100}%`, // Scale height based on stat value
                          width: "100%",
                        }}></div>
                    </div>
                    <div className="text-sm font-medium  mb-2 max-w-12">{formatStatName(stat.stat.name)}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Types and Weaknesses */}
            <div className="flex flex-col gap-6 font-semibold  w-1/3">
              <div>
                <p>Type</p>
                <div className="flex gap-4 flex-wrap text-warning">
                  {pokemon.types.map((type, index) => {
                    return (
                      <p className="bg-warning text-warning-content px-3 py-1 text-lg rounded-lg mt-1" key={index}>
                        {CapitalizeFirstLetter(type.type.name)}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div>
                <p>Weaknesses</p>
                <div className="flex flex-wrap gap-4 text-warning">
                  {weaknesses.map((x, index) => {
                    return (
                      <p className="bg-accent text-accent-content px-3 py-1 text-lg rounded-lg mt-1" key={index}>
                        {CapitalizeFirstLetter(x)}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
