import {
  DefaultTestnetClient,
  MNEMONIC_SENDER_WALLET,
  sendInternalMessageWithWallet,
} from "../../simple-wallet/simple-wallet";
import BN from "bn.js";
import { Address, StateInit, beginCell, contractAddress } from "ton";
import { getCellFromJson } from "../../utils/build-utils";
import { jettonMinter, jettonWallet } from "../../contract-constant-name";
import { ADMIN_ADDRESS } from "../../jetton-collection-editable/constants";
import { JETTON_MINTER_DEPLOYMENT_PRICE } from "../constants";

async function main() {
  // ;; storage#_
  // index:uint64
  // collection_address:MsgAddress
  // total_supply:Coins
  // admin_address:MsgAddress
  // individual_jetton_content:^Cell
  // jetton_wallet_code:^Cell = Storage;

  const stateInit = new StateInit({
    code: getCellFromJson(jettonMinter),
    data: beginCell()
      .storeUint(1, 64)
      .storeAddress(null)
      .storeCoins(12)
      .storeAddress(Address.parse(ADMIN_ADDRESS))
      .storeRef(beginCell().storeBuffer(Buffer.from("")).endCell())
      .storeRef(getCellFromJson(jettonWallet))
      .endCell(),
  });

  const addr = contractAddress({
    workchain: 0,
    initialCode: stateInit.code!,
    initialData: stateInit.data!,
  });

  console.log(
    "Jetton minter address: ",
    addr.toFriendly({ urlSafe: true, bounceable: true })
  );

  await sendInternalMessageWithWallet({
    client: DefaultTestnetClient,
    mnemonic: MNEMONIC_SENDER_WALLET,

    to: addr,
    value: JETTON_MINTER_DEPLOYMENT_PRICE,
    stateInit: stateInit,
    deployCheck: true,
  });
}

main().catch((r) => console.log(r.response ?? r));
