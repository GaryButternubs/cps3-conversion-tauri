import { DirEntry } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { ConfigContext } from "./contexts/ConfigContext";
import { ConvertContext } from "./contexts/ConvertContext";
import DynamicBackground from "./components/DynamicBackground";
import { RouterProvider } from "react-router";
import router from "./routes";

import "./App.css";
import SettingsModal from "./components/SettingsModal";

function App() {
  const [files, setFiles] = useState<Array<DirEntry>>([]);
  const [inputDir, setInputDir] = useState<string>("");
  const [outputDir, setOutputDir] = useState<string>("");

  return (
    <DynamicBackground>
      <div className="flex items-center justify-center w-full h-full">
        <div className="relative overflow-y-auto overflow-x-hidden max-h-[90vh] bg-base-100 my-8 mx-16 p-8 rounded-xl box-border">
          {/* TO-DO: Make ConfigContext read from a configuration file on startup */}
          <ConfigContext value={null}>
            <SettingsModal strokeWidth={1.5} size={8} />
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
        </div>
      </div>
    </DynamicBackground>
  );
}

export default App;
