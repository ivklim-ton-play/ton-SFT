import { mnemonicToWalletKey, KeyPair } from "ton-crypto";
import {
  CellMessage,
  Address,
  Cell,
  SendMode,
  InternalMessage,
  CommonMessageInfo,
  Message,
  toNano,
} from "ton";
import BN from "bn.js";
import { TonClient, WalletContract, WalletV3R2Source } from "ton";
import { WaitFor } from "../utils/time-utils";
import { repeatIfFails, stringToArray } from "../utils/script-utils";
import dotenv from "dotenv";
dotenv.config();

export const DefaultTestnetClient = new TonClient({
  apiKey: process.env.TON_API_KEY,
  endpoint: process.env.TON_ENDPOINT!,
});
export const MNEMONIC_SENDER_WALLET = stringToArray(
  process.env.SECRET_MNEMONIC_SENDER
);
// export const MNEMONIC_RECIPIENT_WALLET = stringToArray(
//   process.env.SECRET_MNEMONIC_RECIPIENT
// );

export const MIN_OP_GAS = toNano(1);

export async function GetWallet(
  client?: TonClient,
  workchainId?: number,
  mnemonic?: string[]
): Promise<[WalletContract, KeyPair]> {
  client = client ?? DefaultTestnetClient;
  workchainId = workchainId ?? 0;
  mnemonic = mnemonic ?? MNEMONIC_SENDER_WALLET;

  const keys = await mnemonicToWalletKey(mnemonic);
  const walletSource = WalletV3R2Source.create({
    publicKey: keys.publicKey,
    workchain: workchainId,
  });
  const wallet = WalletContract.create(client, walletSource);

  return [wallet, keys];
}

export async function sendInternalMessageWithWallet(params: {
  client?: TonClient;
  mnemonic?: string[];
  workchainId?: number;
  to: Address;
  value: BN;
  fwdFees?: BN;
  bounce?: boolean;
  mode?: SendMode;
  stateInit?: Message;
  message?: Message;
  body?: Cell;
  deployCheck?: boolean;
}) {
  params.client = params.client ?? DefaultTestnetClient;
  params.mnemonic = params.mnemonic ?? MNEMONIC_SENDER_WALLET;

  const [wallet, keys] = await GetWallet(
    params.client,
    params.workchainId,
    params.mnemonic
  );

  if (params.stateInit && params.deployCheck) {
    const isDeployedAlready = await wallet.client.isContractDeployed(params.to);
    if (isDeployedAlready) {
      console.log("Contract is initialized already");
      return false;
    }
  }

  const message =
    params.message ?? (params.body ? new CellMessage(params.body) : undefined);
  const seqno = await repeatIfFails(async () => await wallet.getSeqNo());
  if (seqno == null) {
    console.log("wallet.seqno error");
    return false;
  }

  const internal = new InternalMessage({
    to: params.to,
    value: params.value,
    fwdFees: params.fwdFees,
    bounce: params.bounce ?? true,
    body: new CommonMessageInfo({
      stateInit: params.stateInit,
      body: message,
    }),
  });

  const transfer = wallet.createTransfer({
    secretKey: keys.secretKey,
    seqno: seqno,
    sendMode: params.mode ?? SendMode.PAY_GAS_SEPARATLY,
    order: internal,
  });

  console.log(new Date().toLocaleString());

  await wallet.client.sendExternalMessage(wallet, transfer);

  const result = await WaitFor(async () => {
    const seqnoAfter = await wallet.getSeqNo();
    return seqnoAfter > seqno;
  });

  return result;
}
