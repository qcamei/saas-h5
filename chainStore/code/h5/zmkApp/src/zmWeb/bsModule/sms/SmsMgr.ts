import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {Sms} from "./apiData/Sms";
import {AppCfg} from "../../comModule/AppCfg";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";
import {AppUtils} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";
import {RandomCodeAPIForm} from "./apiData/RandomCodeAPIForm";


export class SmsMgr {

  public static getInstance():SmsMgr{
    return MgrPool.getInstance().get("SmsMgr",SmsMgr);
  }

  private smsDao: SmsDao;

  constructor() {
    this.smsDao = new SmsDao();
  }

  public sendSms(randomCodeAPIForm:RandomCodeAPIForm):Promise<RestResp>{
    return new Promise<RestResp>(resolve =>{
      this.smsDao.sendSms(randomCodeAPIForm).then(
        (restResp) =>{
          resolve(restResp);
        }
      );
    });
  }


}

export class SmsDao extends AsyncRestDao<Sms> {

  constructor() {
    // this.table = "sms";
    super(Sms, "sms");

  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

  public sendSms(randomCodeAPIForm:RandomCodeAPIForm):Promise<RestResp>{
    let uriPattern  = "{0}/sms/sendRandomCode";
    let uri = AppUtils.format(uriPattern,this.getService());
    return this.rawReq4FullPath(uri,randomCodeAPIForm);
  }

}
