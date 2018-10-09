import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {VipLevel} from "./data/VipLevel";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {SessionUtil} from "../../comModule/SessionUtil";
import {AddVipLevelForm} from "./apiData/AddVipLevelForm";
import {UpdateVipLevelForm} from "./apiData/UpdateVipLevelForm";
import {VipLevelUpdateForm} from "./apiData/VipLevelUpdateForm";
import {VipLevelUpdateType} from "./apiData/VipLevelUpdateType";
import {UpdateVipLevelStateForm} from "./apiData/UpdateVipLevelStateForm";
import {ReqMap} from "../../comModule/AppUtils";
import {PageResp} from "../../comModule/PageResp";
import {QueryVipLevelForm} from "./apiData/QueryVipLevelForm";

@Injectable()
export class VipLevelMgr {
  private vipLevelDao: VipLevelDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.vipLevelDao = new VipLevelDao(restProxy);
  }

  /**
   * 根据id获取等级信息
   * @param vipLevelId
   * @returns {Promise<VipLevel>}
   */
  public getVipLevel(vipLevelId:number): Promise<VipLevel> {
    return this.vipLevelDao.get(vipLevelId);
  };

  public getPage(queryForm:QueryVipLevelForm): Promise<PageResp> {
    let path = "findPage";
    let reqMap = new ReqMap();
    reqMap.add("typeId",queryForm.typeId.toString());
    reqMap.add("state",queryForm.state.toString());
    reqMap.add("name",queryForm.name);
    reqMap.add("pageItemCount",queryForm.pageItemCount.toString()).add("pageNo",queryForm.pageNo.toString());
    return this.vipLevelDao.getPageRespByType(path,reqMap,VipLevel);
  };

  public getAllList(queryForm:QueryVipLevelForm): Promise<PageResp> {
    let path = "findPage";
    let reqMap = new ReqMap();
    reqMap.add("state",queryForm.state.toString());
    return this.vipLevelDao.getPageRespByType(path,reqMap,VipLevel);
  };

  /**
   * 添加等级
   * @param vipLevelForm
   * @returns {Promise<VipLevel>}
   */
  public addVipLevel(vipLevelForm:AddVipLevelForm): Promise<boolean> {
    return this.vipLevelDao.add(vipLevelForm);
  }

  /**
   * 修改等级信息
   * @param UpdateVipLevelInfoApiData
   * @returns {Promise<boolean>}
   */
  public updateVipLevel(vipLevelId:number,updateData:UpdateVipLevelForm): Promise<boolean> {
    let updateForm:VipLevelUpdateForm = new VipLevelUpdateForm();
    updateForm.updateType = VipLevelUpdateType.UpdateVipLevel;
    updateForm.updateVipLevelForm = updateData;
    return new Promise<boolean>(resolve => {
      this.vipLevelDao.updateWithId(vipLevelId,updateForm).then(
        (success) => {
          resolve(success);
        });
    });
  }

  /**
   * 修改等级状态
   * @param updateData
   * @returns {Promise<boolean>}
   */
  public updateVipLevelState(vipLevelId:number,updateData:UpdateVipLevelStateForm): Promise<boolean> {
    let updateForm:VipLevelUpdateForm = new VipLevelUpdateForm();
    updateForm.updateType = VipLevelUpdateType.UpdateVipLevelState;
    updateForm.updateVipLevelStateForm = updateData;
    return new Promise<boolean>(resolve => {
      this.vipLevelDao.updateWithId(vipLevelId,updateForm).then(
        (success) => {
          resolve(success);
        });
    });
  }


}

export class VipLevelDao extends AsyncRestDao<VipLevel> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "vipLevel";
    super(VipLevel, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}
