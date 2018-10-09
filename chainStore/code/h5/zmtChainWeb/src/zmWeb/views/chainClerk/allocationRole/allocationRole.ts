import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChainClerkMgr} from "../../../bsModule/chainClerk/ChainClerkMgr";
import {ChainClerkSynDataHolder} from "../../../bsModule/chainClerk/ChainClerkSynDataHolder";
import {ChainClerkViewDataMgr} from "../ChainClerkViewDataMgr";
import {ChainUserSynDataHolder} from "../../../bsModule/chainUser/ChainUserSynDataHolder";
import {ChainUser} from "../../../bsModule/chainUser/data/ChainUser";
import {ClerkInfo} from "../../../bsModule/chainClerk/data/ClerkInfo";
import {AdminRoleState} from "../../../bsModule/chainClerk/data/adminRole/AdminRoleState";
import {ClerkRoleSaveForm} from "../../../bsModule/chainClerk/apiData/ClerkRoleSaveForm";

/**
 * 店员管理 岗位分配
 */
@Component({
  selector:'allocation-role',
  templateUrl:'allocationRole.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class AllocationRolePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramSub: any;
  private service: AllocationRoleService;
  public viewData: AllocationRoleViewData;

  constructor(
    private chainUserSynDataHolder:ChainUserSynDataHolder,
    private chainClerkMgr:ChainClerkMgr,
    private chainClerkSynDataHolder:ChainClerkSynDataHolder,
    private chainClerkViewDataMgr:ChainClerkViewDataMgr,
    private cdRef: ChangeDetectorRef,
    private route:ActivatedRoute){
    this.service = new AllocationRoleService(this.chainUserSynDataHolder,this.chainClerkMgr,this.chainClerkSynDataHolder,this.chainClerkViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chainClerkViewDataMgr.subscribeAllocationRoleVD((viewDataP:AllocationRoleViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramSub = this.route.params.subscribe(params =>{
      let clerkId = params['clerkId'];
      if(clerkId){
        this.service.initViewData(clerkId);
      }
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    this.paramSub.unsubscribe();
  }


  /**
   * 员工分配权限 页面点击事件
   */
  addRoleSet2Clerk(){
    this.service.addRoleSet2Clerk(this.viewData,(successP:boolean) =>{
      this.chainClerkViewDataMgr.setAllocationRoleViewData(this.viewData);
      if(successP){
        AppUtils.showSuccess("提示","岗位设置成功");
        AppRouter.goFindClerk();
      }else{
        AppUtils.showError("提示","岗位设置失败");
      }
    })
  }

}

export class AllocationRoleService{
  constructor(
    private chainUserSynDataHolder:ChainUserSynDataHolder,
    private chainClerkMgr:ChainClerkMgr,
    private chainClerkSynDataHolder:ChainClerkSynDataHolder,
    private chainClerkViewDataMgr:ChainClerkViewDataMgr){}

  public initViewData(clerkId):void{
    let viewDataTmp = new AllocationRoleViewData();
    this.chainClerkViewDataMgr.setAllocationRoleViewData(viewDataTmp);

    this.buildViewData(clerkId,(viewDataP:AllocationRoleViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.chainClerkViewDataMgr.setAllocationRoleViewData(viewDataP);
  }

  /**
   * 组装数据
   * @param clerkId
   * @param callback
   */
  public async buildViewData(clerkId,callback:(viewDataP:AllocationRoleViewData) => void){
    let viewDataTmp = new AllocationRoleViewData();

    //请求用户信息
    let user = await this.chainUserSynDataHolder.getData(clerkId);
    viewDataTmp.chainUser = user;
    let allocationClerkData = AllocationClerkData.fromChainUser(user);
    viewDataTmp.allocationClerkData = allocationClerkData;

    //请求chainClerk
    let chainId = SessionUtil.getInstance().getChainId();
    let chainClerk = await this.chainClerkSynDataHolder.getData(chainId);
    viewDataTmp.clerkMap = chainClerk.getAllClerkInfoMap();
    viewDataTmp.roleMap = this.getRoleMap(chainClerk.roleMap);
    viewDataTmp.roleMap = this.buildRoleMap(viewDataTmp.clerkMap,viewDataTmp.roleMap, clerkId);
    viewDataTmp.allocationClerkData.roleSet = viewDataTmp.roleMap.values();
    callback(viewDataTmp);
  }

  /**
   * 根据员工构造角色权限
   * @param clerkMap
   * @param roleMapP
   * @param clerkId
   * @returns {ZmMap<RoleData>}
   */
  private buildRoleMap(clerkMap:ZmMap<ClerkInfo>,roleMapP:ZmMap<RoleData>, clerkId) {
    let roleMap = new ZmMap<RoleData>();
    AppUtils.copy(roleMap,roleMapP);
    let clerkInfo:ClerkInfo = clerkMap.get(clerkId);
    let roleSet = clerkInfo.roleSet;
    if (roleSet) {
      for (let i = 0; i < roleSet.length; i++) {
        if (AppUtils.arrayContains(roleMap.keys(), roleSet[i])) {
          roleMap.get(roleSet[i]).checked = true;
        }
      }
    }
    return roleMap;
  }

  /**
   * 构造角色map
   */
  private getRoleMap(storeRoleMap):ZmMap<RoleData> {
    //转换角色map
    let roleMap = new ZmMap<RoleData>();
    for (let index in storeRoleMap) {
      let roleInfo = storeRoleMap[index];
      if(roleInfo.state == AdminRoleState.Available && (roleInfo.id != "2")){//去掉老板角色
        let roleData:RoleData = new RoleData();
        roleData.id = roleInfo.id;
        roleData.name = roleInfo.name;
        roleData.checked = false;
        roleMap.put(roleInfo.id, roleData);
      }
    }
    return roleMap;
  }

  /**
   * 分配权限
   * @param viewData
   * @param callback
   */
  public addRoleSet2Clerk(viewData:AllocationRoleViewData,callback:(successP:boolean) => void){
    let clerkId = viewData.allocationClerkData.id;
    let roleIdSet = new Array<string>();
    let roleSet = viewData.allocationClerkData.roleSet;
    for(let i=0;i<roleSet.length;i++){
      if(roleSet[i].checked){
        roleIdSet.push(roleSet[i].id);
      }
    }
    let chainId = SessionUtil.getInstance().getChainId();
    let clerkRoleSaveForm = new ClerkRoleSaveForm();
    clerkRoleSaveForm.chainId = chainId;
    clerkRoleSaveForm.userId = clerkId;
    clerkRoleSaveForm.roleIds = roleIdSet;
    this.chainClerkMgr.addRoleSet2Clerk(chainId,clerkRoleSaveForm).then((success) =>{
      callback(success);
    })
  }
}

export class AllocationRoleViewData{
  public clerkMap:ZmMap<ClerkInfo>;
  public roleMap:ZmMap<RoleData>;

  public chainUser:ChainUser;

  //页面对应显示数据
  public allocationClerkData:AllocationClerkData = new AllocationClerkData();

  public isStoreClerk:boolean = false;//是否为跨店员工
}

export class AllocationClerkData{
  id:number;
  name:string;
  gender:number;
  phone:string;
  roleSet:Array<RoleData>;
  isStoreClerk:boolean;

  constructor(){}

  public static fromChainUser(user:ChainUser){
    let allocationClerkData = new AllocationClerkData();
    allocationClerkData.id = user.id;
    allocationClerkData.name = user.name;
    allocationClerkData.gender = user.gender;
    allocationClerkData.phone = user.phone;
    return allocationClerkData;
  }
}

export class RoleData{
  id:string;
  name:string;
  checked:boolean;
}
