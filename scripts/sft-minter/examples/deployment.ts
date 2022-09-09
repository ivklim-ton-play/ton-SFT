import {
  DefaultTestnetClient,
  MNEMONIC_SENDER_WALLET,
  sendInternalMessageWithWallet,
} from "../../simple-wallet/simple-wallet";
import BN from "bn.js";
import { Address, StateInit, beginCell, contractAddress } from "ton";
import { getCellFromJson } from "../../utils/build-utils";
import { sftMinter, sftWallet } from "../../contract-constant-name";
import { ADMIN_ADDRESS } from "../../sft-collection-editable/constants";
import { SFT_MINTER_DEPLOYMENT_PRICE } from "../constants";

async function main() {
  // ;; storage#_
  // index:uint64
  // collection_address:MsgAddress
  // total_supply:Coins
  // admin_address:MsgAddress
  // individual_sft_content:^Cell
  // sft_wallet_code:^Cell = Storage;

  const stateInit = new StateInit({
    code: getCellFromJson(sftMinter),
    data: beginCell()
      .storeUint(1, 64)
      .storeAddress(null)
      .storeCoins(12)
      .storeAddress(Address.parse(ADMIN_ADDRESS))
      .storeRef(beginCell().storeBuffer(Buffer.from("")).endCell())
      .storeRef(getCellFromJson(sftWallet))
      .endCell(),
  });

  const addr = contractAddress({
    workchain: 0,
    initialCode: stateInit.code!,
    initialData: stateInit.data!,
  });

  console.log(
    "SFT minter address: ",
    addr.toFriendly({ urlSafe: true, bounceable: true })
  );

  await sendInternalMessageWithWallet({
    client: DefaultTestnetClient,
    mnemonic: MNEMONIC_SENDER_WALLET,

    to: addr,
    value: SFT_MINTER_DEPLOYMENT_PRICE,
    stateInit: stateInit,
    deployCheck: true,
  });
}

main().catch((r) => console.log(r.response ?? r));
