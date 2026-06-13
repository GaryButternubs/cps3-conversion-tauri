import { useState } from "react";
import { ConfigContextType, ConfigSettings } from "./types/types";
import {
  create,
  exists,
  readTextFile,
  remove,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { path } from "@tauri-apps/api";

const defaults: ConfigSettings = {
  defaultGame: "",
  ignoreRequiredFiles: "false",
};
const configData: ConfigSettings = { ...defaults };

let configLocation: string;

export async function LoadConfig(): Promise<ConfigSettings> {
  configLocation = await path.join(await path.resourceDir(), "config.json");

  const configExists = await exists(configLocation);
  let temp = { ...defaults };

  // Create if it doesn't exist, read if it does
  if (!configExists) {
    const config = await create(configLocation);
    const fileText = ConfigToText(defaults);

    await config.write(new TextEncoder().encode(fileText));
    await config.close();
  } else {
    const configFile = await readTextFile(configLocation);
    configFile.split("\n").forEach((line) => {
      const equalsAt = line.indexOf("=");
      const keyStr = line.substring(0, equalsAt);
      const key = keyStr as keyof ConfigSettings;

      configData[key] = line.substring(equalsAt + 1);
      temp = { ...configData };
    });
  }

  return temp;
}

export async function WriteData(keyStr: string, value: string) {
  const key = keyStr as keyof ConfigSettings;
  console.log(`key: ${key}, value: ${value}`);
  configData[key] = value;
  console.log(configData);

  configLocation = await path.join(await path.resourceDir(), "config.json");
  const configStr = ConfigToText(configData);
  console.log(configStr);
  await writeTextFile(configLocation, configStr);
}

export async function DeleteConfig(): Promise<boolean> {
  configLocation = await path.join(await path.resourceDir(), "config.json");
  const configExists = await exists(configLocation);

  if (!configExists) return false;

  await remove(configLocation);
  return true;
}

function ConfigToText(data: ConfigSettings) {
  return Object.keys(data)
    .map((key) => {
      const keyTyped = key as keyof ConfigSettings;
      return `${key}=${configData[keyTyped]}`;
    })
    .join("\n");
}
