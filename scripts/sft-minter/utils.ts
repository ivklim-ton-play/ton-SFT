import { beginCell, Address, Cell } from "ton";
import BN from "bn.js";
import { MINT_OP } from "./constants";
import { INTERNAL_TRANSFER_OP, SFT_WALLET_GAS } from "../sft-wallet/constants";

export class SFTUtils {
  public packMintSFTOp(
    mintFrom: Address | null,
    mintTo: Address,
    mintAmount: number | BN,
    queryId?: number | BN
  ) {
    return beginCell()
      .storeUint(MINT_OP, 32)
      .storeUint(queryId ?? 0, 64)
      .storeAddress(mintTo)
      .storeCoins(SFT_WALLET_GAS)
      .storeRef(
        beginCell()
          .storeUint(INTERNAL_TRANSFER_OP, 32)
          .storeUint(queryId ?? 0, 64)
          .storeCoins(mintAmount)
          .storeAddress(mintFrom)
          .storeAddress(mintTo)
          .storeCoins(0)
          .endCell()
      )
      .endCell();
  }

  public packInitCell(
    totalSupply: BN,
    sftAdmin: Address,
    sftContent: string,
    sftWalletCode: Cell
  ) {
    const sftContentCell = beginCell()
      .storeBuffer(Buffer.from(sftContent))
      .endCell();
    return beginCell()
      .storeCoins(totalSupply)
      .storeAddress(sftAdmin)
      .storeRef(sftContentCell)
      .storeRef(sftWalletCode)
      .endCell();
  }
}
