import { SendMode, Address } from "ton";
import {
  sendInternalMessageWithWallet,
  DefaultTestnetClient,
  MNEMONIC_SENDER_WALLET,
} from "../../simple-wallet/simple-wallet";
import BN from "bn.js";
import { SFTCollectionView } from "../get-methods";
import { SFTCollectionUtils } from "../utils";
import {
  ADMIN_ADDRESS,
  SFT_COLLECTION_ADDRESS,
  SFT_COLLECTION_GAS_FOR_MINT,
} from "../constants";
import { SFT_MINTER_DEPLOYMENT_PRICE } from "../../sft-minter/constants";
import { getCellFromJson } from "../../utils/build-utils";
import { sftWallet } from "../../contract-constant-name";

const getSFTContent = (index: BN) => ""; // `/${index.addn(1)}`;

async function main() {
  const sftCollectionView = new SFTCollectionView(DefaultTestnetClient!);
  const sftCollectionUtils = new SFTCollectionUtils();

  console.log("Getting the next index for SFT Minter in the SFT-collection...");

  const collection = Address.parse(SFT_COLLECTION_ADDRESS);

  const result = await sftCollectionView.getSFTCollectionData(collection);
  if (result == null) {
    console.log("Getting collection data failed");
    return;
  }
  const nextIndex = result.nextSFTMinterIndex;

  let mintOperation;
  let tonAmount = SFT_COLLECTION_GAS_FOR_MINT.add(SFT_MINTER_DEPLOYMENT_PRICE); // 0.017 TON for operation

  const sftContent = getSFTContent(nextIndex);
  mintOperation = sftCollectionUtils.packMintSFTMinterMessage(
    nextIndex,
    new BN(0),
    Address.parse(ADMIN_ADDRESS),
    sftContent,
    getCellFromJson(sftWallet)
  );
  console.log("Minting a new SFT with index: " + nextIndex);

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
