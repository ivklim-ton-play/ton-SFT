import { DefaultTestnetClient } from "../../simple-wallet/simple-wallet";
import { getArgOrDefaultAddress } from "../../utils/script-utils";
import {
  MINT_JETTON_GAS,
  USER_ADDRESS,
  JETTON_MINTER_ADDRESS,
} from "../constants";
import { Address, fromNano } from "ton";
import { JettonMinter } from "../get-methods";

async function main() {
  const jetton_view = new JettonMinter(DefaultTestnetClient);

  const data = await jetton_view.getJettonWalletAddress(
    Address.parse(JETTON_MINTER_ADDRESS),
    Address.parse(USER_ADDRESS)
  );

  console.log(`Jetton Wallet address: ${data?.toFriendly()}`);
}

main().catch((r) => console.log(r.response ?? r));
