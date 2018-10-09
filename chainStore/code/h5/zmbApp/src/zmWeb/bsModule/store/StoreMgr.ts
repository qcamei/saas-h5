import {Store} from "./data/Store";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ReqMap} from "../../comModule/AppUtils";
import {UpdateStoreInfoApiData} from "./apiData/UpdateStoreInfoApiData";
import {StoreUpdateApiForm} from "./apiData/StoreUpdateApiForm";
import {StoreUpdateType} from "./apiData/StoreUpdateType";
import {AppCfg} from "../../comModule/AppCfg";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";
import {MgrPool} from "../../comModule/MgrPool";


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
  public getStore(storeId): Promise<Store> {
    return this.storeDao.get(storeId);
  };

  /**
   * 获取用户相关店铺列表
   * @param buserId
   * @param pageItemCount
   * @param pageNo
   * @param findType
   * @returns {Promise<Array<Store>>}
   */
  public getByUser(buserId, pageItemCount, pageNo, findType): Promise<Array<Store>> {
    var findPath = "findByBuser";
    let reqMap = new ReqMap();
    reqMap.add("buserId", buserId);
    reqMap.add("findType", findType);
    return this.storeDao.findListWithReqParamAndPageParam(findPath, reqMap, pageItemCount, pageNo);
  }

  /**
   * 根据店铺名称查找店铺列表
   * @param name
   * @param pageItemCount
   * @param pageNo
   * @returns {Promise<Array<Store>>}
   */
  public getByName(name, pageItemCount, pageNo): Promise<Array<Store>> {
    var findPath = "findByName";
    let reqMap = new ReqMap();
    reqMap.add("name", name);
    return this.storeDao.findListWithReqParamAndPageParam(findPath, reqMap, pageItemCount, pageNo);
  }

  /**
   * 添加店铺
   * @param storeForm
   * @returns {Promise<Store>}
   */
  public addStore(storeForm): Promise<Store> {
    return this.storeDao.add(storeForm);
  }

  /**
   * 添加店铺 返回提示信息
   * @param storeForm
   * @returns {Promise<Store>}
   */
  public addStore4Resp(storeForm): Promise<RestResp> {
    return this.storeDao.rawReq("",storeForm);
  }

  /**
   * 修改店铺信息
   * @param UpdateStoreInfoApiData
   * @returns {Promise<boolean>}
   */
  public updateStoreInfo(updateData:UpdateStoreInfoApiData): Promise<boolean> {
    let storeUpdateApiForm:StoreUpdateApiForm = new StoreUpdateApiForm();
    storeUpdateApiForm.updateType = StoreUpdateType.UpdateStoreInfo;
    storeUpdateApiForm.updateStoreInfoApiData = updateData;
    return this.storeDao.updateWithId(updateData.storeId,storeUpdateApiForm);
  }

  /**
   * 修改店铺状态
   * @param updateData
   * @returns {Promise<boolean>}
   */
  public updateStoreStatus(updateData): Promise<RestResp> {
    let storeUpdateApiForm:StoreUpdateApiForm = new StoreUpdateApiForm();
    storeUpdateApiForm.updateType = StoreUpdateType.StoreUpdateStatusData;
    storeUpdateApiForm.updateStatusData = updateData;
    return this.storeDao.update4Resp(updateData.storeId,storeUpdateApiForm);
  }

}

export class StoreDao extends AsyncRestDao<Store> {
  constructor() {
    var table = "store";
    super(Store, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
