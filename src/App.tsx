import { Suspense, useEffect } from "react";
import DynamicBackground from "./components/DynamicBackground";
import ConfigWrapper from "./ConfigWrapper";

import "./App.css";
import LoadingSpinner from "./components/LoadingSpinner";
import { LoadConfig } from "./config-helper";
import { ConfigSettings } from "./types/types";

function App() {
  let initialConfig: ConfigSettings | undefined;
  let loading = true;

  // Dude I wish React let you use Suspense with client components
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      loading = true;
      if (isMounted) initialConfig = await LoadConfig();
      loading = false;
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DynamicBackground>
      <div className="flex items-center justify-center w-full h-full">
        <div className="relative overflow-y-auto overflow-x-hidden max-h-[90vh] bg-base-100 my-8 mx-16 p-8 rounded-xl box-border">
          {loading && (initialConfig ?? undefined) ? (
            <LoadingSpinner size={8} />
          ) : (
            <ConfigWrapper initialConfig={initialConfig!} />
          )}
        </div>
      </div>
    </DynamicBackground>
  );
}

export default App;
