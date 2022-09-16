import { DefaultTestnetClient } from "../../simple-wallet/simple-wallet";
import { getArgOrDefaultAddress } from "../../utils/script-utils";
import { MINT_SFT_GAS, SFT_MINTER_ADDRESS } from "../constants";
import { Address, fromNano } from "ton";
import { SFTMinter } from "../get-methods";

async function main() {
  const sft_view = new SFTMinter(DefaultTestnetClient);

  const data = await sft_view.getSFTMinterCollectionData(
    Address.parse(SFT_MINTER_ADDRESS)
  );

  console.log(`Is init: ${data?.init}`);
  console.log(`Index:  ${data?.index}`);
  console.log(`Collection_address:  ${data?.collection_address?.toFriendly()}`);
}

main().catch((r) => console.log(r.response ?? r));
