import { ReactNode } from "react";
import CrossfadeCarousel from "./CrossfadeCarousel";
import { Game, GameData } from "../types/types";

function DynamicBackground({ children }: { children: ReactNode }) {
  const fadeinDuration = 1500; // 1.5 seconds to fade-in
  const intervalDuration = 6000; // 6 seconds between images

  return (
    <div className="w-screen h-screen relative">
      <CrossfadeCarousel
        interval={intervalDuration}
        transition={fadeinDuration}
        images={Object.values(GameData).map((game: Game) => game.bgImage)}
      />
      {children}
    </div>
  );
}

export default DynamicBackground;
