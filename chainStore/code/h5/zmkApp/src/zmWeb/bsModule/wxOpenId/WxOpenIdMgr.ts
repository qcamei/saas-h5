import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {WxOpenId} from "./data/WxOpenId";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";
import {GenOpenIdApiForm} from "./apiData/GenOpenIdApiForm";


export class WxOpenIdMgr {

  public static getInstance():WxOpenIdMgr{
    return MgrPool.getInstance().get("WxOpenIdMgr",WxOpenIdMgr);
  }

  private wxOpenIdDao: WxOpenIdDao;

  constructor() {
    this.wxOpenIdDao = new WxOpenIdDao();
  }

  public genOpenId(appId:string, jsCode:string):Promise<WxOpenId>{
    let uriPath = "genOpenId";
    let form = new GenOpenIdApiForm();
    form.appId = appId;
    form.jsCode = jsCode;
    return this.wxOpenIdDao.addWithUri(uriPath, form);
  }

}



class WxOpenIdDao extends AsyncRestDao<WxOpenId> {

  constructor() {
    let table: string = "wxOpenId";
    super(WxOpenId, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
