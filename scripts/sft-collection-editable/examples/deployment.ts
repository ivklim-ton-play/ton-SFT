import {
  DefaultTestnetClient,
  GetWallet,
  MNEMONIC_SENDER_WALLET,
  sendInternalMessageWithWallet,
} from "../../simple-wallet/simple-wallet";
import BN from "bn.js";
import { Address, StateInit, beginCell, contractAddress } from "ton";
import {
  ROYALTY_ADDRESS,
  SFT_COLLECTION_DEPLOYMENT_PRICE,
  SFT_COLLECTION_OWNER_ADDRESS,
  SFT_METADATA_COMMON_URL,
  SFT_METADATA_URL,
} from "../constants";
import { getCellFromJson } from "../../utils/build-utils";
import {
  sftCollection,
  sftMinter,
  sftWallet,
} from "../../contract-constant-name";
import { SFTCollectionUtils } from "../utils";

async function main() {
  const [cllection_owner_wallet] = await GetWallet();

  const royalty = {
    numerator: 6,
    denominator: 100,
    to: Address.parse(ROYALTY_ADDRESS),
  };

  // (ds~load_msg_addr(), ;; owner_address
  // ds~load_uint(64), ;; next_item_index
  // ds~load_ref(), ;; content
  // ds~load_ref(), ;; sft_minter_code
  // ds~load_ref()  ;; royalty_params
  // );

  const utils = new SFTCollectionUtils();

  const stateInit = new StateInit({
    code: getCellFromJson(sftCollection),
    data: beginCell()
      .storeAddress(Address.parse(SFT_COLLECTION_OWNER_ADDRESS))
      .storeUint(0, 64)
      .storeRef(
        utils.packSFTCollectionContent(
          SFT_METADATA_URL,
          SFT_METADATA_COMMON_URL
        )
      )
      .storeRef(getCellFromJson(sftMinter))
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
    value: SFT_COLLECTION_DEPLOYMENT_PRICE,
    stateInit: stateInit,
    deployCheck: true,
  });
}

main().catch((r) => console.log(r.response ?? r));
