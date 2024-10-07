import { colors } from "../../constants/config"
import "./styles.css"

interface ICustomizeProps {
  playerId: string
}

export default function Customize(props: ICustomizeProps) {
  const { playerId } = props
  function handleBlobColor(color: number) {
    return () => Rune.actions.setBlobColor({ color, playerId })
  }

  return (
    <div className="customize">
      {colors.map(([backgroundColor, borderColor], i) => (
        <button
          key={i}
          className="customize__color"
          onClick={handleBlobColor(i)}
          style={{ backgroundColor, borderColor }}
        ></button>
      ))}
    </div>
  )
}
