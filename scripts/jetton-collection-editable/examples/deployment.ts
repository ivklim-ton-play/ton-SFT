import {
  DefaultTestnetClient,
  GetWallet,
  MNEMONIC_SENDER_WALLET,
  sendInternalMessageWithWallet,
} from "../../simple-wallet/simple-wallet";
import BN from "bn.js";

import {
  ROYALTY_ADDRESS,
  JETTON_COLLECTION_DEPLOYMENT_PRICE,
  JETTON_COLLECTION_OWNER_ADDRESS,
  JETTON_METADATA_COMMON_URL,
  JETTON_COLLECTION_METADATA_URL,
} from "../constants";
import { getCellFromJson } from "../../utils/build-utils";
import {
  jettonCollection,
  jettonMinter,
  jettonWallet,
} from "../../contract-constant-name";
import { JettonCollectionUtils } from "../utils";
import { Address, beginCell, contractAddress, StateInit } from "ton";

async function main() {
  const [cllection_owner_wallet] = await GetWallet();

  const royalty = {
    numerator: 8,
    denominator: 100,
    to: Address.parse(ROYALTY_ADDRESS),
  };

  // (ds~load_msg_addr(), ;; owner_address
  // ds~load_uint(64), ;; next_item_index
  // ds~load_ref(), ;; content
  // ds~load_ref(), ;; jetton_minter_code
  // ds~load_ref()  ;; royalty_params
  // );

  const utils = new JettonCollectionUtils();

  const stateInit = new StateInit({
    code: getCellFromJson(jettonCollection),
    data: beginCell()
      .storeAddress(Address.parse(JETTON_COLLECTION_OWNER_ADDRESS))
      .storeUint(0, 64)
      .storeRef(
        utils.packJettonCollectionContent(
          JETTON_COLLECTION_METADATA_URL,
          JETTON_METADATA_COMMON_URL
        )
      )
      .storeRef(getCellFromJson(jettonMinter))
      .storeRef(
        utils.packRoyaltyParams(
          royalty.numerator,
          royalty.denominator,
          royalty.to
        )
      )
      .endCell(),
  });

  const addr = contractAddress({
    workchain: 0,
    initialCode: stateInit.code!,
    initialData: stateInit.data!,
  });

  console.log(
    "Collection address: ",
    addr.toFriendly({ urlSafe: true, bounceable: true })
  );

  await sendInternalMessageWithWallet({
    client: DefaultTestnetClient,
    mnemonic: MNEMONIC_SENDER_WALLET,

    to: addr,
    value: JETTON_COLLECTION_DEPLOYMENT_PRICE,
    stateInit: stateInit,
    deployCheck: true,
  });
}

main().catch((r) => console.log(r.response ?? r));
