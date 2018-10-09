
import {AppUtils, ReqMap} from "../../comModule/AppUtils";
import {PageResp} from "../../comModule/PageResp";
import {IncomePayQueryForm} from "./apiData/IncomePayQueryForm";
import {IncomePay} from "./data/IncomePay";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AppCfg} from "../../comModule/AppCfg";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {RestResp} from "../../comModule/RestResp";
import {IncomePayUpdateApiForm} from "./apiData/IncomePayUpdateApiForm";
import {IncomePayAddForm} from "./apiData/IncomePayAddForm";
import {Injectable} from "@angular/core";
import {IncomePayTypeUpdateForm} from "./apiData/IncomePayTypeUpdateForm";
import {StoreIncomePayUpdateType} from "./data/StoreIncomePayUpdateType";
import {StoreIncomePayUpdateForm} from "./apiData/StoreIncomePayUpdateForm";
import {IncomePayUpdateInfoForm} from "./apiData/IncomePayUpdateInfoForm";
import {IncomePayUpdateType} from "./apiData/IncomePayUpdateType";

@Injectable()
export class IncomePayMgr {
  private incomePayDao: IncomePayDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.incomePayDao = new IncomePayDao(restProxy);
  }

  /**
   * 根据id获取详情
   * @param id
   * @returns {Promise<Store>}
   */
  public get(storeId,id): Promise<IncomePay> {
    return this.incomePayDao.get(`${storeId}/${id}`);
  }

  /**
   * 查询收支分页
   * @param queryForm
   * @returns {Promise<Array<IncomePay>>}
   */
  public findIncomePayPageInfo(queryForm:IncomePayQueryForm):Promise<PageResp>{
    let reqMap = new ReqMap().add("storeId",queryForm.storeId)
      .add("category", queryForm.category.toString())
      .add("maxIncomePayTime",queryForm.maxIncomePayTime)
      .add("minIncomePayTime",queryForm.minIncomePayTime)
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("typeId",queryForm.typeId)
      .add("pageNo",queryForm.pageNo.toString());
    if (queryForm.minMoney) {
      reqMap.add("minMoney", queryForm.minMoney.toString());
    }
    if (queryForm.maxMoney){
      reqMap.add("maxMoney",queryForm.maxMoney.toString());
    }
    if (queryForm.buserId){
      reqMap.add("buserId",queryForm.buserId.toString())
    }
    let findPath = "findIncomePayPageInfo";
    return this.incomePayDao.getPageRespByType(findPath,reqMap,IncomePay);
  }

  /**
   * 删除收支
   * @param incomePayId
   * @returns {Promise<boolean>}
   */
  public deleteIncomePay(storeId: string,incomePayId:string):Promise<boolean>{
    return this.incomePayDao.delete(`${storeId}/${incomePayId}`);
  }

  /**
   * 修改收支
   * @param incomePayId
   * @param updateForm
   * @returns {Promise<RestResp>}
   */
  public updateIncomePay(storeId:string,incomePayId:string,updateForm:IncomePayUpdateApiForm):Promise<RestResp>{
    return this.incomePayDao.update4Resp(`${storeId}/${incomePayId}`,updateForm);
  }

  public updateIncomePayInfo(storeId:string,updateInfoForm:IncomePayUpdateInfoForm){
    let updateForm = new IncomePayUpdateApiForm();
    updateForm.updateType = IncomePayUpdateType.UpdateInfo;
    updateForm.incomePayUpdateInfoForm = updateInfoForm;
    updateForm.storeId = storeId;
    return this.updateIncomePay(updateForm.storeId,updateInfoForm.id,updateForm);
  }

  /**
   * 添加收支
   * @param addForm
   * @returns {Promise<IncomePay>}
   */
  public addIncomePay(addForm:IncomePayAddForm):Promise<IncomePay>{
    return this.incomePayDao.addForm(addForm);
  }
}

export class IncomePayDao extends AsyncRestDao<IncomePay> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "incomePay";
    super(IncomePay, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}


