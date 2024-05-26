import { useEffect, useState } from "react";
import { PlayerId } from "rune-games-sdk/multiplayer";

import { GameState } from "../../logic/types.ts";
import Players from "../Players/index.tsx";
import Start from "../Start/index.tsx";
import Countdown from "../Countdown/index.tsx";
import Timer from "../Timer/index.tsx";
import Scores from "../Scores/index.tsx";
import Game from "../Game/index.tsx";

function App() {
  const [game, setGame] = useState<GameState>();
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();
  const [rapier, setRapier] =
    useState<typeof import("@dimforge/rapier2d-compat/rapier")>();

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId }) => {
        setGame(game);
        setYourPlayerId(yourPlayerId);
      },
    });
  }, []);

  useEffect(() => {
    import("@dimforge/rapier2d-compat").then((module) => {
      module.init();
      setRapier(module);
    });
  }, []);

  if (!game || !yourPlayerId || !rapier) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  return (
    <>
      <Players game={game} yourPlayerId={yourPlayerId} />
      {game.stage === "gettingReady" && <Start />}
      {game.stage !== "gettingReady" && (
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
