import {
  jettonCollection,
  jettonMinter,
  jettonWallet,
} from "./contract-constant-name";
import { build } from "./utils/build-utils";
import { compile } from "./utils/compile-utils";

async function main() {
  const STD_LIB_FILE = "stdlib.fc";
  const PARAMS_FILE = "params.fc";
  const OP_CODES_FILE = "op-codes.fc";
  const JETTON_UTILS = "jetton-utils.fc";

  // compilation func to fift
  compile(jettonCollection, [
    STD_LIB_FILE,
    PARAMS_FILE,
    OP_CODES_FILE,
    JETTON_UTILS,
  ]);
  compile(jettonMinter, [
    STD_LIB_FILE,
    PARAMS_FILE,
    OP_CODES_FILE,
    JETTON_UTILS,
  ]);
  compile(jettonWallet, [
    STD_LIB_FILE,
    PARAMS_FILE,
    OP_CODES_FILE,
    JETTON_UTILS,
  ]);

  // fift to bocAsJson. See 'build/json' directory
  build(jettonCollection);
  build(jettonMinter);
  build(jettonWallet);
}

main().catch((r) => console.log(r.response ?? r));
