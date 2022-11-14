import { Address, fromNano } from "ton";
import { JETTON_WALLET } from "../constants";
import { JettonWalletView } from "../get-methods";

async function main() {
  const view = new JettonWalletView();

  const data = await view.getWalletData(Address.parse(JETTON_WALLET));

  console.log("balance:", data?.jettonAmount.toString() ?? 0);
  console.log("owner:", data?.owner?.toFriendly());
  console.log("jetton-minter", data?.jettonMinter?.toFriendly());
}

main().catch((r) => console.log(r.response ?? r));
