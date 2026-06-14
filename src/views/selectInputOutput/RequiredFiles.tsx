import { memo, use } from "react";
import { fullCombinedFiles, fullSplitFiles, Game } from "../../types/types";
import { ConfigContext } from "../../contexts/ConfigContext";
import { useParams } from "react-router";

const RequiredFiles = memo(function RequiredFiles({
  type,
  game,
  contentLen = 0,
  missingFiles = [],
}: {
  type: string;
  game: Game;
  contentLen?: number;
  missingFiles?: Array<string>;
}) {
  const gameStr = useParams().game;

  const { includeUnusedFiles } = use(ConfigContext)!.configData;
  const combinedFiles =
    includeUnusedFiles.toLowerCase() === "true"
      ? fullCombinedFiles
      : game.combinedFiles;
  const splitFiles =
    includeUnusedFiles.toLowerCase() === "true"
      ? fullSplitFiles.map((simmSet) =>
          simmSet.map((simm) => `${gameStr}-${simm}`),
        )
      : game.splitFiles;

  return (
    <div className="my-5">
      {type === "combined" ? (
        <div className="flex flex-wrap justify-center gap-2">
          {combinedFiles.map((file) => (
            <div
              className={`card card-border ${contentLen > 0 ? `${missingFiles.includes(file) ? "bg-error text-error-content" : "bg-success text-success-content"}` : "bg-base-100"}`}
              key={file}
            >
              <div className="card-body flex justify-center items-center p-3">
                <p className="text-center text-lg font-bold">{file}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-col justify-center items-center space-y-2">
          {splitFiles.map((splitArr, index) => (
            <div
              className="flex justify-center items-center gap-2"
              key={combinedFiles[index]}
            >
              {splitArr.map((file) => (
                <div
                  className={`card card-border ${contentLen > 0 ? `${missingFiles.includes(file) ? "bg-error text-error-content" : "bg-success text-success-content"}` : "bg-base-100"}`}
                  key={file}
                >
                  <div className="card-body p-4">
                    <p className="text-center text-xs font-bold">{file}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default RequiredFiles;
