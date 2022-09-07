import { mnemonicToWalletKey, KeyPair } from "ton-crypto";
import { CellMessage, Address, Cell, SendMode, InternalMessage, CommonMessageInfo, Message, toNano } from 'ton';
import BN from 'bn.js';
import {
    TonClient, 
    WalletContract, 
    WalletV3R2Source 
} from "ton";
import { WaitFor } from "../utils/time-utils";
import { repeatIfFails, stringToArray } from '../utils/script-utils';
import dotenv from 'dotenv';
dotenv.config();

export const MainnetClient = process.env.MAINNET_TON_API_KEY ? new TonClient({
    apiKey: process.env.MAINNET_TON_API_KEY,
    endpoint: process.env.MAINNET_TON_ENDPOINT!,
}) : null;
export const MAINNET_WALLET_MNEMONIC = process.env.SECRET_MNEMONIC_REAL ? stringToArray(process.env.SECRET_MNEMONIC_REAL) : null;

export const DefaultTestnetClient = new TonClient({
    apiKey: process.env.TON_API_KEY,
    endpoint: process.env.TON_ENDPOINT!,
});
export const MNEMONIC_TEST_WALLET_1 = stringToArray(process.env.SECRET_MNEMONIC_1);
export const MNEMONIC_TEST_WALLET_2 = stringToArray(process.env.SECRET_MNEMONIC_2);
export const MNEMONIC_TEST_WALLET_3 = stringToArray(process.env.SECRET_MNEMONIC_3);

export const MIN_OP_GAS = toNano(1);

export async function GetWallet(client?:TonClient, workchainId?:number, mnemonic?:string[])
: Promise<[WalletContract, KeyPair]> {
    client = client ?? DefaultTestnetClient;
    workchainId = workchainId ?? 0;
    mnemonic = mnemonic ?? MNEMONIC_TEST_WALLET_1;
    
    const keys = await mnemonicToWalletKey(mnemonic);
    const walletSource = WalletV3R2Source.create({publicKey:keys.publicKey, workchain:workchainId});
    const wallet = WalletContract.create(client, walletSource);
    
    return [wallet, keys];
}

export async function sendInternalMessageWithWallet(params: { 
    client?: TonClient, 
    mnemonic?: string[], 
    workchainId?: number, 
    to: Address,
    value: BN,
    fwdFees?: BN,
    bounce?: boolean,
    mode?: SendMode,
    stateInit?: Message,
    message?: Message,
    body?: Cell,
    deployCheck?: boolean
}) {
    params.client = params.client ?? DefaultTestnetClient;
    params.mnemonic = params.mnemonic ?? MNEMONIC_TEST_WALLET_1;

    const [wallet, keys] = await GetWallet(params.client, params.workchainId, params.mnemonic);
    
    if (params.stateInit && params.deployCheck) {
        const isDeployedAlready = await wallet.client.isContractDeployed(params.to);
        if (isDeployedAlready) {
            console.log("Contract is initialized already");
            return false;
        }
    }

    const message = params.message ?? (params.body ? new CellMessage(params.body) : undefined);
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
        })
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