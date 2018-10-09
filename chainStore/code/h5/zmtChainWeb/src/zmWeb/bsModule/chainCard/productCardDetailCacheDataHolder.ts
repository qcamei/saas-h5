import {Injectable} from "@angular/core";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";
import {DataVersionEnum} from "../../comModule/dataDetail/DataVersionEnum";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {ProductCardDetail} from "./data/ProductCardDetail";
import {ProductCardDetailMgr} from "./productCardDetailMgr";
@Injectable()

export class ProductCardDetailCacheDataHolder extends AbsDetailDataHolder<ProductCardDetail>{

  constructor(private productCardDetailMgr:ProductCardDetailMgr,private detailDataVersionSynDataHolder:DetailDataVersionSynDataHolder) {
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.ProductCardDetail;


  public getData(targetId: string): Promise<ProductCardDetail> {
    let chainId = SessionUtil.getInstance().getChainId();
    return super.getData(targetId, chainId);
  }

  protected  async getDataVersion(storeId:string):Promise<number>{
    let detailDataVersion:DetailDataVersion = await this.detailDataVersionSynDataHolder.getData(storeId);
    let detailDataVerMap = detailDataVersion.getDetailDataVerMap();
    let ver = detailDataVerMap.get(this.versionEnum.toString());
    return new Promise<number>((resolve)=>{
      resolve(ver);
    });
  }

  protected getMgr(){
    return this.productCardDetailMgr;
  }

  public getDataVersionEnum():DataVersionEnum{
    return this.versionEnum;
  }

}
