import { Dispatch, SetStateAction, use } from "react";
import { ConfigContext } from "../contexts/ConfigContext";
import {
  ConfigSettings,
  ConfigWriteStatus,
  Game,
  GameData,
  GameList,
} from "../types/types";
import { WriteData } from "../config-helper";

function SettingsOptions({
  setStatus,
}: {
  setStatus: Dispatch<SetStateAction<ConfigWriteStatus>>;
}) {
  const { configData, setConfig } = use(ConfigContext)!;
  const selectedGame =
    GameData[configData.defaultGame as keyof GameList] ?? null;

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setStatus(ConfigWriteStatus.Pending);

    const key = e.target.name as keyof ConfigSettings;
    const value = (
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    ).toString();

    await WriteData(key, value.toString());

    const temp = { ...configData };
    temp[key] = value;

    setConfig(temp);
    setStatus(ConfigWriteStatus.Saved);
  };

  return (
    <div className="pt-4">
      <fieldset className="fieldset flex gap-2 items-center justify-between">
        <div
          className="tooltip tooltip-right"
          data-tip="Allow ROM conversion even if some files are missing."
        >
          <span className="label underline decoration-dotted">
            Ignore required files:{" "}
          </span>
        </div>
        <input
          type="checkbox"
          className="checkbox"
          name="ignoreRequiredFiles"
          checked={configData["ignoreRequiredFiles"].toLowerCase() === "true"}
          onChange={handleChange}
        />
      </fieldset>
      <fieldset className="fieldset flex gap-2 items-center justify-between">
        <div
          className="tooltip tooltip-right"
          data-tip="Automatically jump to directory selection after choosing split or combine conversion."
        >
          <span className="label underline decoration-dotted">
            Default game:{" "}
          </span>
        </div>
        <select
          defaultValue={
            selectedGame
              ? (selectedGame.abbrTitle ?? selectedGame.title)
              : "Default (None)"
          }
          className="select"
          name="defaultGame"
          onChange={handleChange}
        >
          <option value={""}>Default (None)</option>
          {Object.values(GameData).map((game: Game, index) => (
            <option value={Object.keys(GameData)[index]} key={game.bgImage}>
              {game.abbrTitle ?? game.title}
            </option>
          ))}
        </select>
      </fieldset>
    </div>
  );
}

export default SettingsOptions;
