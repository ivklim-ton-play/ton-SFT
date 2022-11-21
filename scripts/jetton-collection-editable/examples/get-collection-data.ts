import { Address, toNano, fromNano } from "ton";
import { DefaultTestnetClient } from "../../simple-wallet/simple-wallet";
import { JETTON_COLLECTION_ADDRESS } from "../constants";
import { JettonCollectionView } from "../get-methods";

async function main() {
  const collection = Address.parse(JETTON_COLLECTION_ADDRESS);
  const collectionView = new JettonCollectionView(DefaultTestnetClient);

  const result = await collectionView.getJettonCollectionData(collection);
  console.log("next jetton-minter-index:", result?.nextJettonMinterIndex);

  const metadata = result?.metadata.beginParse();

  console.log("metadata:", metadata?.readRemainingBytes().toString());
  console.log("owner:", result?.owner);
}
main().catch((r) => console.log(r.response ?? r));
