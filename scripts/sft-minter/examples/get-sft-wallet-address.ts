import { DefaultTestnetClient } from "../../simple-wallet/simple-wallet";
import { getArgOrDefaultAddress } from "../../utils/script-utils";
import { MINT_SFT_GAS, USER_ADDRESS, SFT_MINTER_ADDRESS } from "../constants";
import { Address, fromNano } from "ton";
import { SFTMinter } from "../get-methods";

async function main() {
  const sft_view = new SFTMinter(DefaultTestnetClient);

  const data = await sft_view.getSFTWalletAddress(
    Address.parse(SFT_MINTER_ADDRESS),
    Address.parse(USER_ADDRESS)
  );

  console.log(`SFT Wallet address: ${data?.toFriendly()}`);
}

main().catch((r) => console.log(r.response ?? r));
