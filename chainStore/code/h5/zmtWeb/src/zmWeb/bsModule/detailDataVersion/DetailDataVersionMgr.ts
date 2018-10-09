import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {DetailDataVersion} from "./data/DetailDataVersion";


@Injectable()
export class DetailDataVersionMgr {
  private detailDataVersionDao: DetailDataVersionDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.detailDataVersionDao = new DetailDataVersionDao(restProxy);
  }

  /**
   * 根据id获取详情
   * @param id
   * @returns {Promise<DetailDataVersion>}
   */
  public get(storeId): Promise<DetailDataVersion> {
    return this.detailDataVersionDao.get(storeId);
  }

}

export class DetailDataVersionDao extends AsyncRestDao<DetailDataVersion> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "detailDataVersion";
    super(DetailDataVersion, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
