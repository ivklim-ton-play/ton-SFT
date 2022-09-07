import { Address, toNano, fromNano } from "ton";
import { DefaultTestnetClient } from "../../simple-wallet/simple-wallet";
import { SFT_COLLECTION_ADDRESS } from "../constants";
import { SFTCollectionView } from "../get-methods";

async function main() {
  const collection = Address.parse(SFT_COLLECTION_ADDRESS);
  const collectionView = new SFTCollectionView(DefaultTestnetClient);

  const result = await collectionView.getSFTCollectionData(collection);
  console.log("next sft-minter-index:", result?.nextSFTMinterIndex);
  console.log("metadata:", result?.metadata);
  console.log("owner:", result?.owner);
}
main().catch((r) => console.log(r.response ?? r));
