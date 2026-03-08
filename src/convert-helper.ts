import { DirEntry, readFile, writeFile } from "@tauri-apps/plugin-fs";
import { Dispatch, SetStateAction } from "react";
import { GameData, GameList } from "./types/types";

async function convertROM(
  type: string,
  game: keyof GameList,
  files: Array<DirEntry>,
  inputDir: string,
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
          inputDir,
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
          inputDir,
          combFiles[i],
          outputDir,
          combFiles[i] === "10" || combFiles[i] === "20",
        );
      }

      setProgress(Math.round((i + 1) * progressIncrements));
    }
  }
}

// Convert combined file into two/four simms
async function split(
  input: DirEntry,
  inputDir: string,
  outputNames: Array<string>,
  outputDir: string,
  dataROM = false,
) {
  const data = await readFile(`${inputDir}/${input.name}`);
  const outputViews: Array<Uint8Array> = [];

  const outputCount = outputNames.length;
  const outputSize = data.length / outputCount;

  for (let i = 0; i < outputCount; i++)
    outputViews[i] = new Uint8Array(new ArrayBuffer(outputSize));

  if (dataROM || outputCount <= 2) {
    for (let i = 0; i < data.length; i++) {
      const outputIndex = i % outputCount;
      const offset = (i / outputCount) | 0; // Bitwise OR for floor division
      outputViews[outputIndex][offset] = data[i];
    }
  } else {
    const halfLen = outputCount / 2;
    const halfBuffer = data.length / 2;

    // First half of file is first two simms
    for (let i = 0; i < halfBuffer; i++) {
      const outputIndex = i % halfLen;
      const offset = (i / halfLen) | 0;
      outputViews[outputIndex][offset] = data[i];
    }

    // Second half of file is second two simms
    for (let i = 0; i < halfBuffer; i++) {
      const outputIndex = (i % halfLen) + halfLen;
      const offset = (i / halfLen) | 0;
      outputViews[outputIndex][offset] = data[halfBuffer + i];
    }
  }

  // Write simm files to output directory
  for (let i = 0; i < outputCount; i++) {
    await writeFile(`${outputDir}/${outputNames[i]}`, outputViews[i]);
  }
}

// Convert two/four simms into one combined file
async function combine(
  input: Array<DirEntry>,
  inputDir: string,
  outputName: string,
  outputDir: string,
  dataROM = false,
) {
  const inputViews: Array<Uint8Array> = [];
  const inputCount = input.length;

  for (let i = 0; i < inputCount; i++) {
    const arr = await readFile(`${inputDir}/${input[i].name}`);
    inputViews.push(arr);
  }

  const inputSize = inputViews[0].length;
  const outputView = new Uint8Array(new ArrayBuffer(inputSize * inputCount));

  if (dataROM || inputCount <= 2) {
    for (let i = 0; i < outputView.length; i++) {
      const inputIndex = i % inputCount;
      const offset = (i / inputCount) | 0;
      outputView[i] = inputViews[inputIndex][offset];
    }
  } else {
    const halfLen = inputCount / 2;
    const halfOutput = outputView.length / 2;

    // First half of file is the first two simms
    for (let i = 0; i < halfOutput; i++) {
      const inputIndex = i % halfLen;
      const offset = (i / halfLen) | 0;
      outputView[i] = inputViews[inputIndex][offset];
    }

    // Second half of file is the second two simms
    for (let i = 0; i < halfOutput; i++) {
      const inputIndex = (i % halfLen) + halfLen;
      const offset = (i / halfLen) | 0;
      outputView[halfOutput + i] = inputViews[inputIndex][offset];
    }
  }

  await writeFile(`${outputDir}/${outputName}`, outputView);
}

export default convertROM;
