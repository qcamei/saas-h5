import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {Arrearage} from "./data/Arrearage";
import {ReqMap} from "../../comModule/AppUtils";
import {ArrearageQueryForm} from "./apiData/ArrearageQueryForm";
import {PageResp} from "../../comModule/PageResp";
import {ArrearageGroup} from "./data/ArrearageGroup";
import {ArrearageUpdateApiForm} from "./apiData/ArrearageUpdateApiForm";
import {ArrearageUpdateType} from "./apiData/ArrearageUpdateType";
import {ArrearageAddPaymentHistoryApiForm} from "./apiData/ArrearageAddPaymentHistoryApiForm";
import {AppCfg} from "../../comModule/AppCfg";

@Injectable()
export class ArrearageMgr{

  private arrearageDao:ArrearageDao;

  constructor(private restProxy:AsyncRestProxy){
    this.arrearageDao = new ArrearageDao(restProxy);
  }

  /**
   * 根据id获取详情
   * @param id
   * @returns {Promise<Arrearage>}
   */
  public get(id): Promise<Arrearage> {
    return this.arrearageDao.get(id);
  };

  /**
   * 查询欠款会员分页
   * @param queryForm
   * @returns {Promise<Array<Order>>}
   */
  public getArrearageGroupPageInfo(queryForm:ArrearageQueryForm):Promise<PageResp>{
    var reqMap =new ReqMap().add("storeId",queryForm.storeId)
      .add("leaguerId", queryForm.leaguerId)
      .add("leaguerNameOrPhone", queryForm.leaguerNameOrPhone)
      .add("status", queryForm.statusSet.toString())
      .add("maxTime",queryForm.maxTime)
      .add("minTime",queryForm.minTime)
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    var findPath = "getArrearageGroupPageInfo";
    return this.arrearageDao.getPageRespByType(findPath,reqMap,ArrearageGroup);
  };

  /**
   * 查询欠款会员详情分页
   * @param queryForm
   * @returns {Promise<Array<Order>>}
   */
  public getArrearagePageInfo(queryForm:ArrearageQueryForm):Promise<PageResp>{
    var reqMap =new ReqMap().add("storeId",queryForm.storeId)
      .add("leaguerId", queryForm.leaguerId)
      .add("leaguerNameOrPhone", queryForm.leaguerNameOrPhone)
      .add("status", queryForm.statusSet.toString())
      .add("maxTime",queryForm.maxTime)
      .add("minTime",queryForm.minTime)
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    var findPath = "getArrearagePageInfo";
    return this.arrearageDao.getPageRespByType(findPath,reqMap,Arrearage);
  };

  /**
   * 还款
   * @returns {Promise<boolean>}
   */
  public addPayRecord(storeId,arrearageId,arrearageAddPaymentHistoryApiForm:ArrearageAddPaymentHistoryApiForm){
    let updateForm = new ArrearageUpdateApiForm();
    updateForm.updateType = ArrearageUpdateType.AddPaymentHistory;
    updateForm.storeId = storeId;
    updateForm.addPaymentHistoryApiForm = arrearageAddPaymentHistoryApiForm;
    return this.arrearageDao.updateWithId(arrearageId,updateForm);
  }

}

export class ArrearageDao extends AsyncRestDao<Arrearage>{

  constructor(restProxy: AsyncRestProxy) {
    var table = "arrearage";
    super(Arrearage, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
