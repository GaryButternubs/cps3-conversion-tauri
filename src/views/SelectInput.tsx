import { DirEntry } from "@tauri-apps/plugin-fs";
import { MouseEvent, use, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { ConvertContext } from "../contexts/ConvertContext";
import {
  fullCombinedFiles,
  fullSplitFiles,
  GameData,
  GameList,
} from "../types/types";
import Heading from "../components/Heading";
import RequiredFiles from "./selectInputOutput/RequiredFiles";
import DirectorySelect from "../components/DirectorySelect";
import { ConfigContext } from "../contexts/ConfigContext";

function SelectInput() {
  const { type, game } = useParams();
  const [contents, setContents] = useState<Array<DirEntry>>([]);
  const [tempInDir, setTempInDir] = useState<string>("");

  const { ignoreRequiredFiles, includeUnusedFiles } =
    use(ConfigContext)!.configData;
  const { setFiles, setInputDir } = use(ConvertContext)!;

  const navigate = useNavigate();

  const combFiles =
    includeUnusedFiles.toLowerCase() === "true"
      ? fullCombinedFiles
      : GameData[game as keyof GameList].combinedFiles;
  const splitFiles =
    includeUnusedFiles.toLowerCase() === "true"
      ? fullSplitFiles.map((simmSet) =>
          simmSet.map((simm) => `${game}-${simm}`),
        )
      : GameData[game as keyof GameList].splitFiles;

  const missingFiles: string[] = useMemo(() => {
    if (contents.length === 0) return [];

    // Ensure all required files are found, otherwise prevent moving on
    const missing: Array<string> = [];
    const filenames: Array<string> = contents.map((file) => file.name);

    if (type === "combined") {
      for (let i = 0; i < combFiles.length; i++)
        if (!filenames.includes(combFiles[i])) missing.push(combFiles[i]);
    } else if (type === "split") {
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
            disabled={
              contents.length === 0 ||
              (missingFiles.length !== 0 &&
                !(ignoreRequiredFiles.toLowerCase() === "true"))
            }
            onClick={SelectOutputDir}
          >
            Continue
          </button>
          <NavLink to="/" className="btn btn-secondary">
            Cancel
          </NavLink>
        </div>
        {contents.length > 0 && missingFiles.length !== 0 && (
          <div className="flex flex-col justify-center items-center mt-2 text-center">
            <p className="text-error">
              {ignoreRequiredFiles.toLowerCase() === "true"
                ? `One or more files are missing. Proceed anyway?`
                : "All required files must be found before continuing."}
            </p>
            {(type ?? "combined") === "split" && (
              <p className="text-error">
                If any simms are missing from a set, they will not be combined.
              </p>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default SelectInput;
