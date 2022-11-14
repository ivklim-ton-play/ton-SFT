import { beginCell, Address, Cell } from "ton";
import BN from "bn.js";
import { MINT_OP } from "./constants";
import {
  INTERNAL_TRANSFER_OP,
  JETTON_WALLET_GAS,
} from "../jetton-wallet/constants";

export class JettonUtils {
  public packMintJettonOp(
    mintFrom: Address | null,
    mintTo: Address,
    mintAmount: number | BN,
    queryId?: number | BN
  ) {
    return beginCell()
      .storeUint(MINT_OP, 32)
      .storeUint(queryId ?? 0, 64)
      .storeAddress(mintTo)
      .storeCoins(JETTON_WALLET_GAS)
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
    jettonAdmin: Address,
    jettonContent: string,
    jettonWalletCode: Cell
  ) {
    const jettonContentCell = beginCell()
      .storeUint8(1)
      .storeBuffer(Buffer.from(jettonContent))
      .endCell();
    return beginCell()
      .storeCoins(totalSupply)
      .storeAddress(jettonAdmin)
      .storeRef(jettonContentCell)
      .storeRef(jettonWalletCode)
      .endCell();
  }
}
