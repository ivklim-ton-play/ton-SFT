import { sftCollection, sftMinter, sftWallet } from "./contract-constant-name";
import { build } from "./utils/build-utils";
import { compile } from "./utils/compile-utils";

async function main() {
  const STD_LIB_FILE = "stdlib.fc";
  const PARAMS_FILE = "params.fc";
  const OP_CODES_FILE = "op-codes.fc";
  const SFT_UTILS = "sft-utils.fc";

  // compilation func to fift
  compile(sftCollection, [STD_LIB_FILE, PARAMS_FILE, OP_CODES_FILE, SFT_UTILS]);
  compile(sftMinter, [STD_LIB_FILE, PARAMS_FILE, OP_CODES_FILE, SFT_UTILS]);
  compile(sftWallet, [STD_LIB_FILE, PARAMS_FILE, OP_CODES_FILE, SFT_UTILS]);

  // fift to bocAsJson. See 'build/json' directory
  build(sftCollection);
  build(sftMinter);
  build(sftWallet);
}

main().catch((r) => console.log(r.response ?? r));
