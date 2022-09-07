import { CommentMessage, toNano, Address, beginCell } from 'ton';
import { sendInternalMessageWithWallet } from './simple-wallet';

export default async function withdrawAll(to: Address) {
  await sendInternalMessageWithWallet({
    to: to, 
    value: toNano(0.02), 
    body: beginCell()
      .storeUint(2222, 32) //withdraw op_id
      .storeUint(0, 64)
      .endCell()
  });
}