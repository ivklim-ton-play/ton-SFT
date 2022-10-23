import { beginCell, Address, Cell } from "ton";
import BN from "bn.js";
import { TRANSFER_OP } from "./constants";

export class JettonWalletUtils {
  public packTransferJettonOp(
    recipient: Address,
    jettonAmount: number | BN,
    responseTo?: Address,
    forwardTonAmount?: number | BN,
    queryId?: number | BN
  ) {
    return beginCell()
      .storeUint(TRANSFER_OP, 32)
      .storeUint(queryId ?? 0, 64)
      .storeCoins(jettonAmount)
      .storeAddress(recipient)
      .storeAddress(responseTo ?? null) // op::excesses()
      .storeDict(null) // custom_payload ??
      .storeCoins(forwardTonAmount ?? 0) // op::transfer_notification()
      .storeBit(0)
      .endCell();
  }
}
