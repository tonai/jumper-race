import classNames from "classnames";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

interface IVolumeProps {
  setVolume: Dispatch<SetStateAction<number>>;
  volume: number;
  volumeRef: MutableRefObject<number>;
}

export default function Volume(props: IVolumeProps) {
  const { setVolume, volume, volumeRef } = props;

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
    <button className="app__sound" onClick={handleSound} type="button">
      <div className="app__sound-icon" />
      <div
        className={classNames("app__sound-waves", {
          "app__sound-waves--23": volume === 0.66,
          "app__sound-waves--13": volume === 0.33,
          "app__sound-waves--mute": volume === 0,
        })}
      >
        {volume === 0 && "✖"}
      </div>
    </button>
  );
}
