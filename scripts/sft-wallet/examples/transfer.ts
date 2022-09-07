import {
  GetWallet,
  sendInternalMessageWithWallet,
  MNEMONIC_RECIPIENT_WALLET,
  DefaultTestnetClient,
} from "../../simple-wallet/simple-wallet";
import { getArgOrDefaultAddress } from "../../utils/script-utils";
import { toNano, Address } from "ton";
import { SFTWalletUtils } from "../utils";
import { SFT_WALLET_GAS } from "../constants";
import { SFTMinter } from "../../sft-minter/get-methods";
import { SFT_MINTER_ADDRESS } from "../../sft-minter/constants";

async function main() {
  const sftMinter = getArgOrDefaultAddress(2, SFT_MINTER_ADDRESS);

  const [senderWallet] = await GetWallet();
  const [recipientWallet] = await GetWallet(
    undefined,
    0,
    MNEMONIC_RECIPIENT_WALLET
  );

  const sftWallet = await new SFTMinter(
    DefaultTestnetClient
  ).getSFTWalletAddress(sftMinter, senderWallet.address);

  if (sftWallet == null) return false;

  const sftAmount = 10;

  return await sendInternalMessageWithWallet({
    bounce: true,
    to: sftWallet!,
    value: toNano(1), // responseTo address is specified, all excesses will go there
    body: new SFTWalletUtils().packTransferSFTOp(
      recipientWallet.address,
      sftAmount,
      senderWallet.address, // responseTo
      SFT_WALLET_GAS,
      42 // queryId
    ),
  });
}

main().catch((r) => console.log(r.response ?? r));
