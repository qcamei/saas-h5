import {Injectable} from "@angular/core";
import {ProductDetail} from "./data/ProductDetail";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";
import {DataVersionEnum} from "../../comModule/dataDetail/DataVersionEnum";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {ProductDetailMgr} from "./ProductDetailMgr";

@Injectable()
export class ProductDetailCacheDataHolder extends AbsDetailDataHolder<ProductDetail>{

  constructor(private productDetailMgr:ProductDetailMgr,
              private detailDataVersionSynHolder:DetailDataVersionSynDataHolder){
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.ProductDetail;

  public getData(targetId: string): Promise<ProductDetail> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return super.getData(targetId, storeId);
  }


  protected async getDataVersion(storeId:string):Promise<number>{
    let detailDataVersion:DetailDataVersion = await this.detailDataVersionSynHolder.getData(storeId);
    let detailDataVerMap = detailDataVersion.getDetailDataVerMap();
    let ver = detailDataVerMap.get(this.versionEnum.toString());
    return new Promise<number>((resolve)=>{
      resolve(ver);
    });

  };

  //传入具体域的RestDao
  protected getMgr(){
    return this.productDetailMgr;
  };

  //获取详情数据的枚举
  public getDataVersionEnum():DataVersionEnum{
     return this.versionEnum;
  };
}
