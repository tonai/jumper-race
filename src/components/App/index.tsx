import { useEffect, useState } from "react";
import { PlayerId } from "rune-games-sdk/multiplayer";

import { GameState } from "../../logic/types.ts";
import Players from "../Players/index.tsx";
import Start from "../Start/index.tsx";
import Countdown from "../Countdown/index.tsx";
import Timer from "../Timer/index.tsx";
import Scores from "../Scores/index.tsx";
import Game from "../Game/index.tsx";
import { loadImage } from "../../helpers/image.ts";
import { allDetails, tiles } from "../../logic/assets.ts";
import Help from "../Help/index.tsx";
import Race from "../Races/index.tsx";

function App() {
  const [game, setGame] = useState<GameState>();
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();
  const [rapier, setRapier] =
    useState<typeof import("@dimforge/rapier2d-compat/rapier")>();
  const [init, setInit] = useState(false);

  useEffect(() => {
    import("@dimforge/rapier2d-compat").then((module) => {
      module.init();
      setRapier(module);
    });
  }, []);

  useEffect(() => {
    const images = tiles.concat(allDetails.map((detail) => detail.src));
    const promises = images.map(loadImage);
    Promise.allSettled(
      promises.concat([
        loadImage("/background02.png"),
        loadImage("/end.png"),
        loadImage("/jumper.png"),
        loadImage("/spikes.png"),
      ]),
    ).then(() => setInit(true));
  }, []);

  useEffect(() => {
    if (init && rapier) {
      Rune.initClient({
        onChange: ({ game, yourPlayerId }) => {
          setGame(game);
          setYourPlayerId(yourPlayerId);
        },
      });
    }
  }, [init, rapier]);

  if (!game || !yourPlayerId || !rapier || !init) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  return (
    <>
      <Players game={game} yourPlayerId={yourPlayerId} />
      {game.stage === "gettingReady" && <Start />}
      {game.stage === "gettingReady" && <Help />}
      {game.stage === "raceSelect" && (
        <Race
          mode={game.mode}
          playerIds={game.playerIds}
          votes={game.raceVotes}
          yourPlayerId={yourPlayerId}
        />
      )}
      {game.stage !== "gettingReady" && game.stage !== "raceSelect" && (
        <Game
          key={game.levelIndex}
          game={game}
          rapier={rapier}
          yourPlayerId={yourPlayerId}
        />
      )}
      {game.stage === "countdown" && (
        <Countdown countdownTimer={game.countdownTimer} />
      )}
      {game.stage === "playing" && (
        <Timer levelIndex={game.levelIndex} timer={game.timer} />
      )}
      {game.stage === "endOfRound" && (
        <Scores game={game} yourPlayerId={yourPlayerId} />
      )}
    </>
  );
}

export default App;
