import DynamicBackground from "./components/DynamicBackground";
import ConfigWrapper from "./ConfigWrapper";
import LoadingSpinner from "./components/LoadingSpinner";
import { LoadConfig } from "./config-helper";
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  // Get contents of config.json
  const { data: initialConfig, isLoading } = useQuery({
    queryKey: ["initialConfig"],
    queryFn: () => LoadConfig(),
  });

  return (
    <DynamicBackground>
      <div className="flex items-center justify-center w-full h-full">
        <div className="relative overflow-y-auto overflow-x-hidden max-h-[90vh] bg-base-100 my-8 mx-16 p-8 rounded-xl box-border">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ConfigWrapper initialConfig={initialConfig!} />
          )}
        </div>
      </div>
    </DynamicBackground>
  );
}

export default App;
