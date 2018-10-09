
import {Injectable} from "@angular/core";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";
import {GoodsDetail} from "./data/GoodsDetail";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {DataVersionEnum} from "../detailDataVersion/data/DataVersionEnum";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";
import {GoodsDetailMgr} from "./GoodsDetailMgr";
@Injectable()
export class GoodsDetailCacheDataHolder extends AbsDetailDataHolder<GoodsDetail>{

  constructor(private goodsDetailMgr:GoodsDetailMgr,private detailDataVersionSynDataHolder:DetailDataVersionSynDataHolder) {
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.GoodsDetail;


  public getData(targetId: string): Promise<GoodsDetail> {
    let chainId = SessionUtil.getInstance().getChainId();
    return super.getData(targetId, chainId);
  }

  protected  async getDataVersion(chainId:string):Promise<number>{
    let detailDataVersion:DetailDataVersion = await this.detailDataVersionSynDataHolder.getData(chainId);
    let detailDataVerMap = detailDataVersion.getDetailDataVerMap();
    let ver = detailDataVerMap.get(this.versionEnum.toString());
    return new Promise<number>((resolve)=>{
      resolve(ver);
    });
  }

  protected getMgr(){
    return this.goodsDetailMgr;
  }

  public getDataVersionEnum():DataVersionEnum{
    return this.versionEnum;
  }

}
