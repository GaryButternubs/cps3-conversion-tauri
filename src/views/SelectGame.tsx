import { NavLink, useParams } from "react-router";
import Heading from "../components/Heading";
import { Game, GameData } from "../types/types";

function SelectGame() {
  const { type } = useParams();

  return (
    <>
      <Heading title="Which game do you want to convert" type={type ?? ""} />
      <main className="flex flex-wrap gap-2 justify-center">
        {Object.values(GameData).map((game: Game, index) => (
          <NavLink
            to={`/selectInput/${type}/${Object.keys(GameData)[index]}`}
            className="btn p-4 flex justify-self-stretch items-center"
            key={game.bgImage}
          >
            {game.abbrTitle ?? game.title}
          </NavLink>
        ))}
      </main>
    </>
  );
}

export default SelectGame;
