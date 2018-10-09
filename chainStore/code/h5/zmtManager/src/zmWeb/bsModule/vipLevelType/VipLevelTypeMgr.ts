import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {SessionUtil} from "../../comModule/SessionUtil";
import {AddVipLevelTypeForm} from "./apiData/AddVipLevelTypeForm";
import {UpdateVipLevelTypeForm} from "./apiData/UpdateVipLevelTypeForm";
import {VipLevelTypeUpdateForm} from "./apiData/VipLevelTypeUpdateForm";
import {VipLevelTypeUpdateType} from "./apiData/VipLevelTypeUpdateType";
import {UpdateVipLevelTypeStateForm} from "./apiData/UpdateVipLevelTypeStateForm";
import {ReqMap} from "../../comModule/AppUtils";
import {PageResp} from "../../comModule/PageResp";
import {QueryVipLevelTypeForm} from "./apiData/QueryVipLevelTypeForm";
import {VipLevelType} from "./data/VipLevelType";
import {RemoveVipLevelTypeForm} from "./apiData/RemoveVipLevelTypeForm";

@Injectable()
export class VipLevelTypeMgr {
  private vipLevelTypeDao: VipLevelTypeDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.vipLevelTypeDao = new VipLevelTypeDao(restProxy);
  }

  /**
   * 根据id获取等级分类信息
   * @param vipLevelTypeId
   * @returns {Promise<VipLevelType>}
   */
  public getVipLevelType(vipLevelTypeId:number): Promise<VipLevelType> {
    return this.vipLevelTypeDao.get(vipLevelTypeId);
  };

  public getPage(queryForm:QueryVipLevelTypeForm): Promise<PageResp> {
    let path = "findPage";
    let reqMap = new ReqMap();
    reqMap.add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString())
      .add("name",queryForm.name);
    return this.vipLevelTypeDao.getPageRespByType(path,reqMap,VipLevelType);
  };

  public getAllList(queryForm:QueryVipLevelTypeForm): Promise<PageResp> {
    let path = "findPage";
    let reqMap = new ReqMap();
    reqMap.add("state",queryForm.state.toString());
    return this.vipLevelTypeDao.getPageRespByType(path,reqMap,VipLevelType);
  };

  /**
   * 添加等级分类
   * @param vipLevelTypeForm
   * @returns {Promise<VipLevelType>}
   */
  public addVipLevelType(vipLevelTypeForm:AddVipLevelTypeForm): Promise<VipLevelType> {
    return this.vipLevelTypeDao.addForm(vipLevelTypeForm);
  }

  /**
   * 修改等级分类信息
   * @param UpdateVipLevelTypeInfoApiData
   * @returns {Promise<boolean>}
   */
  public updateVipLevelType(vipLevelTypeId:number,updateData:UpdateVipLevelTypeForm): Promise<boolean> {
    let updateForm:VipLevelTypeUpdateForm = new VipLevelTypeUpdateForm();
    updateForm.updateType = VipLevelTypeUpdateType.UpdateVipLevelType;
    updateForm.updateVipLevelTypeForm = updateData;
    return this.update(vipLevelTypeId,updateForm);
  }

  /**
   * 修改等级分类状态
   * @param updateData
   * @returns {Promise<boolean>}
   */
  public updateVipLevelTypeState(vipLevelTypeId:number,updateData:UpdateVipLevelTypeStateForm): Promise<boolean> {
    let updateForm:VipLevelTypeUpdateForm = new VipLevelTypeUpdateForm();
    updateForm.updateType = VipLevelTypeUpdateType.UpdateVipLevelTypeState;
    updateForm.updateVipLevelTypeStateForm = updateData;
    return this.update(vipLevelTypeId,updateForm);
  }

  public removeVipLevelType(removeData:RemoveVipLevelTypeForm): Promise<boolean> {
    let updateForm:VipLevelTypeUpdateForm = new VipLevelTypeUpdateForm();
    updateForm.updateType = VipLevelTypeUpdateType.RemoveVipLevelType;
    updateForm.removeVipLevelTypeForm = removeData;
    return this.update(removeData.id,updateForm);
  }

  public update(vipLevelTypeId:number,updateForm:VipLevelTypeUpdateForm){
    return new Promise<boolean>(resolve => {
      this.vipLevelTypeDao.updateWithId(vipLevelTypeId,updateForm).then(
        (success) => {
          resolve(success);
        });
    });
  }

}

export class VipLevelTypeDao extends AsyncRestDao<VipLevelType> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "vipLevelType";
    super(VipLevelType, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}
