import { Dispatch, SetStateAction, use } from "react";
import { ConfigContext } from "../contexts/ConfigContext";
import {
  ConfigSettings,
  ConfigWriteStatus,
  Game,
  GameData,
} from "../types/types";
import { WriteData } from "../config-helper";

function SettingsOptions({
  setStatus,
}: {
  setStatus: Dispatch<SetStateAction<ConfigWriteStatus>>;
}) {
  const { configData, setConfig } = use(ConfigContext)!;

  const handleChange = async (keyStr: string, value: string) => {
    setStatus(ConfigWriteStatus.Pending);

    const key = keyStr as keyof ConfigSettings;
    const newConfig = await WriteData(key, value.toString());

    setConfig(newConfig);
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
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            const keyStr = e.target.name;
            const value = e.target.checked;

            await handleChange(keyStr, value.toString());

            if (
              !value &&
              configData["includeUnusedFiles"].toLowerCase() === "true"
            )
              await handleChange("includeUnusedFiles", "false");
          }}
        />
      </fieldset>
      {configData["ignoreRequiredFiles"].toLowerCase() === "true" && (
        <fieldset className="fieldset flex gap-2 items-center justify-between">
          <div
            className="tooltip tooltip-right"
            data-tip="Include unused ROM files still supported by CPS3 during conversion (ie. 70, 71)."
          >
            <span className="label underline decoration-dotted">
              Include unused files:{" "}
            </span>
          </div>
          <input
            type="checkbox"
            className="checkbox"
            name="includeUnusedFiles"
            checked={configData["includeUnusedFiles"].toLowerCase() === "true"}
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              const keyStr = e.target.name;
              const value = e.target.checked;

              await handleChange(keyStr, value.toString());
            }}
          />
        </fieldset>
      )}
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
          className="select"
          name="defaultGame"
          onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
            const keyStr = e.target.name;
            const value = e.target.value;

            await handleChange(keyStr, value.toString());
          }}
          defaultValue={configData.defaultGame}
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
