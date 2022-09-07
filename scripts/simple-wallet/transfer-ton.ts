import { CommentMessage, toNano, Address } from 'ton';
import { sendInternalMessageWithWallet } from './simple-wallet';

export default async function transferTON(to: Address, value: string, message?: CommentMessage, fromMnemonic?: string[]) {
  await sendInternalMessageWithWallet({
    mnemonic: fromMnemonic,
    bounce: false,
    to: to, 
    value: toNano(value), 
    message: message
  });
}