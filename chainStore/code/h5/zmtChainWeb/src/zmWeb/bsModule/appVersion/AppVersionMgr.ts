import {Injectable} from '@angular/core';
import {ReqMap} from "../../comModule/AppUtils";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppVersion} from "./apiData/AppVersion";
import {AppCfg} from "../../comModule/AppCfg";
import {Constants} from "../../views/common/Util/Constants";
import {RestResp} from "../../comModule/RestResp";


@Injectable()
export class AppVersionMgr {

  constructor(private restProxy: AsyncRestProxy) {

  }

  public findByUrl(reqUrl:string):Promise<RestResp>{
    return this.restProxy.get(reqUrl);
  }

}
