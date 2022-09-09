import { toNano } from "ton";

export const SFT_MINTER_DEPLOYMENT_PRICE = toNano(0.01);
export const MINT_SFT_GAS = toNano(0.02);

export const MINT_OP = 21;
export const CHANGE_ADMIN = 23;
export const CHANGE_INDIVIDUAL_SFT_CONTENT = 24;

export const SFT_MINTER_ADDRESS =
  "EQBCjeKyRXGcgN8Npe3LLROeu80d0pOygW-0v39xjYpNmbCa";
export const SFT_RECIPIENT_ADDRESS =
  "EQCHDRoDfFFMR4xswz1-Us34_MewfRde3qu1LrZNaC-pHSFs";

//for get methods
export const USER_ADDRESS = "EQCHDRoDfFFMR4xswz1-Us34_MewfRde3qu1LrZNaC-pHSFs"; //address for wallet check via method getSFTWalletAddress
