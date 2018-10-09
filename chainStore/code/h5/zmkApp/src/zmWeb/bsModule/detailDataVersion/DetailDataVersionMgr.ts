import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {DetailDataVersion} from "./data/DetailDataVersion";
import {MgrPool} from "../../comModule/MgrPool";


@Injectable()
export class DetailDataVersionMgr {

  public static getInstance():DetailDataVersionMgr{
    return MgrPool.getInstance().get("DetailDataVersionMgr",DetailDataVersionMgr);
  }

  private detailDataVersionDao: DetailDataVersionDao;

  constructor() {
    this.detailDataVersionDao = new DetailDataVersionDao();
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
  constructor() {
    var table = "detailDataVersion";
    super(DetailDataVersion, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
