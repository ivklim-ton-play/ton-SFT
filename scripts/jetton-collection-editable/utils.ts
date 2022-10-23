import {
  beginCell,
  Address,
  toNano,
  beginDict,
  serializeDict,
  Cell,
} from "ton";
import { packMetadataOffchain } from "../utils/metadata-utils";
import BN from "bn.js";
import { JettonUtils } from "../jetton-minter/utils";
import { JETTON_MINTER_DEPLOYMENT_PRICE } from "../jetton-minter/constants";

export class JettonCollectionUtils {
  public packRoyaltyParams(p: number, pDenominator: number, payTo: Address) {
    return beginCell()
      .storeUint(p, 16)
      .storeUint(pDenominator, 16) // p% = p / pDenominator: 1% = 1 / 100, 3.25% = 325 / 10000
      .storeAddress(payTo)
      .endCell();
  }

  public packJettonCollectionContent(
    collectionMetadata: string,
    commonJettonUrl: string
  ) {
    const collection_metadata = packMetadataOffchain(collectionMetadata);
    const common_jetton_metadata = packMetadataOffchain(commonJettonUrl);
    return beginCell()
      .storeRef(collection_metadata)
      .storeRef(common_jetton_metadata)
      .endCell();
  }

  public packChangeOwnerMessage(newOwner: Address, queryId?: BN) {
    return beginCell()
      .storeUint(3, 32) //operation id
      .storeUint(queryId ?? 0, 64)
      .storeAddress(newOwner)
      .endCell();
  }

  public packChangeContentMessage(
    content: { collectionMetadataUrl: string; jettonMetadataCommonUrl: string },
    royaltyParams: {
      percentNumerator: number;
      percentDenominator: number;
      payTo: Address;
    },
    queryId?: BN
  ) {
    const new_content = this.packJettonCollectionContent(
      content.collectionMetadataUrl,
      content.jettonMetadataCommonUrl
    );
    const royalty_params = this.packRoyaltyParams(
      royaltyParams.percentNumerator,
      royaltyParams.percentDenominator,
      royaltyParams.payTo
    );

    return beginCell()
      .storeUint(4, 32) //operation id
      .storeUint(queryId ?? 0, 64)
      .storeRef(new_content)
      .storeRef(royalty_params)
      .endCell();
  }

  public packMintJettonMinterMessage(
    index: BN,
    totalSupply: BN,
    jettonAdmin: Address,
    jettonContent: string,
    jettonWalletCode: Cell,
    queryId?: BN
  ) {
    const jettonMinterInitOperation = new JettonUtils().packInitCell(
      totalSupply,
      jettonAdmin,
      jettonContent,
      jettonWalletCode
    );

    return beginCell()
      .storeUint(1, 32) // operation_id
      .storeUint(queryId ?? index, 64) //query_id
      .storeUint(index, 64)
      .storeCoins(JETTON_MINTER_DEPLOYMENT_PRICE)
      .storeRef(jettonMinterInitOperation)
      .endCell();
  }
}
