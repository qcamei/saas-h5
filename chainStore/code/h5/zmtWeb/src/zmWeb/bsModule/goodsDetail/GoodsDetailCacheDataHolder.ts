import {Injectable} from "@angular/core";
import {GoodsDetail} from "./data/GoodsDetail";
import {GoodsDetailMgr} from "./GoodsDetailMgr";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";
import {DataVersionEnum} from "../../comModule/dataDetail/DataVersionEnum";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";
import {SessionUtil} from "../../comModule/session/SessionUtil";
@Injectable()
export class GoodsDetailCacheDataHolder extends AbsDetailDataHolder<GoodsDetail>{

  constructor(private goodsDetailMgr:GoodsDetailMgr,private detailDataVersionSynDataHolder:DetailDataVersionSynDataHolder) {
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.GoodsDetail;


  public getData(targetId: string): Promise<GoodsDetail> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return super.getData(targetId, storeId);
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
    return this.goodsDetailMgr;
  }

  public getDataVersionEnum():DataVersionEnum{
    return this.versionEnum;
  }

}
