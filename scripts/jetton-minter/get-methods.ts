import { Address, TupleSlice, TonClient } from "ton";
import { repeatIfFails } from "../utils/script-utils";
import { packTvmStackSlice } from "../utils/ton-utils";

export class JettonMinter {
  protected tonClient: TonClient;

  constructor(client: TonClient) {
    this.tonClient = client;
  }

  public async getJettonMinterData(jettonMinter: Address) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(jettonMinter, "get_jetton_data")
    );
    if (result == null) return null;

    const stack = new TupleSlice(result.stack);

    return {
      total_supply: stack.readBigNumber(),
      mintable: stack.readBoolean(),
      admin_address: stack.readCell().beginParse().readAddress(),
      individual_jetton_content: stack.readCell(),
      jetton_wallet_code: stack.readCell(),
    };
  }

  public async getJettonMinterCollectionData(jettonMinter: Address) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(
          jettonMinter,
          "get_jetton_collection_data"
        )
    );
    if (result == null) return null;

    const stack = new TupleSlice(result.stack);

    return {
      init: stack.readBoolean(),
      index: stack.readBigNumber(),
      collection_address: stack.readCell().beginParse().readAddress(),
    };
  }

  public async getJettonWalletAddress(jettonMinter: Address, owner: Address) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(jettonMinter, "get_wallet_address", [
          packTvmStackSlice(owner),
        ])
    );
    if (result == null) return null;

    const tupleSlice = new TupleSlice(result.stack);
    return tupleSlice.readCell().beginParse().readAddress();
  }
}
