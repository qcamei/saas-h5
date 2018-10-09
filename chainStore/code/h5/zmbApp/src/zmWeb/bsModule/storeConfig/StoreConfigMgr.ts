import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {StoreConfig} from "./data/StoreConfig";
import {MgrPool} from "../../comModule/MgrPool";


export class StoreConfigMgr {

  public static getInstance():StoreConfigMgr{
    return MgrPool.getInstance().get("StoreConfigMgr",StoreConfigMgr);
  }

  private storeConfigDao: StoreConfigDao;

  constructor() {
    this.storeConfigDao = new StoreConfigDao();
  }

  /**
   * 根据storeId获取详情
   * @param storeId
   * @returns {Promise<StoreConfig>}
   */
  public get(storeId): Promise<StoreConfig> {
    return this.storeConfigDao.get(storeId);
  }

}

export class StoreConfigDao extends AsyncRestDao<StoreConfig> {
  constructor() {
    let table = "storeConfig";
    super(StoreConfig, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
