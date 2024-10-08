import tile01 from "../assets/ground/01.png"
import tile02 from "../assets/ground/02.png"
import tile03 from "../assets/ground/03.png"
import tile04 from "../assets/ground/04.png"
import tile05 from "../assets/ground/05.png"
import tile06 from "../assets/ground/06.png"
import tile07 from "../assets/ground/07.png"
import tile08 from "../assets/ground/08.png"
import tile09 from "../assets/ground/09.png"
import tile10 from "../assets/ground/10.png"
import tile11 from "../assets/ground/11.png"
import tile12 from "../assets/ground/12.png"

import detail01 from "../assets/01.png"
import detail02 from "../assets/02.png"
import detail03 from "../assets/03.png"
import detail04 from "../assets/04.png"
import detail05 from "../assets/05.png"
import detail06 from "../assets/06.png"
import detail07 from "../assets/07.png"
import detail08 from "../assets/08.png"
import detail09 from "../assets/09.png"
import detail10 from "../assets/10.png"
import detail11 from "../assets/11.png"
import detail12 from "../assets/12.png"
import detail13 from "../assets/13.png"
import PanelDead from "../assets/PanelDead.png"
import PanelExclamation from "../assets/PanelExclamation.png"
import PanelLeft from "../assets/PanelLeft.png"
import PanelLeftDown from "../assets/PanelLeftDown.png"
import PanelLeftUp from "../assets/PanelLeftUp.png"
import PanelQuestion from "../assets/PanelQuestion.png"
import PanelRight from "../assets/PanelRight.png"
import PanelRightDown from "../assets/PanelRightDown.png"
import PanelRightUp from "../assets/PanelRightUp.png"

import { IDetail } from "./types"

export const groundTop = tile01
export const ground = tile02
export const groundTopBottom = tile03
export const groundBottom = tile04
export const groundLeftTop = tile05
export const groundLeft = tile06
export const groundLeftTopBottom = tile07
export const groundLeftBottom = tile08
export const groundRightTop = tile09
export const groundRight = tile10
export const groundRightTopBottom = tile11
export const groundRightBottom = tile12

export const tiles = [
  tile01,
  tile02,
  tile03,
  tile04,
  tile05,
  tile06,
  tile07,
  tile08,
  tile09,
  tile10,
  tile11,
  tile12,
]

export const allDetails: IDetail[] = [
  { src: detail01, width: 2, height: 2, offset: 2 },
  { src: detail02, width: 2, height: 1, offset: 2 },
  { src: detail03, width: 2, height: 1, offset: 2 },
  { src: detail04, width: 1, height: 1, offset: 4 },
  { src: detail05, width: 1, height: 1, offset: 4 },
  { src: detail06, width: 2, height: 2, offset: 4 },
  { src: detail07, width: 2, height: 2, offset: 4 },
  { src: detail08, width: 2, height: 2, offset: 30 },
  { src: detail09, width: 2, height: 1, offset: 6 },
  { src: detail10, width: 1, height: 1, offset: 12 },
  { src: detail11, width: 1, height: 1, offset: 12 },
  { src: detail12, width: 5, height: 6, offset: 22 },
  { src: detail13, width: 5, height: 7, offset: 22 },
  { src: PanelDead, width: 2, height: 2, offset: 2 }, // 13
  { src: PanelExclamation, width: 2, height: 2, offset: 2 }, // 14
  { src: PanelLeft, width: 2, height: 2, offset: 2 }, // 15
  { src: PanelLeftDown, width: 2, height: 2, offset: 2 }, // 16
  { src: PanelLeftUp, width: 2, height: 2, offset: 2 }, // 17
  { src: PanelQuestion, width: 2, height: 2, offset: 2 }, // 18
  { src: PanelRight, width: 2, height: 2, offset: 2 }, // 19
  { src: PanelRightDown, width: 2, height: 2, offset: 2 }, // 20
  { src: PanelRightUp, width: 2, height: 2, offset: 2 }, // 21
]

export const randomDetails = allDetails.slice(0, 13)
