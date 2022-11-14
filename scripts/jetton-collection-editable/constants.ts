import { Address, toNano } from "ton";

export const JETTON_COLLECTION_DEPLOYMENT_PRICE = toNano(0.0005);
export const COLLECTION_TRANSFER_PRICE = toNano(0.01);
export const JETTON_COLLECTION_GAS_FOR_MINT = toNano(0.027);

export const JETTON_COLLECTION_OWNER_ADDRESS =
  "EQBAXUIEg5ioFiNCUcMQ_lomlpPN5NVNy2iq3baUrnjZxnab";
export const ROYALTY_ADDRESS =
  "EQC0bI-5wdrV1xIJ4WK_iixKSdcW0SNaAz6-qfYbto28qDTD";

export const JETTON_COLLECTION_METADATA_URL =
  "https://assets.tonplay.io/assets/Zeya/zeyacards/md/Buildings_collection_metadata.json";
export const JETTON_METADATA_COMMON_URL = "";

///after deploy
export const JETTON_COLLECTION_ADDRESS = ""; //for test update after deploy

export const ADMIN_ADDRESS = JETTON_COLLECTION_OWNER_ADDRESS;
