import {
  GetWallet,
  sendInternalMessageWithWallet,
  DefaultTestnetClient,
  MNEMONIC_SENDER_WALLET,
} from "../../simple-wallet/simple-wallet";
import { getArgOrDefaultAddress } from "../../utils/script-utils";

import { Address, toNano } from "ton";
import {
  MINT_SFT_GAS,
  SFT_MINTER_ADDRESS,
  SFT_RECIPIENT_ADDRESS,
} from "../constants";
import { SFT_WALLET_GAS } from "../../sft-wallet/constants";
import { SFTMinter } from "../get-methods";
import { SFTUtils } from "../utils";

async function main() {
  const client = DefaultTestnetClient;
  const mnemonic = MNEMONIC_SENDER_WALLET;

  const sftMinter = Address.parse(SFT_MINTER_ADDRESS);

  await sendInternalMessageWithWallet({
    client: client,
    mnemonic: mnemonic,
    bounce: true,
    to: sftMinter!,
    value: toNano(0.1),
    body: new SFTUtils().packChangeIndividualSFTContent("1"),
  });
}

main().catch((r) => console.log(r.response ?? r));
