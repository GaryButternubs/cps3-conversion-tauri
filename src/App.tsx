import { DirEntry } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { ConvertContext } from "./contexts/ConvertContext";
import DynamicBackground from "./components/DynamicBackground";
import { RouterProvider } from "react-router";
import router from "./routes";

function App() {
  const [files, setFiles] = useState<Array<DirEntry>>([]);
  const [outputDir, setOutputDir] = useState<string>("");

  return (
    <ConvertContext value={{ files, setFiles, outputDir, setOutputDir }}>
      <DynamicBackground>
        <div className="flex items-center justify-center w-full h-full">
          <div className="overlfow-y-auto max-h-[90vh] bg-base-100 my-8 mx-16 p-8 rounded-xl box-border">
            <RouterProvider router={router} />
          </div>
        </div>
      </DynamicBackground>
    </ConvertContext>
  );
}

export default App;
