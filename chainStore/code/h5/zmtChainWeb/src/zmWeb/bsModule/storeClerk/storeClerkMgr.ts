import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {StoreClerk} from "./data/StoreClerk";
import {StoreClerkUpdateForm} from "./apiData/StoreClerkUpdateForm";
import {ApplyClerkInfoData} from "./apiData/ApplyClerkInfoData";
import {StoreClerkUpdateType} from "./apiData/StoreClerkUpdateType";
@Injectable()

export class StoreClerkMgr {

  private storeClerkDao: StoreClerkDao;

  constructor(restProxy: AsyncRestProxy) {
    this.storeClerkDao = new StoreClerkDao(restProxy);
  }

  public getStoreClerk(storeId: string): Promise<StoreClerk> {
    return this.storeClerkDao.get(storeId);
  }

  public applyClerkInfo(storeId:string,applyClerkInfoData:ApplyClerkInfoData){
      let updateForm:StoreClerkUpdateForm = new StoreClerkUpdateForm();
      updateForm.updateType = StoreClerkUpdateType.ApplyClerk;
      updateForm.applyClerkInfoData = applyClerkInfoData;
      return this.updateStoreClerk(storeId,updateForm);

  }

  public updateStoreClerk(storeId:string,updateForm:StoreClerkUpdateForm){
    return this.storeClerkDao.updateWithId(storeId,updateForm);
  }

}

class StoreClerkDao extends AsyncRestDao<StoreClerk> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "storeClerkInfo";
    super(StoreClerk, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
