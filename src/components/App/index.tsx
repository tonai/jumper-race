import { useEffect, useRef, useState } from "react";
import { GameStateWithPersisted, PlayerId } from "dusk-games-sdk";

import { GameState, Persisted, Screen } from "../../logic/types.ts";
import Players from "../Players/index.tsx";
import Start from "../Start/index.tsx";
import Countdown from "../Countdown/index.tsx";
import Timer from "../Timer/index.tsx";
import Scores from "../Scores/index.tsx";
import Game from "../Game/index.tsx";
import { loadImage } from "../../helpers/image.ts";
import { allDetails, tiles } from "../../logic/assets.ts";
import Help from "../Help/index.tsx";
import Races from "../Races/index.tsx";

import { initSounds } from "../../helpers/sounds.ts";
import { sounds } from "../../constants/config.ts";

import "./styles.css";

function App() {
  const [game, setGame] =
    useState<GameStateWithPersisted<GameState, Persisted>>();
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();
  const [rapier, setRapier] =
    useState<typeof import("@dimforge/rapier2d-compat/rapier")>();
  const [init, setInit] = useState(false);
  const [screen, setScreen] = useState<Screen>("start");
  const [volume] = useState(1);
  const volumeRef = useRef(1);

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
        loadImage(import.meta.env.BASE_URL + "background02.png"),
        loadImage(import.meta.env.BASE_URL + "end.png"),
        loadImage(import.meta.env.BASE_URL + "jumper.png"),
        loadImage(import.meta.env.BASE_URL + "spikes.png"),
      ]),
    ).then(() => setInit(true));
  }, []);

  useEffect(() => {
    if (init && rapier) {
      Dusk.initClient({
        onChange: ({ game, yourPlayerId, event }) => {
          if (event?.name === 'stateSync' && game.mode === '') {
            setScreen('start');
          }
          setGame(game);
          setYourPlayerId(yourPlayerId);
        },
      });
    }
  }, [init, rapier]);

  useEffect(() => {
    initSounds(sounds);
  }, []);

  if (!game || !yourPlayerId || !rapier || !init) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  return (
    <>
      <Players game={game} volume={volumeRef} yourPlayerId={yourPlayerId} />
      {game.stage === "gettingReady" && screen !== "raceSelect" && (
        <Start
          persisted={game.persisted}
          playerIds={game.playerIds}
          screen={screen}
          setScreen={setScreen}
          yourPlayerId={yourPlayerId}
        />
      )}
      {game.stage === "gettingReady" && <Help />}
      {game.stage === "gettingReady" && screen === "raceSelect" && (
        <Races
          mode={game.mode}
          playerIds={game.playerIds}
          playerBestTimes={game.persisted[yourPlayerId].bestTimes}
          volume={volumeRef}
          votes={game.raceVotes}
          yourPlayerId={yourPlayerId}
        />
      )}
      {game.stage !== "gettingReady" && (
        <Game
          key={game.levelIndex}
          game={game}
          rapier={rapier}
          volume={volumeRef}
          volumeState={volume}
          yourPlayerId={yourPlayerId}
        />
      )}
      {game.stage === "countdown" && (
        <Countdown countdownTimer={game.countdownTimer} volume={volumeRef} />
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
