import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {BonusRecord} from "./data/BonusRecord";
import {BonusRecordForm} from "./apiData/BonusRecordForm";
import {BonusRecordQueryForm} from "./apiData/BonusRecordQueryForm";
import {ReqMap} from "../../comModule/AppUtils";
import {AppCfg} from "../../comModule/AppCfg";
import {PageResp} from "../../comModule/PageResp";
import {BonusRecordGroup} from "./data/BonusRecordGroup";
import {BonusRecordListForm} from "./apiData/BonusRecordListForm";


@Injectable()
export class BonusRecordMgr {
  private bonusRecordDao: BonusRecordDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.bonusRecordDao = new BonusRecordDao(restProxy);
  }

  /**
   * 根据id获取详情
   * @param id
   * @returns {Promise<BonusRecord>}
   */
  public get(id): Promise<BonusRecord> {
    return this.bonusRecordDao.get(id);
  };

  /**
   * 添加修改提成
   * @param addForm
   * @returns {Promise<boolean>}
   */
  public add(addForm:BonusRecordForm): Promise<boolean> {
    let uriPath = "";
    return new Promise<boolean>(resolve => {
      this.bonusRecordDao.rawReq(uriPath,addForm).then(
        (restResp) => {
          resolve(restResp.code == 200);
        });
    });
  };

  /**
   * 添加、修改提成列表
   * @param saveForm
   * @returns {Promise<boolean>}
   */
  public saveList(saveForm:BonusRecordListForm): Promise<boolean> {
    let uriPath = "saveList";
    return new Promise<boolean>(resolve => {
      this.bonusRecordDao.rawReq(uriPath,saveForm).then(
        (restResp) => {
          resolve(restResp.code == 200);
        });
    });
  }

  /**
   * 查询提成列表
   * @param queryForm
   * @returns {Promise<Array<BonusRecord>>}
   */
  public findBonusRecordList(queryForm:BonusRecordQueryForm):Promise<Array<BonusRecord>>{
    let findPath = "findBonusRecordList";
    let reqMap = new ReqMap()
      .add("storeId",queryForm.storeId)
      .add("orderId",queryForm.orderId)
      .add("buyId",queryForm.buyId)
      .add("status",queryForm.statusSet.toString())
      .add("maxTime",queryForm.maxTime)
      .add("minTime",queryForm.minTime);
    return this.bonusRecordDao.findListWithReqParam(findPath,reqMap,queryForm.pageItemCount,queryForm.pageNo);
  }

  /**
   * 查询提成分页列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public findBonusRecordPageInfo(queryForm:BonusRecordQueryForm):Promise<PageResp>{
    let findPath = "findBonusRecordPageInfo";
    let reqMap = new ReqMap()
      .add("storeId",queryForm.storeId)
      .add("orderId",queryForm.orderId)
      .add("buserName",queryForm.buserName)
      .add("status",queryForm.statusSet.toString())
      .add("maxTime",queryForm.maxTime)
      .add("minTime",queryForm.minTime)
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    return this.bonusRecordDao.getPageRespByType(findPath,reqMap,BonusRecord);
  }

  /**
   * 查询提成组装group分页列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public findBonusRecordGroupPageInfo(queryForm:BonusRecordQueryForm):Promise<PageResp>{
    let findPath = "findBonusRecordGroupPageInfo";
    let reqMap = new ReqMap()
      .add("storeId",queryForm.storeId)
      .add("orderId",queryForm.orderId)
      .add("buserName",queryForm.buserName)
      .add("status",queryForm.statusSet.toString())
      .add("maxTime",queryForm.maxTime)
      .add("minTime",queryForm.minTime)
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    return this.bonusRecordDao.getPageRespByType(findPath,reqMap,BonusRecordGroup);
  }

}

export class BonusRecordDao extends AsyncRestDao<BonusRecord> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "bonusRecord";
    super(BonusRecord, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
