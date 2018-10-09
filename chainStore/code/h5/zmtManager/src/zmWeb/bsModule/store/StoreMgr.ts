import {Injectable} from "@angular/core";
import {SessionUtil} from "../../comModule/SessionUtil";
import {Store} from "./apiData/Store";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ReqMap} from "../../comModule/AppUtils";
import {UpdateStoreInfoApiData} from "./apiData/UpdateStoreInfoApiData";
import {StoreUpdateApiForm} from "./apiData/StoreUpdateApiForm";
import {StoreUpdateType} from "./apiData/StoreUpdateType";


@Injectable()
export class StoreMgr {
  private storeDao: StoreDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.storeDao = new StoreDao(restProxy);
  }

  /**
   * 根据id获取店铺信息
   * @param storeId
   * @returns {Promise<Store>}
   */
  public getStore(storeId): Promise<Store> {
    return new Promise<Store>(resolve => {
      this.storeDao.get(storeId).then(
        (store) => {
          resolve(store);
        });
    });
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
    return new Promise<Array<Store>>(resolve => {
      this.storeDao.findListWithReqParam(findPath, reqMap, pageItemCount, pageNo).then(
        (storeList) => {
          resolve(storeList);
        });
    });
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
    return new Promise<Array<Store>>(resolve => {
      this.storeDao.findListWithReqParam(findPath, reqMap, pageItemCount, pageNo).then(
        (storeList) => {
          resolve(storeList);
        });
    });
  }

  /**
   * 添加店铺
   * @param storeForm
   * @returns {Promise<Store>}
   */
  public addStore(storeForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.storeDao.add(storeForm).then(
        (success) => {
          resolve(success);
        });
    });
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
    return new Promise<boolean>(resolve => {
      this.storeDao.updateWithId(updateData.storeId,storeUpdateApiForm).then(
        (success) => {
          resolve(success);
        });
    });
  }

  /**
   * 修改店铺状态
   * @param updateData
   * @returns {Promise<boolean>}
   */
  public updateStoreStatus(updateData): Promise<boolean> {
    let storeUpdateApiForm:StoreUpdateApiForm = new StoreUpdateApiForm();
    storeUpdateApiForm.updateType = StoreUpdateType.StoreUpdateStatusData;
    storeUpdateApiForm.updateStatusData = updateData;
    return new Promise<boolean>(resolve => {
      this.storeDao.updateWithId(updateData.storeId,storeUpdateApiForm).then(
        (success) => {
          resolve(success);
        });
    });
  }


}

export class StoreDao extends AsyncRestDao<Store> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "store";
    super(Store, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}
