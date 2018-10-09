import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {Store} from "./data/Store";
import {AppCfg} from "../../comModule/AppCfg";
import {Injectable} from "@angular/core";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {StoreQueryForm} from "./apiData/StoreQueryForm";
import {PageResp} from "../../comModule/PageResp";

@Injectable()
export class StoreMgr {

  private storeDao: StoreDao;

  constructor(restProxy: AsyncRestProxy) {
    this.storeDao = new StoreDao(restProxy);
  }

  public getStore(storeId: String): Promise<Store> {
    return this.storeDao.get(storeId);
  }


  //查所有已关联店铺
  public findStoreByCond(chainId: string): Promise<PageResp> {
    let reqPath = "findStoreByCond";
    let reqMap = new ReqMap();
    reqMap.add("chainId", chainId);
    return this.storeDao.getPageRespByType(reqPath, reqMap, Store);
  }

  //分页查已加入连锁的店铺列表信息
  public findChainStores(queryForm: StoreQueryForm): Promise<PageResp> {
    let reqPath = "findStoreByCond";
    let reqMap = new ReqMap();
    reqMap.add("chainId", queryForm.chainId);
    reqMap.add("storeIds", queryForm.storeIds);
    reqMap.add("name", queryForm.name);
    reqMap.add("pageNo", queryForm.pageNo.toString());
    reqMap.add("pageItemCount", queryForm.pageItemCount.toString());
    return this.storeDao.getPageRespByType(reqPath, reqMap, Store);
  }

  //分页查审核列表
  public findApplyStores(queryForm: StoreQueryForm): Promise<PageResp> {
    let reqPath = "findStoreByCond";
    let reqMap = new ReqMap();
    reqMap.add("name", queryForm.name);
    reqMap.add("storeIds", queryForm.storeIds);
    reqMap.add("pageNo", queryForm.pageNo.toString());
    reqMap.add("pageItemCount", queryForm.pageItemCount.toString());
    return this.storeDao.getPageRespByType(reqPath, reqMap, Store);
  }

}

class StoreDao extends AsyncRestDao<Store> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "store";
    super(Store, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
