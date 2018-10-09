import {Injectable} from '@angular/core';
import {ReqMap} from "../../comModule/AppUtils";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppVersion} from "./apiData/AppVersion";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class AppVersionMgr {

  private appVersionDao: AppVersionDao;

  constructor(restProxy: AsyncRestProxy) {
    this.appVersionDao = new AppVersionDao(restProxy);
  }

  public findByName(appName: string):Promise<AppVersion>{
    let uriPath = "findByName";
    let reqMap = new ReqMap().add("appName", appName);
    return this.appVersionDao.findOneWithReqParam(uriPath, reqMap);
  }

}

class AppVersionDao extends AsyncRestDao<AppVersion> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "appVersionUnAuth";
    super(AppVersion, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}


