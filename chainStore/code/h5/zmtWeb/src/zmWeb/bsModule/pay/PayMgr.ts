import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {BeScanApiForm} from "./apiData/BeScanApiForm";
import {ScanApiForm} from "./apiData/ScanApiForm";
import {RestResp} from "../../comModule/RestResp";
import {AppUtils} from "../../comModule/AppUtils";
import {PayResp} from "./data/PayResp";


@Injectable()
export class PayMgr {
  private payDao: PayDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.payDao = new PayDao(restProxy);
  }

  /**
   * 商家被扫码，生成支付二维码
   * @param beScanApiForm
   * @returns {Promise<QrCodeResp>}
   */
  public beScan(beScanApiForm:BeScanApiForm): Promise<RestResp> {
    let uriPath = "beScan";
    return this.payDao.rawReq(uriPath,beScanApiForm);
    // return new Promise<PayResp>(resolve=>{
    //   this.payDao.rawReq(uriPath,beScanApiForm).then((restResp:RestResp)=>{
    //     let targetTmp: PayResp = null;
    //     if (restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
    //       targetTmp = new PayResp();
    //       AppUtils.copyJson(targetTmp, restResp.tJson);
    //     }
    //     resolve(targetTmp);
    //   })
    // })
  }

  /**
   * 商家主动扫码
   * @param scanApiForm
   * @returns {Promise<boolean>}
   */
  public scan(scanApiForm:ScanApiForm): Promise<RestResp> {
    let uriPath = "scan";
    return this.payDao.rawReq(uriPath,scanApiForm);
    // return new Promise<PayResp>(resolve=>{
    //   this.payDao.rawReq(uriPath,scanApiForm).then((restResp:RestResp)=>{
    //     let targetTmp: PayResp = null;
    //     if (restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
    //       targetTmp = new PayResp();
    //       AppUtils.copyJson(targetTmp, restResp.tJson);
    //     }
    //     resolve(targetTmp);
    //   })
    // })
  }

}

export class PayDao extends AsyncRestDao<PayResp> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "pay";
    super(PayResp, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
