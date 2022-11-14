import { SendMode, Address } from "ton";
import {
  sendInternalMessageWithWallet,
  DefaultTestnetClient,
  MNEMONIC_SENDER_WALLET,
} from "../../simple-wallet/simple-wallet";
import BN from "bn.js";
import { JettonCollectionView } from "../get-methods";
import { JettonCollectionUtils } from "../utils";
import {
  ADMIN_ADDRESS,
  JETTON_COLLECTION_ADDRESS,
  JETTON_COLLECTION_GAS_FOR_MINT,
} from "../constants";
import {
  JETTON_METADATA_URL,
  JETTON_MINTER_DEPLOYMENT_PRICE,
} from "../../jetton-minter/constants";
import { getCellFromJson } from "../../utils/build-utils";
import { jettonWallet } from "../../contract-constant-name";

const getJettonContent = (index: BN) =>
  JETTON_METADATA_URL + index.addn(1).toString() + ".json"; // `/${index.addn(1)}`;

async function main() {
  const jettonCollectionView = new JettonCollectionView(DefaultTestnetClient!);
  const jettonCollectionUtils = new JettonCollectionUtils();

  console.log(
    "Getting the next index for Jetton Minter in the Jetton-collection..."
  );

  const collection = Address.parse(JETTON_COLLECTION_ADDRESS);

  const result = await jettonCollectionView.getJettonCollectionData(collection);
  if (result == null) {
    console.log("Getting collection data failed");
    return;
  }
  const nextIndex = result.nextJettonMinterIndex;

  let mintOperation;
  let tonAmount = JETTON_COLLECTION_GAS_FOR_MINT.add(
    JETTON_MINTER_DEPLOYMENT_PRICE
  ); // 0.017 TON for operation

  const jettonContent = getJettonContent(nextIndex);
  console.log("jettonContent: " + jettonContent);
  mintOperation = jettonCollectionUtils.packMintJettonMinterMessage(
    nextIndex,
    new BN(0),
    Address.parse(ADMIN_ADDRESS),
    jettonContent,
    getCellFromJson(jettonWallet)
  );
  console.log("Minting a new Jetton with index: " + nextIndex);

  await sendInternalMessageWithWallet({
    client: DefaultTestnetClient!,
    mnemonic: MNEMONIC_SENDER_WALLET!,
    to: collection,
    mode: SendMode.PAY_GAS_SEPARATLY,
    value: tonAmount,
    body: mintOperation,
  });
}

main().catch((r) => console.log(r.response ?? r));
