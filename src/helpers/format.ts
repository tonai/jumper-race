export function formatTime(time: number) {
  const timeSecond = Math.round(time / 10) / 100
  const timeArray = String(timeSecond).split(".")
  if (timeArray.length > 1) {
    return timeArray[0].padStart(2, "0") + "." + timeArray[1].padEnd(2, "0")
  }
  return timeArray[0].padStart(2, "0") + ".00"
}
