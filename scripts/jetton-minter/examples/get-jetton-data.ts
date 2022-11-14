import { DefaultTestnetClient } from "../../simple-wallet/simple-wallet";
import { getArgOrDefaultAddress } from "../../utils/script-utils";
import { MINT_JETTON_GAS, JETTON_MINTER_ADDRESS } from "../constants";
import { Address, fromNano } from "ton";
import { JettonMinter } from "../get-methods";

async function main() {
  const jetton_view = new JettonMinter(DefaultTestnetClient);

  const data = await jetton_view.getJettonMinterData(
    Address.parse(JETTON_MINTER_ADDRESS)
  );
  console.log(`Total supply ${fromNano(data?.total_supply ?? 0)}`);
  console.log(`Mintable: ${data?.mintable}`);
  console.log(`Admin address:  ${data?.admin_address?.toFriendly()}`);

  const content = data?.individual_jetton_content.beginParse();
  console.log(content?.readUint(8));

  console.log(`Content:  ${content?.readRemainingBytes().toString()}`);
}

main().catch((r) => console.log(r.response ?? r));
