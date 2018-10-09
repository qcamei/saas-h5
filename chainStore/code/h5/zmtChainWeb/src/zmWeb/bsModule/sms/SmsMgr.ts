import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {RestResp} from "../../comModule/RestResp";
import {AppCfg} from "../../comModule/AppCfg";
import {Sms} from "./data/Sms";


@Injectable()
export class SmsMgr {
  private smsDao: SmsDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.smsDao = new SmsDao(restProxy);
  }

  public sendSms(randomCodeAPIForm):Promise<RestResp>{
    return this.smsDao.sendSms(randomCodeAPIForm);
  }


}

export class SmsDao extends AsyncRestDao<Sms> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "sms";
    super(Sms, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
