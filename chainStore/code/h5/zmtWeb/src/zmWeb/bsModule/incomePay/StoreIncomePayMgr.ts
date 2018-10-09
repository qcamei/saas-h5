import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {IncomePayType} from "./data/IncomePayType";
import {StoreIncomePayUpdateForm} from "./apiData/StoreIncomePayUpdateForm";
import {IncomePayTypeRemoveForm} from "./apiData/IncomePayTypeRemoveForm";
import {StoreIncomePayUpdateType} from "./data/StoreIncomePayUpdateType";
import {IncomePayTypeUpdateForm} from "./apiData/IncomePayTypeUpdateForm";
import {IncomePayTypeAddForm} from "./apiData/IncomePayTypeAddForm";
import {StoreIncomePay} from "./data/StoreIncomePay";
import {SessionUtil} from "../../comModule/session/SessionUtil";


@Injectable()
export class StoreIncomePayMgr {
  private storeIncomePayDao: StoreIncomePayDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.storeIncomePayDao = new StoreIncomePayDao(restProxy);
  }

  /**
   * 根据id获取
   * @param id
   * @returns {Promise<IncomePayType>}
   */
  public getStoreIncomePay(id): Promise<StoreIncomePay> {
    return this.storeIncomePayDao.get(id);
  }

  /**
   * 修改收支类型
   * @param storeId
   * @param updateForm
   * @returns {Promise<boolean>}
   */
  public updateStoreIncomePay(updateForm:StoreIncomePayUpdateForm):Promise<boolean>{
    return this.storeIncomePayDao.updateWithId(SessionUtil.getInstance().getStoreId(),updateForm);
  }

  public deleteIncomePayType(removeForm:IncomePayTypeRemoveForm){
    let updateForm = new StoreIncomePayUpdateForm();
    updateForm.updateType = StoreIncomePayUpdateType.RemoveIncomePayType;
    updateForm.incomePayTypeRemoveForm = removeForm;
    return this.updateStoreIncomePay(updateForm);
  }

  public editIncomePayType(editForm:IncomePayTypeUpdateForm){
    let updateForm = new StoreIncomePayUpdateForm();
    updateForm.updateType = StoreIncomePayUpdateType.UpdateIncomePayType;
    updateForm.incomePayTypeUpdateForm = editForm;
    return this.updateStoreIncomePay(updateForm);
  }

  public addIncomePayType(addForm:IncomePayTypeAddForm){
    let updateForm = new StoreIncomePayUpdateForm();
    updateForm.updateType = StoreIncomePayUpdateType.AddIncomePayType;
    updateForm.incomePayTypeAddForm = addForm;
    return this.updateStoreIncomePay(updateForm);
  }

}

export class StoreIncomePayDao extends AsyncRestDao<StoreIncomePay> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "storeIncomePay";
    super(StoreIncomePay, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
