import { MouseEvent, useContext, useState } from "react";
import { NavLink, useParams } from "react-router";
import { ConvertContext } from "../contexts/ConvertContext";
import convertROM from "../convert-helper";
import { GameData, GameList } from "../types/types";
import Heading from "../components/Heading";

function Convert() {
  const { type, game } = useParams();
  const [converting, setConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const files = useContext(ConvertContext)?.files;
  const outputDir = useContext(ConvertContext)?.outputDir;

  const ConvertROM = async (e: MouseEvent) => {
    e.preventDefault();

    if (files && outputDir) {
      setConverting(true);
      await convertROM(
        type ?? "",
        (game ?? "") as keyof GameList,
        files,
        outputDir,
        setProgress,
        setText,
      );
    }
  };

  return (
    <>
      <Heading
        title={GameData[game as keyof GameList].title}
        type={type ?? ""}
      />
      <main className="flex flex-col items-center justify-center gap-2">
        <div className="w-full px-20">
          <progress
            className="progress w-full"
            value={progress}
            max={100}
          ></progress>
        </div>
        {text && <p className="text-center">{text}</p>}
        <div className="mt-10 flex flex-col gap-2 justify-center items-center">
          {progress >= 100 ? (
            <>
              <NavLink to="/" className="btn">
                Return to Main Menu
              </NavLink>
              <p className="text-success">Conversion Successful!</p>
            </>
          ) : (
            <button className="btn" onClick={ConvertROM} disabled={converting}>
              {converting ? "Converting..." : "Begin Conversion"}
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export default Convert;
