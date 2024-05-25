import { ground, groundBottom, groundLeft, groundLeftBottom, groundLeftTop, groundLeftTopBottom, groundRight, groundRightBottom, groundRightTop, groundRightTopBottom, groundTop, groundTopBottom } from "../logic/assets";
import { assetSize } from "../logic/config";
import { ILevel } from "../logic/types";

export function getBackground(level: ILevel) {
  const { blocks, width } = level;
  const table: boolean[][] = [];
  for (let i = 0; i < width / assetSize; i++) {
    table[i] = new Array(level.height / assetSize).fill(false);
  }

  blocks.forEach((block) => {
    const { height, type, x, y, width } = block;
    if (type === undefined) {
      for (let i = x / assetSize; i < (x + width) / assetSize; i++) {
        for (let j = y / assetSize; j < (y + height) / assetSize; j++) {
          table[i][j] = true;
        }
      }
    }
  });

  const backgrounds: string[] = [];
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[0].length; j++) {
      if (table[i][j]) {
        // Left side
        if (!table[i - 1] || !table[i - 1][j]) {
          if (table[i][j + 1] && table[i][j - 1]) {
            backgrounds.push(
              `url(${groundLeft}) ${(i - 1) * assetSize + 2 * assetSize}px ${
                j * assetSize + 2 * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`,
            );
          } else if (table[i][j + 1]) {
            backgrounds.push(
              `url(${groundLeftTop}) ${(i - 1) * assetSize + 2 * assetSize}px ${
                j * assetSize + 2 * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`,
            );
          } else if (table[i][j - 1]) {
            backgrounds.push(
              `url(${groundLeftBottom}) ${(i - 1) * assetSize + 2 * assetSize}px ${
                j * assetSize + 2 * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`,
            );
          } else {
            backgrounds.push(
              `url(${groundLeftTopBottom}) ${(i - 1) * assetSize + 2 * assetSize}px ${
                j * assetSize + 2 * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`,
            );
          }
        }
        // Right side
        if (!table[i + 1] || !table[i + 1][j]) {
          if (table[i][j + 1] && table[i][j - 1]) {
            backgrounds.push(
              `url(${groundRight}) ${(i + 1) * assetSize + 2 * assetSize}px ${
                j * assetSize + 2 * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`,
            );
          } else if (table[i][j + 1]) {
            backgrounds.push(
              `url(${groundRightTop}) ${(i + 1) * assetSize + 2 * assetSize}px ${
                j * assetSize + 2 * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`,
            );
          } else if (table[i][j - 1]) {
            backgrounds.push(
              `url(${groundRightBottom}) ${(i + 1) * assetSize + 2 * assetSize}px ${
                j * assetSize + 2 * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`,
            );
          } else {
            backgrounds.push(
              `url(${groundRightTopBottom}) ${(i + 1) * assetSize + 2 * assetSize}px ${
                j * assetSize + 2 * assetSize
              }px / ${assetSize}px ${assetSize}px no-repeat`,
            );
          }
        }
        // Ground
        if (table[i][j + 1] && table[i][j - 1]) {
          backgrounds.push(
            `url(${ground}) ${i * assetSize + 2 * assetSize}px ${
              j * assetSize + 2 * assetSize
            }px / ${assetSize}px ${assetSize}px no-repeat`, //  #8d4a23
          );
        } else if (table[i][j + 1]) {
          backgrounds.push(
            `url(${groundTop}) ${i * assetSize + 2 * assetSize}px ${
              j * assetSize + 2 * assetSize
            }px / ${assetSize}px ${assetSize}px no-repeat`,
          );
        } else if (table[i][j - 1]) {
          backgrounds.push(
            `url(${groundBottom}) ${i * assetSize + 2 * assetSize}px ${
              j * assetSize + 2 * assetSize
            }px / ${assetSize}px ${assetSize}px no-repeat`,
          );
        } else {
          backgrounds.push(
            `url(${groundTopBottom}) ${i * assetSize + 2 * assetSize}px ${
              j * assetSize + 2 * assetSize
            }px / ${assetSize}px ${assetSize}px no-repeat`,
          );
        }
      }
    }
  }

  return backgrounds.join(",");
}
