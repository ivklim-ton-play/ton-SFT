import { Address, toNano } from "ton";

export const JETTON_COLLECTION_DEPLOYMENT_PRICE = toNano(0.0005);
export const COLLECTION_TRANSFER_PRICE = toNano(0.01);
export const JETTON_COLLECTION_GAS_FOR_MINT = toNano(0.027);

export const JETTON_COLLECTION_OWNER_ADDRESS =
  "EQCo_K2tW9l7xd9RzvwJuwhLtvfM5irwan6pvmlxSVtyOeeY";
export const ROYALTY_ADDRESS =
  "EQCo_K2tW9l7xd9RzvwJuwhLtvfM5irwan6pvmlxSVtyOeeY";
export const ADMIN_ADDRESS = "EQCo_K2tW9l7xd9RzvwJuwhLtvfM5irwan6pvmlxSVtyOeeY";

export const JETTON_METADATA_URL =
  "https://storage.googleapis.com/zeya-assets-storage-bucket-18e9bbb/ZeyaPunksMembershipCards/Collection.json";
export const JETTON_METADATA_COMMON_URL =
  "https://storage.googleapis.com/zeya-assets-storage-bucket-18e9bbb/ZeyaPunksMembershipCards/item1.json";
///after deploy

export const JETTON_COLLECTION_ADDRESS =
  "EQDDtkeK76jxZgQe3-7IQa2XuYwB0YjFqJcTHZGOJ4jNTwGB"; //for test update after deploy
