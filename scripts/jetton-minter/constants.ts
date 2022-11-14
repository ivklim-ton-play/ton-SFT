import { toNano } from "ton";
import {
  JETTON_COLLECTION_OWNER_ADDRESS,
  ROYALTY_ADDRESS,
} from "../jetton-collection-editable/constants";

export const JETTON_MINTER_DEPLOYMENT_PRICE = toNano(0.01);
export const MINT_JETTON_GAS = toNano(0.02);

export const MINT_OP = 21;
export const CHANGE_ADMIN = 23;
export const CHANGE_INDIVIDUAL_JETTON_CONTENT = 24;

export const JETTON_METADATA_URL =
  "https://assets.tonplay.io/assets/Zeya/zeyacards/md/buildings_jetton/";

//after jetton  deployed
export const JETTON_MINTER_ADDRESS = "";
export const JETTON_RECIPIENT_ADDRESS = JETTON_COLLECTION_OWNER_ADDRESS;
export const JETTON_AMOUNT = 1;

//for get methods
//export const USER_ADDRESS = "EQCHDRoDfFFMR4xswz1-Us34_MewfRde3qu1LrZNaC-pHSFs"; //address for wallet check via method getJettonWalletAddress
