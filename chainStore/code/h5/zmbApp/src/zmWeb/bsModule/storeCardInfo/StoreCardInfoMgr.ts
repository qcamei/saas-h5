import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {StoreCardInfo} from "./data/StoreCardInfo";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";


@Injectable()
export class StoreCardInfoMgr {

  public static getInstance():StoreCardInfoMgr{
    return MgrPool.getInstance().get("StoreCardInfoMgr",StoreCardInfoMgr);
  }

  private storeCardInfoDao: StoreCardInfoDao;

  constructor() {
    this.storeCardInfoDao = new StoreCardInfoDao();
  }

  public getStoreCardInfo(storeId:string):Promise<StoreCardInfo> {
    return this.storeCardInfoDao.get(storeId);
  }



}

export class StoreCardInfoDao extends AsyncRestDao<StoreCardInfo> {
  constructor() {
    var table = "storeCardInfo";
    super(StoreCardInfo, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
