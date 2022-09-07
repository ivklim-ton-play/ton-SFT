import { Address, beginCell } from "ton";

export function packTvmStackSlice(addr: Address) {
  const cell = beginCell().storeAddress(addr).endCell();
  const boc = cell.toBoc({ idx: false });
  return ["tvm.Slice", boc.toString("base64")];
}
