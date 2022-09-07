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
import { SFTUtils } from "../sft-minter/utils";
import { SFT_MINTER_DEPLOYMENT_PRICE } from "../sft-minter/constants";

export class SFTCollectionUtils {
  public packRoyaltyParams(p: number, pDenominator: number, payTo: Address) {
    return beginCell()
      .storeUint(p, 16)
      .storeUint(pDenominator, 16) // p% = p / pDenominator: 1% = 1 / 100, 3.25% = 325 / 10000
      .storeAddress(payTo)
      .endCell();
  }

  public packSFTCollectionContent(
    collectionMetadata: string,
    commonSFTUrl: string
  ) {
    const collection_metadata = packMetadataOffchain(collectionMetadata);
    const common_sft_metadata = packMetadataOffchain(commonSFTUrl);
    return beginCell()
      .storeRef(collection_metadata)
      .storeRef(common_sft_metadata)
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
    content: { collectionMetadataUrl: string; sftMetadataCommonUrl: string },
    royaltyParams: {
      percentNumerator: number;
      percentDenominator: number;
      payTo: Address;
    },
    queryId?: BN
  ) {
    const new_content = this.packSFTCollectionContent(
      content.collectionMetadataUrl,
      content.sftMetadataCommonUrl
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

  public packMintSFTMinterMessage(
    index: BN,
    totalSupply: BN,
    sftAdmin: Address,
    sftContent: string,
    sftWalletCode: Cell,
    queryId?: BN
  ) {
    const sftMinterInitOperation = new SFTUtils().packInitCell(
      totalSupply,
      sftAdmin,
      sftContent,
      sftWalletCode
    );

    return beginCell()
      .storeUint(1, 32) // operation_id
      .storeUint(queryId ?? index, 64) //query_id
      .storeUint(index, 64)
      .storeCoins(SFT_MINTER_DEPLOYMENT_PRICE)
      .storeRef(sftMinterInitOperation)
      .endCell();
  }
}
