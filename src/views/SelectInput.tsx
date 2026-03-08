import { DirEntry } from "@tauri-apps/plugin-fs";
import { MouseEvent, useContext, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { ConvertContext } from "../contexts/ConvertContext";
import { GameData, GameList } from "../types/types";
import Heading from "../components/Heading";
import RequiredFiles from "./selectInputOutput/RequiredFiles";
import DirectorySelect from "../components/DirectorySelect";

function SelectInput() {
  const { type, game } = useParams();
  const [contents, setContents] = useState<Array<DirEntry>>([]);
  const setFiles = useContext(ConvertContext)?.setFiles;

  const navigate = useNavigate();

  const missingFiles: string[] = useMemo(() => {
    // TO-DO: Keep track of any missing files
    return [];
  }, [contents, game, type]);

  const SelectOutputDir = (e: MouseEvent) => {
    e.preventDefault();

    // TO-DO: Filter contents so that only required files are passed along
    contents.forEach((file) => console.log(file.name));

    // TO-DO: Navigate to SelectOutput component
  };

  return (
    <>
      <Heading
        title={GameData[game as keyof GameList].title}
        type={type ?? ""}
      />
      <main>
        <h2 className="text-center font-bold">
          Please select the directory containing the following files:
        </h2>
        <RequiredFiles
          type={type ?? "combined"}
          game={GameData[game as keyof GameList]}
          contentLen={contents.length}
          missingFiles={missingFiles}
        />
        <p className="text-center">
          Make sure they've been extracted from the .zip file, and that there's
          no duplicates.
        </p>
        <div className="mt-5 flex justify-center">
          <DirectorySelect setContents={setContents} />
        </div>
        <div className="mt-5 flex justify-center items-center gap-2">
          <button
            className="btn"
            disabled={contents.length === 0 || missingFiles.length !== 0}
            onClick={SelectOutputDir}
          >
            Continue
          </button>
          <NavLink to="/" className="btn btn-secondary">
            Cancel
          </NavLink>
        </div>
        {contents.length > 0 && missingFiles.length !== 0 && (
          <div className="flex justify-center items-center mt-2">
            <p className="text-error">
              All required files must be found before continuing.
            </p>
          </div>
        )}
      </main>
    </>
  );
}

export default SelectInput;
