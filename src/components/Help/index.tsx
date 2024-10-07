import classNames from "classnames"
import { useState } from "react"

import tap from "../../assets/htp/tap.png"
import hold from "../../assets/htp/hold.png"
import walljump from "../../assets/htp/walljump.png"
import end from "../../assets/htp/end.png"

import "./styles.css"

const slides = [
  { text: "Tap to jump", img: tap },
  { text: "Hold to jump higher and further", img: hold },
  { text: "Tap to wall jump", img: walljump },
  { text: "Reach the end", img: end },
]

export default function Help() {
  const [open, setOpen] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)

  function handleClick() {
    setOpen(!open)
  }

  function handlePrev() {
    setSlideIndex((x) => x - 1)
  }

  function handleNext() {
    setSlideIndex((x) => x + 1)
  }

  return (
    <div className={classNames("help", { "help--open": open })}>
      <div className="help__corner" />
      <button className="help__button" onClick={handleClick} type="button">
        {open ? "✖" : "?"}
      </button>
      <div className="help__overflow">
        <div className="help__content">
          <h2 className="help__title">Goal</h2>
          <p>Reach the end of each level as fast as possible.</p>
          <p>When you reach the end, restart to improve your chrono.</p>
          <h2 className="help__title">How to play ?</h2>
        </div>
        <div className="help__carousel">
          {slideIndex > 0 && (
            <button
              className="help__carousel-prev"
              onClick={handlePrev}
              type="button"
            ></button>
          )}
          {slideIndex < slides.length - 1 && (
            <button
              className="help__carousel-next"
              onClick={handleNext}
              type="button"
            ></button>
          )}
          <div className="help__slides">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={classNames("help__slide", {
                  "help__slide--prev": i < slideIndex,
                  "help__slide--next": i > slideIndex,
                })}
              >
                <div className="help__slide-content">{slide.text}</div>
                <div className="help__slide-image">
                  <img alt="" src={slide.img} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
