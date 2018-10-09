import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {RestResp} from "../../comModule/RestResp";


@Injectable()
export class ExcelMgr {
  private excelDao: ExcelDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.excelDao = new ExcelDao(restProxy);
  }

  public resolveLeaguer(formData:FormData):Promise<RestResp>{
    let uriPath = "leaguer";
    return this.excelDao.resolveExcel(uriPath,formData);
  }

  public resolveProduct(formData:FormData):Promise<RestResp>{
    let uriPath = "product";
    return this.excelDao.resolveExcel(uriPath,formData);
  }

  public resolveGoods(formData:FormData):Promise<RestResp>{
    let uriPath = "goods";
    return this.excelDao.resolveExcel(uriPath,formData);
  }

}

export class ExcelDao extends AsyncRestDao<RestResp> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "excel";
    super(RestResp, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}

