import { beginCell, Cell } from "ton";

export function packMetadataOffchain(url: string) {
  const b = Buffer.from(url);
  const cell = beginCell().storeUint8(1);
  if (b.byteLength * 8 > 1000) {
    const len = url.length;
    const part1 = url.slice(0, len / 2);
    const part2 = url.slice(len / 2, len);
    // console.log(part1);
    // console.log(part2);
    // console.log(part1 + part2);

    cell
      .storeBuffer(Buffer.from(part1))
      .storeRef(beginCell().storeBuffer(Buffer.from(part2)).endCell());
  } else {
    cell.storeBuffer(Buffer.from(url));
  }
  return cell.endCell();
}

// unpack???
// export function unpackMetadataOffchain(metadataCell: Cell) {
//     return "";
// }

// export function packMetadataOnchain(metadata: string) {
//     return beginCell().storeUint8(0).storeBuffer(Buffer.from(metadata)).endCell();
// }
