import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {PageResp} from "../../comModule/PageResp";
import {AppUtils, ReqMap} from "../../comModule/AppUtils";
import {DaySnapshotQueryForm} from "./apiData/DaySnapshotQueryForm";
import {DaySnapshot} from "./data/DaySnapshot";
import {PreDaySnapshotData} from "./data/PreDaySnapshotData";
import {Charge} from "../charge/data/Charge";
import {DaySnapshotAddForm} from "./apiData/DaySnapshotAddForm";
import {AppCfg} from "../../comModule/AppCfg";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {MsgUnReadCount} from "../buserMessage/data/MsgUnReadCount";
import {RestResp} from "../../comModule/RestResp";
import {ChainGoods} from "../chainGoods/data/ChainGoods";

@Injectable()
export class DaySnapshotClientMgr {
  private daySnapshotDAO: DaySnapshotDAO;
  constructor(private restProxy: AsyncRestProxy) {
    this.daySnapshotDAO = new DaySnapshotDAO(restProxy);
  }

  /**
   * 查询日结
   * @param id
   * @returns {Promise<DaySnapshot>}
   */
  public get(id:number):Promise<DaySnapshot>{
    return this.daySnapshotDAO.get(id);
  }

  /**
   * 查询日结分页
   * @param {DaySnapshotQueryForm} queryForm
   * @returns {Promise<PageResp>}
   */
  public findPageInfo(queryForm: DaySnapshotQueryForm): Promise<PageResp> {
    let reqMap = new ReqMap().add("storeId", queryForm.storeId)
      .add("name",queryForm.name)
      .add("maxTime", queryForm.maxTime)
      .add("minTime", queryForm.minTime)
      .add("pageItemCount", queryForm.pageItemCount.toString())
      .add("pageNo", queryForm.pageNo.toString());
    let findPath = "findPage";
    return this.daySnapshotDAO.getPageRespByType(findPath, reqMap, DaySnapshot);
  }

  /**
   * get PreDaySnapshotData
   * @param {DaySnapshotQueryForm} queryForm
   * @returns {Promise<PageResp>}
   */
  public findPreDayInfo(queryForm: DaySnapshotQueryForm): Promise<PreDaySnapshotData> {
    let reqMap = new ReqMap().add("storeId", queryForm.storeId)
      .add("maxTime", queryForm.maxTime)
      .add("minTime", queryForm.minTime)
      // .add("pageItemCount", queryForm.pageItemCount.toString())
      // .add("pageNo", queryForm.pageNo.toString());
    let findPath = "getPreDaySnapshotData";

    return new Promise<PreDaySnapshotData>(resolve=>{
      this.daySnapshotDAO.getWithReqParam(findPath,reqMap).then((restResp:RestResp)=>{
        let targetTmp:PreDaySnapshotData = null;
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          targetTmp = new PreDaySnapshotData();
          AppUtils.copyJson(targetTmp,restResp.tJson);
        }
        resolve(targetTmp);
      })
    })
  }

  /**
   * 添加日结
   * @param addForm
   * @returns {Promise<DaySnapshot>}
   */
  public addDaySnapshot(addForm:DaySnapshotAddForm):Promise<DaySnapshot>{
    return this.daySnapshotDAO.addForm(addForm);
  }
}

export class DaySnapshotDAO extends AsyncRestDao<DaySnapshot>{

  constructor(restProxy:AsyncRestProxy){
    let table = "daySnapshot";
    super(DaySnapshot,restProxy,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
