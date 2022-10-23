import { Address, TupleSlice, TonClient } from "ton";
import BN from "bn.js";
import { DefaultTestnetClient } from "../simple-wallet/simple-wallet";
import { repeatIfFails } from "../utils/script-utils";

export class JettonCollectionView {
  protected tonClient: TonClient;

  constructor(tonClient?: TonClient) {
    this.tonClient = tonClient ?? DefaultTestnetClient;
  }

  public async getJettonCollectionData(collection: Address) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(collection, "get_collection_data")
    );
    if (result == null) return null;

    const stack = new TupleSlice(result.stack);
    return {
      nextJettonMinterIndex: stack.readBigNumber(),
      metadata: stack.readCell(),
      owner: stack.readCell().beginParse().readAddress(),
    };
  }

  public async getJettonAddressByIndex(collection: Address, index: BN) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(
          collection,
          "get_nft_address_by_index",
          [["int", index.toString()]]
        )
    );
    if (result == null) return null;

    const tupleSlice = new TupleSlice(result.stack);
    return tupleSlice.readCell().beginParse().readAddress();
  }

  public async getRoyaltyParams(collection: Address) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(collection, "royalty_params")
    );
    if (result == null) return null;

    const tupleSlice = new TupleSlice(result.stack);
    return {
      numerator: tupleSlice.readNumber(),
      denominator: tupleSlice.readNumber(),
      royaltyTo: tupleSlice.readCell().beginParse().readAddress(),
    };
  }
}
