import {StoreClerkInfo} from "./data/StoreClerkInfo";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {ApplyClerkInfoData} from "./apiData/ApplyClerkInfoData";
import {StoreClerkInfoUpdateForm} from "./apiData/StoreClerkInfoUpdateForm";
import {StoreClerkInfoUpdateType} from "./apiData/StoreClerkInfoUpdateType";
import {ReomveClerkData} from "./apiData/ReomveClerkData";
import {AddRoleSet2ClerkData} from "./apiData/AddRoleSet2ClerkData";
import {HandleApplyClerkInfoData} from "./apiData/HandleApplyClerkInfoData";
import {StoreAdminRole} from "./data/storeAdminRole/StoreAdminRole";
import {AddStoreAdminRoleData} from "./apiData/AddStoreAdminRoleData";
import {UpdateStoreAdminRoleData} from "./apiData/UpdateStoreAdminRoleData";
import {HandleGroupApplyClerkData} from "./apiData/HandleGroupApplyClerkData";
import {AppCfg} from "../../comModule/AppCfg";
import {MgrPool} from "../../comModule/MgrPool";


export class StoreClerkInfoMgr {

  public static getInstance():StoreClerkInfoMgr{
    return MgrPool.getInstance().get("StoreClerkInfoMgr",StoreClerkInfoMgr);
  }

  private storeClerkInfoDao: StoreClerkInfoDao;

  constructor() {
    this.storeClerkInfoDao = new StoreClerkInfoDao();
  }

  /**
   * 根据id获取详情
   * @param storeClerkInfoId
   * @returns {Promise<StoreClerkInfo>}
   */
  public get(storeClerkInfoId): Promise<StoreClerkInfo> {
    return this.storeClerkInfoDao.get(storeClerkInfoId);
  };

  /**
   * 员工申请加入店铺
   * @param storeId
   * @param buserId
   * @returns {Promise<boolean>}
   */
  public applyStore(storeId,buserId):Promise<boolean>{
    let applyClerkInfoData = new ApplyClerkInfoData();
    applyClerkInfoData.storeId = storeId;
    applyClerkInfoData.bUserId = buserId;
    let updateForm = new StoreClerkInfoUpdateForm();
    updateForm.updateType = StoreClerkInfoUpdateType.ApplyClerk;
    updateForm.applyClerkInfoData = applyClerkInfoData;
    return this.storeClerkInfoDao.updateWithId(storeId,updateForm);
  }

  /**
   * 删除员工
   * @returns {Promise<boolean>}
   */
  public deleteClerk(storeId,buserId){
    let reomveClerkData = new ReomveClerkData();
    reomveClerkData.storeId = storeId;
    reomveClerkData.buserId = buserId;
    let updateForm = new StoreClerkInfoUpdateForm();
    updateForm.updateType = StoreClerkInfoUpdateType.ReomveClerk;
    updateForm.reomveClerkData = reomveClerkData;
    return new Promise<boolean>(resolve => {
      this.storeClerkInfoDao.updateWithId(storeId,updateForm).then((success) =>{
        resolve(success);
      })
    })
  }

  /**
   * 给员工分配岗位
   * @returns {Promise<boolean>}
   */
  public addRoleSet2Clerk(storeId,buserId,roleIdSet:Array<string>){
    let addRoleSet2ClerkData = new AddRoleSet2ClerkData();
    addRoleSet2ClerkData.storeId = storeId;
    addRoleSet2ClerkData.buserId = buserId;
    addRoleSet2ClerkData.roleIdSet = roleIdSet;
    let updateForm = new StoreClerkInfoUpdateForm();
    updateForm.updateType = StoreClerkInfoUpdateType.AddRoleSet2Clerk;
    updateForm.addRoleSet2ClerkData = addRoleSet2ClerkData;
    return new Promise<boolean>(resolve => {
      this.storeClerkInfoDao.updateWithId(storeId,updateForm).then((success) =>{
        resolve(success);
      })
    })
  }

  /**
   * 审核员工 单个审核
   * @returns {Promise<boolean>}
   */
  public handleApplyClerk(storeId,buserId,approved:boolean){
    let handleApplyClerkInfoData = new HandleApplyClerkInfoData();
    handleApplyClerkInfoData.storeId = storeId;
    handleApplyClerkInfoData.bUserId = buserId;
    handleApplyClerkInfoData.approved = approved;
    let updateForm = new StoreClerkInfoUpdateForm();
    updateForm.updateType = StoreClerkInfoUpdateType.HandleApplyClerk;
    updateForm.handleApplyClerkInfoData = handleApplyClerkInfoData;
    return new Promise<boolean>(resolve => {
      this.storeClerkInfoDao.updateWithId(storeId,updateForm).then((success) =>{
        resolve(success);
      })
    })
  }

  /**
   * 审核员工 批量审核
   * @returns {Promise<boolean>}
   */
  public HandleGroupApplyClerk(storeId,buserIdArr,approved:boolean){
    let handleGroupApplyClerkData = new HandleGroupApplyClerkData();
    handleGroupApplyClerkData.storeId = storeId;
    handleGroupApplyClerkData.buserIdSet = buserIdArr;
    handleGroupApplyClerkData.approved = approved;
    let updateForm = new StoreClerkInfoUpdateForm();
    updateForm.updateType = StoreClerkInfoUpdateType.HandleGroupApplyClerk;
    updateForm.handleGroupApplyClerkData = handleGroupApplyClerkData;
    return new Promise<boolean>(resolve => {
      this.storeClerkInfoDao.updateWithId(storeId,updateForm).then((success) =>{
        resolve(success);
      })
    })
  }

  /**
   * 添加岗位
   * @returns {Promise<boolean>}
   */
  public addStoreAdminRole(storeId,role:StoreAdminRole){
    let addStoreAdminRoleData = new AddStoreAdminRoleData();
    addStoreAdminRoleData.storeId = storeId;
    addStoreAdminRoleData.role = role;
    let updateForm = new StoreClerkInfoUpdateForm();
    updateForm.updateType = StoreClerkInfoUpdateType.AddStoreAdminRole;
    updateForm.addStoreAdminRoleData = addStoreAdminRoleData;
    return new Promise<boolean>(resolve => {
      this.storeClerkInfoDao.updateWithId(storeId,updateForm).then((success) =>{
        resolve(success);
      })
    })
  }

  /**
   * 修改岗位信息 可设置删除状态
   * @returns {Promise<boolean>}
   */
  public updateStoreAdminRole(storeId,role:StoreAdminRole){
    let updateStoreAdminRoleData = new UpdateStoreAdminRoleData();
    updateStoreAdminRoleData.storeId = storeId;
    updateStoreAdminRoleData.role = role;
    let updateForm = new StoreClerkInfoUpdateForm();
    updateForm.updateType = StoreClerkInfoUpdateType.UpdateStoreAdminRole;
    updateForm.updateStoreAdminRoleData = updateStoreAdminRoleData;
    return new Promise<boolean>(resolve => {
      this.storeClerkInfoDao.updateWithId(storeId,updateForm).then((success) =>{
        resolve(success);
      })
    })
  }

}

export class StoreClerkInfoDao extends AsyncRestDao<StoreClerkInfo> {
  constructor() {
    var table = "storeClerkInfo";
    super(StoreClerkInfo, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }

}
