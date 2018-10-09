import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {StoreClerkInfoViewDataMgr} from "../StoreClerkInfoViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {StoreBeauticianInfo} from "../../../bsModule/storeBeauticianInfo/data/StoreBeauticianInfo";
import {StoreBeauticianInfoMgr} from "../../../bsModule/storeBeauticianInfo/StoreBeauticianInfoMgr";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRoleState} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRoleState";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {StoreBeauticianInfoSynDataHolder} from "../../../bsModule/storeBeauticianInfo/StoreBeauticianInfoSynDataHolder";
import {MainViewDataMgr} from "../../main/MainViewDataMgr";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";

/**
 * 店员管理 岗位分配
 */
@Component({
  selector:'allocation-role',
  templateUrl:'allocationRole.html',
  styleUrls:['allocationRole.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class AllocationRolePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramSub: any;
  private service: AllocationRoleService;
  public viewData: AllocationRoleViewData;

  constructor(
              private buserSynDataHolder:BUserSynDataHolder,
              private storeBeauticianInfoMgr:StoreBeauticianInfoMgr,
              private storeBeauticianInfoSynDataHolder:StoreBeauticianInfoSynDataHolder,
              private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private route:ActivatedRoute){
    this.service = new AllocationRoleService(this.buserSynDataHolder,this.storeBeauticianInfoMgr,this.storeBeauticianInfoSynDataHolder,this.storeClerkInfoMgr,this.storeClerkInfoSynDataHolder,this.storeClerkInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeClerkInfoViewDataMgr.subscribeAllocationRoleVD((viewDataP:AllocationRoleViewData) => {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
    })
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
   * 角色复选框选择事件
   * @param e
   * @param roleId
   */
  changeRole(e,roleId){
    let value = e.target.checked;
    let roleSet = this.viewData.allocationClerkData.roleSet;
    for(let i=0;i<roleSet.length;i++){
      if(roleSet[i].id == roleId){
        roleSet[i].checked = value;
      }
    }
  }

  /**
   * 员工分配权限 页面点击事件
   */
  addRoleSet2Clerk(){
    this.service.addRoleSet2Clerk(this.viewData,(successP:boolean) =>{
      this.storeClerkInfoViewDataMgr.setAllocationRoleViewData(this.viewData);
      if(successP){
        AppUtils.showSuccess("提示","分配成功");
        // MainViewDataMgr.getInstance().notifyDataChanged();
        AppRouter.goFindClerk(0);
      }else{
        AppUtils.showError("提示","分配失败");
      }
    })
  }

  /**
   * 切换服务人员 页面点击事件
   * @param flag
   */
  changeBeautician(flag:boolean){
    let isBeautician = this.viewData.allocationClerkData.isBeautician;
    if((isBeautician != undefined) && (flag != isBeautician)){
      if(flag){
        this.service.addBeautician(this.viewData.allocationClerkData.id,(success:boolean) =>{
          this.storeClerkInfoViewDataMgr.setAllocationRoleViewData(this.viewData);
          if(success){
            this.viewData.allocationClerkData.isBeautician = true;
            // AppUtils.showSuccess("提示","设置服务人员成功");
          }else{
            this.viewData.isBeautician = false;
            AppUtils.showError("提示","设置服务人员失败");
          }
        })
      }else{
        this.service.removeBeautician(this.viewData.allocationClerkData.id,(success:boolean) =>{
          this.storeClerkInfoViewDataMgr.setAllocationRoleViewData(this.viewData);
          if(success){
            this.viewData.allocationClerkData.isBeautician = false;
            // AppUtils.showSuccess("提示","设置服务人员成功");
          }else{
            this.viewData.isBeautician = true;
            AppUtils.showError("提示","设置服务人员失败");
          }
        })
      }
    }
  }

}

export class AllocationRoleService{
  constructor(
              private buserSynDataHolder:BUserSynDataHolder,
              private storeBeauticianInfoMgr:StoreBeauticianInfoMgr,
              private storeBeauticianInfoSynDataHolder:StoreBeauticianInfoSynDataHolder,
              private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr){}

  public initViewData(clerkId):void{
    let viewDataTmp = new AllocationRoleViewData();
    this.storeClerkInfoViewDataMgr.setAllocationRoleViewData(viewDataTmp);

    this.buildViewData(clerkId,(viewDataP:AllocationRoleViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.storeClerkInfoViewDataMgr.setAllocationRoleViewData(viewDataP);
  }

  /**
   * 组装数据
   * @param clerkId
   * @param callback
   */
  public async buildViewData(clerkId,callback:(viewDataP:AllocationRoleViewData) => void){
    let viewDataTmp = new AllocationRoleViewData();
    let allocationClerkData = viewDataTmp.allocationClerkData;

    //请求用户信息
    let buser = await this.buserSynDataHolder.getData(clerkId);
    viewDataTmp.buser = buser;
    allocationClerkData.id = clerkId;
    allocationClerkData.name = buser.name;
    allocationClerkData.gender = buser.gender;
    allocationClerkData.phone = buser.phone;

    //请求所有医美师信息
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeBeauticianInfo = await this.storeBeauticianInfoSynDataHolder.getData(storeId);
    //判断是否为医美师
    let beauticianMap = storeBeauticianInfo.getBeauticianMap();
    if(beauticianMap.contains(clerkId)){
      viewDataTmp.isBeautician = true;
      allocationClerkData.isBeautician = true;
    }else{
      viewDataTmp.isBeautician = false;
      allocationClerkData.isBeautician = false;
    }

    //请求storeClerkInfo
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.clerkMap = storeClerkInfo.getClerkMap();
    viewDataTmp.roleMap = this.getRoleMap(storeClerkInfo.roleMap);

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
    let clerkInfo = clerkMap.get(clerkId);
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
      if(roleInfo.state == StoreAdminRoleState.Available && (roleInfo.id != "2")){//去掉老板角色
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
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeClerkInfoMgr.addRoleSet2Clerk(storeId,clerkId,roleIdSet).then((success) =>{
      callback(success);
    })
  }

  /**
   * 添加医美师
   * @param buserId
   * @param callback
   */
  public addBeautician(buserId,callback:(successP:boolean) =>void){
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeBeauticianInfoMgr.addBeautician(storeId,buserId).then((success) =>{
      callback(success);
    })
  }

  /**
   * 删除医美师
   * @param buserId
   * @param callback
   */
  public removeBeautician(buserId,callback:(successP:boolean) =>void){
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeBeauticianInfoMgr.removeBeautician(storeId,buserId).then((success) =>{
      callback(success);
    })
  }

}

export class AllocationRoleViewData{
  public clerkMap:ZmMap<ClerkInfo>;
  public roleMap:ZmMap<RoleData>;

  public buser:BUser;
  public storeBeauticianInfo:StoreBeauticianInfo;

  //页面对应显示数据
  public allocationClerkData:AllocationClerkData = new AllocationClerkData();

  public isBeautician:boolean = false;//是否为服务人员
}

export class AllocationClerkData{
  id:string;
  name:string;
  gender:number;
  phone:string;
  roleSet:Array<RoleData>;
  isBeautician:boolean;
}

export class RoleData{
  id:string;
  name:string;
  checked:boolean;
}
