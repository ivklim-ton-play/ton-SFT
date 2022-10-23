import {
  GetWallet,
  sendInternalMessageWithWallet,
  DefaultTestnetClient,
  MNEMONIC_SENDER_WALLET,
} from "../../simple-wallet/simple-wallet";
import { getArgOrDefaultAddress } from "../../utils/script-utils";

import { Address } from "ton";
import {
  MINT_JETTON_GAS,
  JETTON_MINTER_ADDRESS,
  JETTON_RECIPIENT_ADDRESS,
} from "../constants";
import { JETTON_WALLET_GAS } from "../../jetton-wallet/constants";
import { JettonMinter } from "../get-methods";
import { JettonUtils } from "../utils";

async function main() {
  const client = DefaultTestnetClient!;
  const mnemonic = MNEMONIC_SENDER_WALLET!;

  const jettonMinter = Address.parse(JETTON_MINTER_ADDRESS);

  const recipient = Address.parse(JETTON_RECIPIENT_ADDRESS);

  const jettonAmount = 10;

  await sendInternalMessageWithWallet({
    client: client,
    mnemonic: mnemonic,

    bounce: true,
    to: jettonMinter!,
    value: JETTON_WALLET_GAS.add(MINT_JETTON_GAS),
    body: new JettonUtils().packMintJettonOp(null, recipient, jettonAmount, 0),
  });
}

main().catch((r) => console.log(r.response ?? r));
