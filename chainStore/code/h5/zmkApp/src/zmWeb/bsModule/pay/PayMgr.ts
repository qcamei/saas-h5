import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {BeScanApiForm} from "./apiData/BeScanApiForm";
import {PayResp} from "./data/PayResp";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";
import {MgrPool} from "../../comModule/MgrPool";
import {MiniProgramApiForm} from "./apiData/MiniProgramApiForm";
// import {MiniProgramPayResp} from "./data/MiniProgramPayResp";


export class PayMgr {

  public static getInstance():PayMgr{
    return MgrPool.getInstance().get("PayMgr",PayMgr);
  }

  private payDao: PayDao;

  constructor() {
    this.payDao = new PayDao();
  }

  /**
   * 商家被扫码，生成支付二维码
   * @param beScanApiForm
   * @returns {Promise<QrCodeResp>}
   */
  public beScan(beScanApiForm:BeScanApiForm): Promise<RestResp> {
    let uriPath = "beScan";
    return this.payDao.rawReq(uriPath,beScanApiForm);
  }

  /**
   * 微信小程序支付
   * @param form
   * @returns {Promise<RestResp>}
   */
  public miniProgramPay(form:MiniProgramApiForm): Promise<RestResp> {
    let uriPath = "miniProgramPay";
    return this.payDao.rawReq(uriPath,form);
  }

}

export class PayDao extends AsyncRestDao<PayResp> {
  constructor() {
    let table = "pay";
    super(PayResp, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
