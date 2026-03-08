import { open } from "@tauri-apps/plugin-dialog";
import { DirEntry, readDir } from "@tauri-apps/plugin-fs";
import { Dispatch, SetStateAction, useState } from "react";

function DirectorySelect({
  setContents,
  setInOutDir,
}: {
  setContents?: Dispatch<SetStateAction<Array<DirEntry>>>;
  setInOutDir?: Dispatch<SetStateAction<string>>;
}) {
  const [directoryPath, setDirectoryPath] =
    useState<string>("No folder selected");

  const ReadDirectory = async () => {
    const dir = await open({
      multiple: false,
      directory: true,
    });
    setDirectoryPath(dir ?? "No folder selected");

    // Read folder contents and pass them back to parent component
    if (dir) {
      if (setContents) {
        const entires = await readDir(dir);
        setContents(entires.filter((entry) => entry.isFile));
      }

      if (setInOutDir) setInOutDir(dir);
    }
  };

  return (
    <button className="file-input" onClick={ReadDirectory}>
      <div
        className="bg-base-200 border-r-2 rounded-l-4xl w-fit whitespace-nowrap h-full font-semibold flex flex-nowrap justify-center items-center px-4"
        style={{
          borderRightColor:
            "color-mix(in oklab, var(--color-base-200), #000 calc(1 * 5%))",
        }}
      >
        Choose Folder
      </div>
      <div className="h-full flex flex-nowrap justify-center items-center px-4 overflow-hidden whitespace-nowrap">
        {`...${directoryPath.substring(directoryPath.length - 20)}`}
      </div>
    </button>
  );
}

export default DirectorySelect;
