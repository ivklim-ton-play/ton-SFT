import {
  GetWallet,
  sendInternalMessageWithWallet,
  DefaultTestnetClient,
  MNEMONIC_SENDER_WALLET,
} from "../../simple-wallet/simple-wallet";
import { getArgOrDefaultAddress } from "../../utils/script-utils";

import { Address } from "ton";
import {
  MINT_SFT_GAS,
  SFT_MINTER_ADDRESS,
  SFT_RECIPIENT_ADDRESS,
} from "../constants";
import { SFT_WALLET_GAS } from "../../sft-wallet/constants";
import { SFTMinter } from "../get-methods";
import { SFTUtils } from "../utils";

async function main() {
  const client = DefaultTestnetClient!;
  const mnemonic = MNEMONIC_SENDER_WALLET!;

  const sftMinter = Address.parse(SFT_MINTER_ADDRESS);

  const recipient = Address.parse(SFT_RECIPIENT_ADDRESS);

  const sftAmount = 10;

  await sendInternalMessageWithWallet({
    client: client,
    mnemonic: mnemonic,

    bounce: true,
    to: sftMinter!,
    value: SFT_WALLET_GAS.add(MINT_SFT_GAS),
    body: new SFTUtils().packMintSFTOp(null, recipient, sftAmount, 0),
  });
}

main().catch((r) => console.log(r.response ?? r));
