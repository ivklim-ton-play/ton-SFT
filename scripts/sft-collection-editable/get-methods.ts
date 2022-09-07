import { Address, TupleSlice, TonClient } from "ton";
import BN from "bn.js";
import { DefaultTestnetClient } from "../simple-wallet/simple-wallet";
import { repeatIfFails } from "../utils/script-utils";

export class SFTCollectionView {
  protected tonClient: TonClient;

  constructor(tonClient?: TonClient) {
    this.tonClient = tonClient ?? DefaultTestnetClient;
  }

  public async getSFTCollectionData(collection: Address) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(
          collection,
          "get_sft_collection_data"
        )
    );
    if (result == null) return null;

    const stack = new TupleSlice(result.stack);
    return {
      nextSFTMinterIndex: stack.readBigNumber(),
      metadata: stack.readCell(),
      owner: stack.readCell().beginParse().readAddress(),
    };
  }

  public async getSFTAddressByIndex(collection: Address, index: BN) {
    const result = await repeatIfFails(
      async () =>
        await this.tonClient.callGetMethod(
          collection,
          "get_sft_minter_address_by_index",
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
