import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {WxJsApiTicket} from "./data/WxJsApiTicket";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";
import {GenJssdkSignatureApiForm} from "./apiData/GenJssdkSignatureApiForm";


export class WxJsApiTicketMgr {

  public static getInstance():WxJsApiTicketMgr{
    return MgrPool.getInstance().get("WxJsApiTicketMgr",WxJsApiTicketMgr);
  }

  private wxJsApiTicketDao: WxJsApiTicketDao;

  constructor() {
    this.wxJsApiTicketDao = new WxJsApiTicketDao();
  }

  public genJssdkSignature(appId:string, pageUrl:string):Promise<WxJsApiTicket>{
    let uriPath = "genJssdkSignature";
    let form = new GenJssdkSignatureApiForm();
    form.appId = appId;
    form.pageUrl = pageUrl;
    return this.wxJsApiTicketDao.addWithUri(uriPath, form);
  }

}



class WxJsApiTicketDao extends AsyncRestDao<WxJsApiTicket> {

  constructor() {
    let table: string = "wxJsApiTicket";
    super(WxJsApiTicket, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
