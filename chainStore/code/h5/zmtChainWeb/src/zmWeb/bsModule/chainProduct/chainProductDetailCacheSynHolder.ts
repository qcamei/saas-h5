

import {Injectable} from "@angular/core";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";
import {ProductDetail} from "./data/ProductDetail";
import {DataVersionEnum} from "../../comModule/dataDetail/DataVersionEnum";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";
import {ChainProductDetailMgr} from "./chainProductDetailMgr";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";

@Injectable()
export class ChainProductDetailCacheSynHolder extends AbsDetailDataHolder<ProductDetail>{

  constructor(private chainProductDetailMgr:ChainProductDetailMgr,
              private detailDataVersionSynHolder:DetailDataVersionSynDataHolder){
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.ProductDetail;

  public getData(targetId: string): Promise<ProductDetail> {
    let chainId = SessionUtil.getInstance().getChainId();
    return super.getData(targetId, chainId);
  }


  protected async getDataVersion(chainId:string):Promise<number>{
    let detailDataVersion:DetailDataVersion = await this.detailDataVersionSynHolder.getData(chainId);
    let detailDataVerMap = detailDataVersion.getDetailDataVerMap();
    let ver = detailDataVerMap.get(this.versionEnum.toString());
    return new Promise<number>((resolve)=>{
      resolve(ver);
    });

  };

  //传入具体域的RestDao
  protected getMgr(){
    return this.chainProductDetailMgr;
  };

  //获取详情数据的枚举
  public getDataVersionEnum():DataVersionEnum{
    return this.versionEnum;
  };
}
