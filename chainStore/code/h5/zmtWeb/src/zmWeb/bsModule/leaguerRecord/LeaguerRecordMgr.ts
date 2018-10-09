import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {LeaguerRecord} from "./data/LeaguerRecord";
import {ReqMap} from "../../comModule/AppUtils";
import {PageResp} from "../../comModule/PageResp";
import {LeaguerRecordQueryForm} from "./apiData/LeaguerRecordQueryForm";
import {LeaguerRecordUpdateForm} from "./apiData/LeaguerRecordUpdateForm";
import {RestResp} from "../../comModule/RestResp";
import {LeaguerRecordAddForm} from "./apiData/LeaguerRecordAddForm";


@Injectable()
export class LeaguerRecordMgr {
  private leaguerRecordDao: LeaguerRecordDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.leaguerRecordDao = new LeaguerRecordDao(restProxy);
  }

  /**
   * 根据id获取详情
   * @param id
   * @returns {Promise<LeaguerRecord>}
   */
  public get(id): Promise<LeaguerRecord> {
    return this.leaguerRecordDao.get(id);
  }

  /**
   * 查询跟进记录分页
   * @param queryForm
   * @returns {Promise<Array<Order>>}
   */
  public getLeaguerRecordPageInfo(queryForm:LeaguerRecordQueryForm):Promise<PageResp>{
    let reqMap = new ReqMap().add("storeId",queryForm.storeId)
      .add("leaguerId", queryForm.leaguerId)
      .add("workFlowDataId", queryForm.workFlowDataId)
      .add("maxTime",queryForm.maxTime)
      .add("minTime",queryForm.minTime)
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    let findPath = "getLeaguerRecordPageInfo";
    return this.leaguerRecordDao.getPageRespByType(findPath,reqMap,LeaguerRecord);
  }

  /**
   * 添加会员跟进记录
   * @param addForm
   * @returns {Promise<LeaguerRecord>}
   */
  public addLeaguerRecord(addForm:LeaguerRecordAddForm):Promise<LeaguerRecord>{
    return this.leaguerRecordDao.addForm(addForm);
  }

  /**
   * 修改会员跟进记录
   * @param leaguerRecordId
   * @param updateForm
   * @returns {Promise<RestResp>}
   */
  public updateLeaguerRecord(leaguerRecordId:string,updateForm:LeaguerRecordUpdateForm):Promise<RestResp>{
    return this.leaguerRecordDao.update4Resp(leaguerRecordId,updateForm);
  }

  /**
   * 删除会员跟进记录
   * @param leaguerRecordId
   * @returns {Promise<boolean>}
   */
  public deleteLeaguerRecord(leaguerRecordId:string):Promise<boolean>{
    return this.leaguerRecordDao.delete(leaguerRecordId);
  }

}

export class LeaguerRecordDao extends AsyncRestDao<LeaguerRecord> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "leaguerRecord";
    super(LeaguerRecord, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
