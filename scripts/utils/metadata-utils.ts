import { beginCell, Cell } from "ton";

export function packMetadataOffchain(url: string) {
  const b = Buffer.from(url);
  const cell = beginCell().storeUint8(1);
  if (b.byteLength * 8 > 1000) {
    const len = url.length;
    const part1 = url.slice(0, len / 2);
    const part2 = url.slice(len / 2, len);

    cell
      .storeBuffer(Buffer.from(part1))
      .storeRef(beginCell().storeBuffer(Buffer.from(part2)).endCell());
  } else {
    cell.storeBuffer(Buffer.from(url));
  }
  return cell.endCell();
}
