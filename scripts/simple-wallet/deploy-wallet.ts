import { StateInit, WalletContract, toNano, CommentMessage } from 'ton';
import { sendInternalMessageWithWallet } from './simple-wallet';

export async function deployWallet(wallet: WalletContract) {
    console.log("Deploying the wallet contract...")

    await sendInternalMessageWithWallet({
        to: wallet.address,
        value: toNano(0.02),
        stateInit: new StateInit({
            code: wallet.source.initialCode,
            data: wallet.source.initialData
        }),
        message: new CommentMessage("Deployment")
    });

    console.log("The wallet has been deployed");
}