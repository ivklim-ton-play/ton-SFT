import { toNano } from "ton";

export const TRANSFER_OP = 0xf8a7ea5;
export const INTERNAL_TRANSFER_OP = 0x178d4519;

export const SFT_WALLET_GAS = toNano(0.01); //for sft wallet op. need always because maybe you need deploy wallet