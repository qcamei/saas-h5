import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {RestResp} from "../../comModule/RestResp";
import {AppUtils} from "../../comModule/AppUtils";
import {BillRecord} from "./data/BillRecord";


@Injectable()
export class BillRecordMgr {
  private billRecordDao: BillRecordDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.billRecordDao = new BillRecordDao(restProxy);
  }

  public get(id):Promise<BillRecord>{
    return this.billRecordDao.get(id);
  }

}

export class BillRecordDao extends AsyncRestDao<BillRecord> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "billRecord";
    super(BillRecord, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
