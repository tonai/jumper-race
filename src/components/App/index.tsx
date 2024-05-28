import { useEffect, useRef, useState } from "react";
import { GameStateWithPersisted, PlayerId } from "rune-games-sdk/multiplayer";

import { GameState, Persisted } from "../../logic/types.ts";
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

import classNames from "classnames";
import { initSounds } from "../../helpers/sounds.ts";
import { sounds } from "../../logic/config.ts";

import "./styles.css";

function App() {
  const [game, setGame] = useState<GameStateWithPersisted<GameState, Persisted>>();
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();
  const [rapier, setRapier] =
    useState<typeof import("@dimforge/rapier2d-compat/rapier")>();
  const [init, setInit] = useState(false);
  const [volume, setVolume] = useState(1);
  const volumeRef = useRef(1);
  const [isGhostsEnabled, setIsGhostsEnabled] = useState(true);

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
      Rune.initClient({
        onChange: ({ game, yourPlayerId }) => {
          setGame(game);
          setYourPlayerId(yourPlayerId);
        },
      });
    }
  }, [init, rapier]);

  useEffect(() => {
    initSounds(sounds);
  }, [])

  if (!game || !yourPlayerId || !rapier || !init) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  function handleSound() {
    if (volume === 1) {
      volumeRef.current = 0.66;
      setVolume(0.66);
    } else if (volume === 0.66) {
      volumeRef.current = 0.33;
      setVolume(0.33);
    } else if (volume === 0.33) {
      volumeRef.current = 0;
      setVolume(0);
    } else {
      volumeRef.current = 1;
      setVolume(1);
    }
  }
  
  return (
    <>
      <Players game={game} yourPlayerId={yourPlayerId} />
      {game.stage === "gettingReady" && <Start />}
      {game.stage === "gettingReady" && <Help />}
      {game.stage === "raceSelect" && (
        <Races
          mode={game.mode}
          playerIds={game.playerIds}
          playerBestTimes={game.persisted[yourPlayerId].bestTimes}
          volume={volumeRef}
          votes={game.raceVotes}
          yourPlayerId={yourPlayerId}
        />
      )}
      {game.stage !== "gettingReady" && game.stage !== "raceSelect" && (
        <Game
          key={game.levelIndex}
          game={game}
          isGhostsEnabled={isGhostsEnabled}
          rapier={rapier}
          setIsGhostsEnabled={setIsGhostsEnabled}
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
      <button className="app__sound" onClick={handleSound} type="button">
        <div className="app__sound-icon" />
        <div
          className={classNames("app__sound-waves", {
            "app__sound-waves--23": volume === 0.66,
            "app__sound-waves--13": volume === 0.33,
            "app__sound-waves--mute": volume === 0,
          })}
        >{volume === 0 && '✖'}</div>
      </button>
    </>
  );
}

export default App;
