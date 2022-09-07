import BN from "bn.js";
import { SFT_COLLECTION_ADDRESS } from "../constants";
import { SFTCollectionView } from "../get-methods";
import { Address } from "ton";
import { getArgOrDefault } from "../../utils/script-utils";

async function main() {
  const sft_minter_address = await new SFTCollectionView().getSFTAddressByIndex(
    Address.parse(SFT_COLLECTION_ADDRESS),
    new BN(0) //index
  );
  console.log(sft_minter_address?.toFriendly());
}

main().catch((r) => console.log(r.response ?? r));
