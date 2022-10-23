import { DefaultTestnetClient } from "../../simple-wallet/simple-wallet";
import { getArgOrDefaultAddress } from "../../utils/script-utils";
import { MINT_JETTON_GAS, JETTON_MINTER_ADDRESS } from "../constants";
import { Address, fromNano } from "ton";
import { JettonMinter } from "../get-methods";

async function main() {
  const jetton_view = new JettonMinter(DefaultTestnetClient);

  const data = await jetton_view.getJettonMinterCollectionData(
    Address.parse(JETTON_MINTER_ADDRESS)
  );

  console.log(`Is init: ${data?.init}`);
  console.log(`Index:  ${data?.index}`);
  console.log(`Collection_address:  ${data?.collection_address?.toFriendly()}`);
}

main().catch((r) => console.log(r.response ?? r));
