import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {StoreBeauticianInfo} from "./data/StoreBeauticianInfo";
import {StoreBeauticianInfoUpdateForm} from "./apiData/StoreBeauticianInfoUpdateForm";
import {AddBeauticianInfoData} from "./apiData/AddBeauticianInfoData";
import {StoreBeauticianInfoUpdateType} from "./apiData/StoreBeauticianInfoUpdateType";
import {RemoveBeauticianInfoData} from "./apiData/RemoveBeauticianInfoData";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class StoreBeauticianInfoMgr {
  private storeBeauticianInfoDao: StoreBeauticianInfoDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.storeBeauticianInfoDao = new StoreBeauticianInfoDao(restProxy);
  }

  /**
   * 根据id获取详情
   * @param storeId
   * @returns {Promise<StoreBeauticianInfo>}
   */
  public get(storeId): Promise<StoreBeauticianInfo> {
    return this.storeBeauticianInfoDao.get(storeId);
  };

  /**
   * 添加医美师
   * @param storeId
   * @returns {Promise<StoreBeauticianInfo>}
   */
  public addBeautician(storeId,buserId): Promise<boolean> {
    let addBeauticianInfoData = new AddBeauticianInfoData();
    addBeauticianInfoData.buserId = buserId;
    let updateForm = new StoreBeauticianInfoUpdateForm();
    updateForm.storeId = storeId;
    updateForm.updateType = StoreBeauticianInfoUpdateType.AddBeauticianInfo;
    updateForm.addBeauticianInfoData = addBeauticianInfoData;
    return this.storeBeauticianInfoDao.updateWithId(storeId,updateForm);
  };

  /**
   * 删除医美师
   * @param storeId
   * @returns {Promise<StoreBeauticianInfo>}
   */
  public removeBeautician(storeId,buserId): Promise<boolean> {
    let removeBeauticianInfoData = new RemoveBeauticianInfoData();
    removeBeauticianInfoData.buserId = buserId;
    let updateForm = new StoreBeauticianInfoUpdateForm();
    updateForm.storeId = storeId;
    updateForm.updateType = StoreBeauticianInfoUpdateType.RemoveBeauticianInfo;
    updateForm.removeBeauticianInfoData = removeBeauticianInfoData;
    return this.storeBeauticianInfoDao.updateWithId(storeId,updateForm);
  };

}

export class StoreBeauticianInfoDao extends AsyncRestDao<StoreBeauticianInfo> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "storeBeauticianInfo";
    super(StoreBeauticianInfo, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
