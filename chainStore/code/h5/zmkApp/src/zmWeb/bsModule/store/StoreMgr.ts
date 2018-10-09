import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppUtils, ReqMap} from "../../comModule/AppUtils";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";
import {JoinStoreForm} from "./apiData/JoinStoreForm";
import {Store} from "./data/Store";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";

export class StoreMgr {

  public static getInstance():StoreMgr{
    return MgrPool.getInstance().get("StoreMgr",StoreMgr);
  }

  private storeDao: StoreDao;

  constructor() {
    this.storeDao = new StoreDao();
  }

  /**
   * 根据id获取店铺信息
   * @param storeId
   * @returns {Promise<Store>}
   */
  public getStore(storeId:string): Promise<Store> {
    return this.storeDao.get(storeId);
  };

  /**
   * 获取用户相关店铺列表
   * @param cuserId
   * @returns {Promise<Array<Store>>}
   */
  public findMyStores(cuserId:string): Promise<Array<Store>> {
    let findPath = "findMyStores";
    let reqMap = new ReqMap();
    reqMap.add("cuserId", cuserId);
    return this.storeDao.findListWithReqParam(findPath, reqMap);
  }

  /**
   * 加入店铺
   * @param joinStoreForm
   * @returns {Promise<Store>}
   */
  public joinStore(joinStoreForm: JoinStoreForm): Promise<RestResp> {
    return this.storeDao.joinStore(joinStoreForm);
  }

}

export class StoreDao extends AsyncRestDao<Store> {

  constructor() {
    let table: string = "store";
    super(Store, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

  /**
   * 加入店铺
   * @param joinStoreForm
   * @returns {Promise<Store>}
   */
  public joinStore(joinStoreForm: JoinStoreForm): Promise<RestResp> {
    let uriPattern  = "{0}/store/joinStore";
    let uri = AppUtils.format(uriPattern,this.getService());
    return this.rawReq4FullPath(uri, joinStoreForm);
  }
}
