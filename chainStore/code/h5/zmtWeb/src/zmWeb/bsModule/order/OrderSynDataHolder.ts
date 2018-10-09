
import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {Order} from "./data/Order";
import {OrderMgr} from "./OrderMgr";
import {AppUtils} from "../../comModule/AppUtils";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";
import {DataVersionEnum} from "../../comModule/dataDetail/DataVersionEnum";



@Injectable()
export class OrderSynDataHolder extends AbsDetailDataHolder<Order>{

  constructor(private orderMgr:OrderMgr,private detailDataVersionSynHolder:DetailDataVersionSynDataHolder) {
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.Order;

  public getData(targetId: string): Promise<Order> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return super.getData(targetId, storeId);
  }

  protected async getDataVersion(storeId: string): Promise<number> {
    let detailDataVersion:DetailDataVersion = await this.detailDataVersionSynHolder.getData(storeId);
    let detailDataVerMap = detailDataVersion.getDetailDataVerMap();
    return new Promise<number>(resolve=>{
      resolve(detailDataVerMap.get(this.versionEnum.toString()));
    });
  }

  protected getMgr() {
    return this.orderMgr;
  }

  public getDataVersionEnum(): DataVersionEnum {
    return this.versionEnum;
  }

}
