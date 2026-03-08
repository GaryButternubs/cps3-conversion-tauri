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
  const [tempInDir, setTempInDir] = useState<string>("");
  const setFiles = useContext(ConvertContext)?.setFiles;
  const setInputDir = useContext(ConvertContext)?.setInputDir;

  const navigate = useNavigate();

  const missingFiles: string[] = useMemo(() => {
    if (contents.length === 0) return [];

    // Ensure all required files are found, otherwise prevent moving on
    const missing: Array<string> = [];
    const filenames: Array<string> = contents.map((file) => file.name);

    if (type === "combined") {
      const combFiles = GameData[game as keyof GameList].combinedFiles;

      for (let i = 0; i < combFiles.length; i++)
        if (!filenames.includes(combFiles[i])) missing.push(combFiles[i]);
    } else if (type === "split") {
      const splitFiles = GameData[game as keyof GameList].splitFiles;

      for (let i = 0; i < splitFiles.length; i++) {
        for (let j = 0; j < splitFiles[i].length; j++) {
          if (!filenames.includes(splitFiles[i][j]))
            missing.push(splitFiles[i][j]);
        }
      }
    }

    return missing;
  }, [contents, game, type]);

  const SelectOutputDir = (e: MouseEvent) => {
    e.preventDefault();

    if (setFiles && setInputDir) {
      const combFiles = GameData[game as keyof GameList].combinedFiles;
      const splitFiles = GameData[game as keyof GameList].splitFiles;

      setFiles(
        contents.filter((file) => {
          if (type === "combined") {
            return combFiles.includes(file.name);
          } else if (type === "split") {
            let hasFile = false;

            for (let i = 0; i < splitFiles.length; i++)
              if (splitFiles[i].includes(file.name)) hasFile = true;

            return hasFile;
          }
        }),
      );

      setInputDir(tempInDir);
      navigate(`/selectOutput/${type}/${game}`);
    }
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
          <DirectorySelect
            setContents={setContents}
            setInOutDir={setTempInDir}
          />
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
