import {
  allDetails,
  ground,
  groundBottom,
  groundLeft,
  groundLeftBottom,
  groundLeftTop,
  groundLeftTopBottom,
  groundRight,
  groundRightBottom,
  groundRightTop,
  groundRightTopBottom,
  groundTop,
  groundTopBottom,
  randomDetails,
} from "../logic/assets";
import { assetSize, randomChance } from "../logic/config";
import { IDetail, ILevel, IRectangle } from "../logic/types";
import { randomInt } from "./utils";

export function getDetailBackground(detail: IDetail, x: number, y: number) {
  return `url(${detail.src}) ${(x - detail.width + 3) * assetSize}px ${
    (y - detail.height + 2) * assetSize + (detail.offset ?? 0)
  }px / ${assetSize * detail.width}px ${assetSize * detail.height}px no-repeat`;
}

export function getBackground(level: ILevel) {
  const { blocks, width } = level;
  const table: (null | IRectangle)[][] = [];
  for (let i = 0; i < width / assetSize; i++) {
    table[i] = new Array(level.height / assetSize).fill(null);
  }

  blocks.forEach((block) => {
    const { height, type, x, y, width } = block;
    if (type === undefined) {
      for (let i = x / assetSize; i < (x + width) / assetSize; i++) {
        for (let j = y / assetSize; j < (y + height) / assetSize; j++) {
          table[i][j] = block;
        }
      }
    }
  });

  const backgrounds: string[] = [];
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[0].length; j++) {
      const block = table[i][j];
      if (block) {
        // Left side
        if (!table[i - 1] || !table[i - 1][j]) {
          if (table[i][j + 1] && table[i][j - 1]) {
            backgrounds.push(
              `url(${groundLeft}) ${(i + 1) * assetSize}px ${
                (j + 2) * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`
            );
          } else if (table[i][j + 1]) {
            backgrounds.push(
              `url(${groundLeftTop}) ${(i + 1) * assetSize}px ${
                (j + 2) * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`
            );
          } else if (table[i][j - 1]) {
            backgrounds.push(
              `url(${groundLeftBottom}) ${(i + 1) * assetSize}px ${
                (j + 2) * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`
            );
          } else {
            backgrounds.push(
              `url(${groundLeftTopBottom}) ${(i + 1) * assetSize}px ${
                (j + 2) * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`
            );
          }
        }
        // Right side
        if (!table[i + 1] || !table[i + 1][j]) {
          if (table[i][j + 1] && table[i][j - 1]) {
            backgrounds.push(
              `url(${groundRight}) ${(i + 3) * assetSize}px ${
                (j + 2) * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`
            );
          } else if (table[i][j + 1]) {
            backgrounds.push(
              `url(${groundRightTop}) ${(i + 3) * assetSize}px ${
                (j + 2) * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`
            );
          } else if (table[i][j - 1]) {
            backgrounds.push(
              `url(${groundRightBottom}) ${(i + 3) * assetSize}px ${
                (j + 2) * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`
            );
          } else {
            backgrounds.push(
              `url(${groundRightTopBottom}) ${(i + 3) * assetSize}px ${
                (j + 2) * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`
            );
          }
        }
        // Ground
        if (table[i][j + 1] && table[i][j - 1]) {
          backgrounds.push(
            `url(${ground}) ${(i + 2) * assetSize}px ${
              (j + 2) * assetSize
            }px / ${assetSize}px ${assetSize}px no-repeat` //  #8d4a23
          );
        } else if (table[i][j + 1]) {
          backgrounds.push(
            `url(${groundTop}) ${(i + 2) * assetSize}px ${
              (j + 2) * assetSize
            }px / ${assetSize}px ${assetSize}px no-repeat`
          );
        } else if (table[i][j - 1]) {
          backgrounds.push(
            `url(${groundBottom}) ${(i + 2) * assetSize}px ${
              (j + 2) * assetSize
            }px / ${assetSize}px ${assetSize}px no-repeat`
          );
        } else {
          backgrounds.push(
            `url(${groundTopBottom}) ${(i + 2) * assetSize}px ${
              (j + 2) * assetSize
            }px / ${assetSize}px ${assetSize}px no-repeat`
          );
        }
      }
    }
  }

  // Details
  blocks.forEach((block) => {
    const { details, x, y, width } = block;
    if (details) {
      for (const { detail: index, x: offset } of details) {
        const detail = allDetails[index];
        const background = getDetailBackground(
          detail,
          x / assetSize + offset,
          y / assetSize
        );
        backgrounds.push(background);
      }
    } else {
      const j = y / assetSize;
      for (let i = x / assetSize; i < (x + width) / assetSize; i++) {
        if (randomInt(randomChance) === 0) {
          const index = randomInt(randomDetails.length - 1);
          const detail = randomDetails[index];
          let k = 0;
          while (
            k < detail.width &&
            table[i - k] &&
            table[i - k][j] !== null &&
            table[i - k][j - 1] === null
          ) {
            k++;
          }
          if (k === detail.width) {
            const background = getDetailBackground(detail, i, j);
            backgrounds.push(background);
          }
        }
      }
    }
  });

  return backgrounds.join(",");
}
