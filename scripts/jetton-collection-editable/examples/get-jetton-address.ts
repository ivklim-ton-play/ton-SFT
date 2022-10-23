import BN from "bn.js";
import { JETTON_COLLECTION_ADDRESS } from "../constants";
import { JettonCollectionView } from "../get-methods";
import { Address } from "ton";
import { getArgOrDefault } from "../../utils/script-utils";

async function main() {
  const jetton_minter_address =
    await new JettonCollectionView().getJettonAddressByIndex(
      Address.parse(JETTON_COLLECTION_ADDRESS),
      new BN(0) //index
    );
  console.log(jetton_minter_address?.toFriendly());
}

main().catch((r) => console.log(r.response ?? r));
