import {Injectable} from "@angular/core";
import {SessionUtil} from "../../comModule/SessionUtil";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {Sms} from "./apiData/Sms";
import {RestResp} from "../../comModule/RestResp";


@Injectable()
export class SmsMgr {
  private smsDao: SmsDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.smsDao = new SmsDao(restProxy);
  }

  public sendSms(randomCodeAPIForm):Promise<RestResp>{
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
  constructor(restProxy: AsyncRestProxy) {
    var table = "sms";
    super(Sms, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }

}
