import { DirEntry } from "@tauri-apps/plugin-fs";
import { Dispatch, SetStateAction } from "react";
import { GameData, GameList } from "./types/types";

async function convertROM(
  type: string,
  game: keyof GameList,
  files: Array<DirEntry>,
  outputDir: string,
  setProgress: Dispatch<SetStateAction<number>>,
  setText: Dispatch<SetStateAction<string>>,
) {
  if (type && game) {
    const combFiles = GameData[game].combinedFiles;
    const splitFiles = GameData[game].splitFiles;

    const progressIncrements = 100 / combFiles.length;

    for (let i = 0; i < combFiles.length; i++) {
      if (type === "combined") {
        setText(`Splitting ${files[i].name} file...`);
        await split(
          files[i],
          splitFiles[i],
          outputDir,
          files[i].name === "10" || files[i].name === "20",
        );
      } else if (type === "split") {
        setText(`Combining ${splitFiles[i].join(", ")}...`);
        const inputFiles = files.filter((file) =>
          splitFiles[i].includes(file.name),
        );
        await combine(
          inputFiles,
          combFiles[i],
          outputDir,
          combFiles[i] === "10" || combFiles[i] === "20",
        );
      }

      setProgress(Math.round((i + 1) * progressIncrements));
    }
  }
}

async function split(
  input: DirEntry,
  outputNames: Array<string>,
  outputDir: string,
  dataROM = false,
) {
  // TO-DO: Read combined file, then split into two/four simms
}

async function combine(
  input: Array<DirEntry>,
  outputName: string,
  outputDir: string,
  dataROM = false,
) {
  // TO-DO: Read split files, then combine into one file
}

export default convertROM;
