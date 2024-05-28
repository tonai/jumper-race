import { randomInt } from "./utils";

export const sounds = {
  countdown: new Audio("audio/countdown.ogg"),
  end: new Audio("audio/end.ogg"),
  go: new Audio("audio/go.ogg"),
  jump: [
    new Audio("audio/jump1.ogg"),
    new Audio("audio/jump2.ogg"),
    new Audio("audio/jump3.ogg"),
  ],
  jumper: new Audio("audio/jumper.ogg"),
  music: new Audio("audio/music.ogg"),
  select: new Audio("audio/select.ogg"),
  spikes: new Audio("audio/spikes.ogg"),
  walljump: new Audio("audio/walljump.ogg"),
};

export function playSound(name: keyof typeof sounds) {
  const sound = sounds[name];
  try {
    if (sound instanceof Array) {
      const index = randomInt(sound.length - 1);
      (sound[index].cloneNode(true) as HTMLAudioElement).play();
    } else {
      (sound.cloneNode(true) as HTMLAudioElement).play();
    }
  } catch (_e) {
    // Sounds may be blocked by browser
  }
}
