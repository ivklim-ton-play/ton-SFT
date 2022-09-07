import { Address, TupleSlice } from "ton";
import { DefaultTestnetClient } from "../simple-wallet/simple-wallet";
import { repeatIfFails } from "../utils/script-utils";

export class SFTWalletView {
  public tonClient = DefaultTestnetClient;

  public async getWalletData(sftWallet: Address) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(sftWallet, "get_sft_wallet_data")
    );
    if (result == null) return null;

    const stack = new TupleSlice(result.stack);
    return {
      sftAmount: stack.readBigNumber(),
      owner: stack.readCell().beginParse().readAddress(),
      sftMinter: stack.readCell().beginParse().readAddress(),
      sftWalletCode: stack.readCell(),
    };
  }
}
