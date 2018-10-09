import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {Injectable} from "@angular/core";
import {BossPayInfo} from "./data/BossPayInfo";
import {BossPayInfoAddApiForm} from "./apiData/BossPayInfoAddApiForm";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {RestResp} from "../../comModule/RestResp";
import {ReqMap} from "../../comModule/AppUtils";
import {AppCfg} from "../../comModule/AppCfg";

@Injectable()
export class BossPayInfoMgr {
  private bossPayInfoDao: BossPayInfoDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.bossPayInfoDao = new BossPayInfoDao(restProxy);
  }

  public get(id:string):Promise<BossPayInfo> {
    return this.bossPayInfoDao.get(id);
  }

  public addAndReturnRestResp(dataForm:BossPayInfoAddApiForm):Promise<RestResp>{
    return this.bossPayInfoDao.addAndReturnRestResp(dataForm);
  }


  public updateAndReturnRestResp(id:string, updateForm:BossPayInfoAddApiForm):Promise<RestResp>{
    return this.bossPayInfoDao.updateAndReturnRestResp(id,updateForm);
  }

  public findByStoreId(storeId: string):Promise<BossPayInfo>{
    let uriPath = "findByStoreId";
    let reqMap = new ReqMap().add("storeId", storeId);
    return this.bossPayInfoDao.findOneWithReqParam(uriPath, reqMap);
  }

  public async uploadCertFile(formData:FormData):Promise<RestResp>{
    let uriPath = "cert";
    return await this.bossPayInfoDao.upLoadFile(uriPath,formData);
  }
}

export class BossPayInfoDao extends AsyncRestDao<BossPayInfo> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "bossPayInfo";
    super(BossPayInfo, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
