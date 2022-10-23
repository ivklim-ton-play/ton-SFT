import {
  GetWallet,
  sendInternalMessageWithWallet,
  MNEMONIC_RECIPIENT_WALLET,
  DefaultTestnetClient,
} from "../../simple-wallet/simple-wallet";
import { getArgOrDefaultAddress } from "../../utils/script-utils";
import { toNano, Address } from "ton";
import { JettonWalletUtils } from "../utils";
import { JETTON_WALLET_GAS } from "../constants";
import { JettonMinter } from "../../jetton-minter/get-methods";
import { JETTON_MINTER_ADDRESS } from "../../jetton-minter/constants";

async function main() {
  const jettonMinter = getArgOrDefaultAddress(2, JETTON_MINTER_ADDRESS);

  const [senderWallet] = await GetWallet();
  const [recipientWallet] = await GetWallet(
    undefined,
    0,
    MNEMONIC_RECIPIENT_WALLET
  );

  const jettonWallet = await new JettonMinter(
    DefaultTestnetClient
  ).getJettonWalletAddress(jettonMinter, senderWallet.address);

  if (jettonWallet == null) return false;

  const jettonAmount = 10;

  return await sendInternalMessageWithWallet({
    bounce: true,
    to: jettonWallet!,
    value: toNano(1), // responseTo address is specified, all excesses will go there
    body: new JettonWalletUtils().packTransferJettonOp(
      recipientWallet.address,
      jettonAmount,
      senderWallet.address, // responseTo
      JETTON_WALLET_GAS,
      42 // queryId
    ),
  });
}

main().catch((r) => console.log(r.response ?? r));
