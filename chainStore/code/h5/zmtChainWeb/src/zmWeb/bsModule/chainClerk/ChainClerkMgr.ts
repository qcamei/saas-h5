import {Injectable} from "@angular/core";
import {ChainClerk} from "./data/ChainClerk";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ChainClerkUpdateForm} from "./apiData/ChainClerkUpdateForm";
import {ChainClerkUpdateType} from "./apiData/ChainClerkUpdateType";
import {AppCfg} from "../../comModule/AppCfg";
import {AdminRole} from "./data/adminRole/AdminRole";
import {AdminRoleAddForm} from "./apiData/AdminRoleAddForm";
import {AdminRoleUpdateForm} from "./apiData/AdminRoleUpdateForm";
import {AdminRoleRemoveForm} from "./apiData/AdminRoleRemoveForm";
import {ClerkRoleSaveForm} from "./apiData/ClerkRoleSaveForm";
import {ChainClerkAddForm} from "./apiData/ChainClerkAddForm";
import {ChainClerkReomveForm} from "./apiData/ChainClerkReomveForm";
import {ChainAllotStoreForm} from "./apiData/ChainAllotStoreForm";
import {ChainBatchAllotStoreForm} from "./apiData/ChainBatchAllotStoreForm";
import {ChainClerkUpdateInfoForm} from "./apiData/ChainClerkUpdateInfoForm";


@Injectable()
export class ChainClerkMgr {
  private chainClerkDao: ChainClerkDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.chainClerkDao = new ChainClerkDao(restProxy);
  }

  public getChainClerk(chainId:string): Promise<ChainClerk> {
    return this.chainClerkDao.get(chainId);
  };

  /**
   * 添加岗位
   * @returns {Promise<boolean>}
   */
  public addAdminRole(chainId,role:AdminRole){
    let addAdminRoleData = new AdminRoleAddForm();
    addAdminRoleData.chainId = chainId;
    addAdminRoleData.role = role;

    let updateForm = new ChainClerkUpdateForm();
    updateForm.updateType = ChainClerkUpdateType.AddAdminRole;
    updateForm.chainId = chainId;
    updateForm.adminRoleAddForm = addAdminRoleData;

    return this.update(chainId,updateForm);
  }

  /**
   * 修改岗位信息
   * @returns {Promise<boolean>}
   */
  public updateAdminRole(chainId,role:AdminRole){
    let adminRoleUpdateForm = new AdminRoleUpdateForm();
    adminRoleUpdateForm.chainId = chainId;
    adminRoleUpdateForm.role = role;

    let updateForm = new ChainClerkUpdateForm();
    updateForm.updateType = ChainClerkUpdateType.UpdateAdminRole;
    updateForm.adminRoleUpdateForm = adminRoleUpdateForm;

    return this.update(chainId,updateForm);
  }

  /**
   * 删除岗位信息
   * @returns {Promise<boolean>}
   */
  public removeAdminRole(chainId:string,roleId:number){
    let adminRoleRemoveForm = new AdminRoleRemoveForm();
    adminRoleRemoveForm.chainId = chainId;
    adminRoleRemoveForm.roleId = roleId;

    let updateForm = new ChainClerkUpdateForm();
    updateForm.updateType = ChainClerkUpdateType.RemoveAdminRole;
    updateForm.adminRoleRemoveForm = adminRoleRemoveForm;

    return this.update(chainId,updateForm);
  }

  /**
   * 添加员工
   * @returns {Promise<boolean>}
   */
  public addClerk(chainId:string,chainClerkAddForm:ChainClerkAddForm){
    let updateForm = new ChainClerkUpdateForm();
    updateForm.updateType = ChainClerkUpdateType.AddClerk;
    updateForm.chainClerkAddForm = chainClerkAddForm;

    return this.update(chainId,updateForm);
  }

  /**
   * 编辑员工
   * @returns {Promise<boolean>}
   */
  public editClerk(chainId:string,updateInfoForm:ChainClerkUpdateInfoForm){
    let updateForm = new ChainClerkUpdateForm();
    updateForm.updateType = ChainClerkUpdateType.UpdateClerk;
    updateForm.chainClerkUpdateInfoForm = updateInfoForm;
    return this.update(chainId,updateForm);
  }

  /**
   * 删除员工
   * @returns {Promise<boolean>}
   */
  public removeClerk(chainId:string,chainClerkReomveForm:ChainClerkReomveForm){
    let updateForm = new ChainClerkUpdateForm();
    updateForm.updateType = ChainClerkUpdateType.ReomveClerk;
    updateForm.chainClerkReomveForm = chainClerkReomveForm;

    return this.update(chainId,updateForm);
  }


  /**
   * 给员工分配岗位
   * @returns {Promise<boolean>}
   */
  public addRoleSet2Clerk(chainId:string,clerkRoleSaveForm:ClerkRoleSaveForm){
    let updateForm = new ChainClerkUpdateForm();
    updateForm.updateType = ChainClerkUpdateType.SaveRoleSet2Clerk;
    updateForm.clerkRoleSaveForm = clerkRoleSaveForm;
    return this.update(chainId,updateForm);
  }

  public allotStore(chainId:string,chainAllotStoreForm:ChainAllotStoreForm){
    let updateForm = new ChainClerkUpdateForm();
    updateForm.updateType = ChainClerkUpdateType.AllotStore;
    updateForm.chainAllotStoreForm = chainAllotStoreForm;
    return this.update(chainId,updateForm);
  }

  public batchAllotStore(chainId:string,chainBatchAllotStoreForm:ChainBatchAllotStoreForm){
    let updateForm = new ChainClerkUpdateForm();
    updateForm.updateType = ChainClerkUpdateType.BatchAllotStore;
    updateForm.chainBatchAllotStoreForm = chainBatchAllotStoreForm;
    return this.update(chainId,updateForm);
  }

  public update(chainId:string,updateForm:ChainClerkUpdateForm){
    return new Promise<boolean>(resolve => {
      this.chainClerkDao.updateWithId(chainId,updateForm).then((success) =>{
        resolve(success);
      })
    })
  }
}

export class ChainClerkDao extends AsyncRestDao<ChainClerk> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "chainClerk";
    super(ChainClerk, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
