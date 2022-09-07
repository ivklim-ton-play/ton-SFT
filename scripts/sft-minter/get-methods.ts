import { Address, TupleSlice, TonClient } from "ton";
import { repeatIfFails } from "../utils/script-utils";
import { packTvmStackSlice } from "../utils/ton-utils";

export class SFTMinter {
  protected tonClient: TonClient;

  constructor(client: TonClient) {
    this.tonClient = client;
  }

  public async getSFTMinterData(sftMinter: Address) {
    const result = await repeatIfFails(
      async () => await this.tonClient.callGetMethod(sftMinter, "get_sft_data")
    );
    if (result == null) return null;

    const stack = new TupleSlice(result.stack);

    return {
      init: stack.readBoolean(),
      index: stack.readBigNumber(),
      collection_address: stack.readCell().beginParse().readAddress(),
      total_supply: stack.readBigNumber(),
      admin_address: stack.readCell().beginParse().readAddress(),
      individual_sft_content: stack.readCell(),
      sft_wallet_code: stack.readCell(),
    };
  }

  public async getSFTWalletAddress(sftMinter: Address, owner: Address) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(
          sftMinter,
          "get_sft_wallet_address",
          [packTvmStackSlice(owner)]
        )
    );
    if (result == null) return null;

    const tupleSlice = new TupleSlice(result.stack);
    return tupleSlice.readCell().beginParse().readAddress();
  }
}
