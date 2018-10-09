import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {StoreDataShareData} from "./StoreDataShareData";
import {AppCfg} from "../../comModule/AppCfg";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {ReqMap} from "../../comModule/AppUtils";
import {Injectable} from "@angular/core";

@Injectable()
export class StoreConfigMgr {

  private storeDataShareDAO: StoreDataShareDAO;

  constructor(private restProxy: AsyncRestProxy) {
    this.storeDataShareDAO = new StoreDataShareDAO(restProxy);
  }

  /**
   * 获取店铺配置数据
   * @param {string} chainId
   * @param {string} storeIds
   * @returns {Promise<Array<StoreDataShareData>>}
   */
  public getStoreDataShareDataList(chainId: string, storeIds: string): Promise<Array<StoreDataShareData>> {
    let findPath = "getDataShareConfigs";
    let pageItemCount = 100000;
    let pageNo = 1;
    let reqMap = new ReqMap();
    reqMap.add("chainId", chainId);
    reqMap.add("storeIds", storeIds);
    return this.storeDataShareDAO.findListWithReqParam(findPath, reqMap, pageItemCount, pageNo);
  }

}


export class StoreDataShareDAO extends AsyncRestDao<StoreDataShareData> {

  constructor(restProxy: AsyncRestProxy) {
    let table: string = "storeConfig";
    super(StoreDataShareData, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
