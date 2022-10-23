import { Address, TupleSlice } from "ton";
import { DefaultTestnetClient } from "../simple-wallet/simple-wallet";
import { repeatIfFails } from "../utils/script-utils";

export class JettonWalletView {
  public tonClient = DefaultTestnetClient;

  public async getWalletData(jettonWallet: Address) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(jettonWallet, "get_wallet_data")
    );
    if (result == null) return null;

    const stack = new TupleSlice(result.stack);
    return {
      jettonAmount: stack.readBigNumber(),
      owner: stack.readCell().beginParse().readAddress(),
      jettonMinter: stack.readCell().beginParse().readAddress(),
      jettonWalletCode: stack.readCell(),
    };
  }
}
