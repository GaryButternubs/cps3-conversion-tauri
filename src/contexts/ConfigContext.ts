import { createContext } from "react";
import { ConfigContextType } from "../types/types";

export const ConfigContext = createContext<ConfigContextType | null>(null);
