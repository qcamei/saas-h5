import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {SessionUtil} from "../../comModule/SessionUtil";
import {Injectable} from "@angular/core";
import {StoreMenu} from "./data/StoreMenu";
import {ReqMap} from "../../comModule/AppUtils";

@Injectable()
export class StoreMenuMgr {

  private storeMenuDao: StoreMenuDao;

  constructor(restProxy: AsyncRestProxy) {
    this.storeMenuDao = new StoreMenuDao(restProxy);
  }

  public getStoreMenu(): Promise<StoreMenu> {
    let path="getStoreMenu";
    return new Promise<StoreMenu>(resolve => {
      this.storeMenuDao.findWithUri(path).then(
        function (storeMenu) {
          resolve(storeMenu);
        }
      );
    });
  }

}

class StoreMenuDao extends AsyncRestDao<StoreMenu> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "storeMenu";
    super(StoreMenu, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}
