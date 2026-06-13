import { useState } from "react";
import { ConfigContext } from "./contexts/ConfigContext";
import SettingsModal from "./components/SettingsModal";
import { ConvertContext } from "./contexts/ConvertContext";
import { DirEntry } from "@tauri-apps/plugin-fs";
import { RouterProvider } from "react-router";
import router from "./routes";
import { ConfigSettings } from "./types/types";

function ConfigWrapper({ initialConfig }: { initialConfig: ConfigSettings }) {
  const [configData, setConfig] = useState<ConfigSettings>(initialConfig);

  const [files, setFiles] = useState<Array<DirEntry>>([]);
  const [inputDir, setInputDir] = useState<string>("");
  const [outputDir, setOutputDir] = useState<string>("");

  return (
    <ConfigContext value={{ configData, setConfig }}>
      <SettingsModal strokeWidth={1.5} />
      <ConvertContext
        value={{
          files,
          setFiles,
          inputDir,
          setInputDir,
          outputDir,
          setOutputDir,
        }}
      >
        <RouterProvider router={router} />
      </ConvertContext>
    </ConfigContext>
  );
}

export default ConfigWrapper;
