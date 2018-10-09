import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {StoreClerkInfoViewDataMgr} from "../StoreClerkInfoViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {StorePermBuilder,StoreAdminPermEnum, AdminPermType, PermData} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminPermEnum";
import {StoreVipLevelEnum} from "../../../bsModule/buser/data/StoreVipLevelEnum";

/**
 * 店员管理 新建岗位
 */
@Component({
  selector:'add-admin-role',
  templateUrl:'addAdminRole.html',
  styleUrls:['addAdminRole.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class AddAdminRolePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: AddAdminRoleService;
  public viewData: AddAdminRoleViewData;

  constructor(private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new AddAdminRoleService(this.storeClerkInfoMgr,this.storeClerkInfoSynDataHolder,this.storeClerkInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeClerkInfoViewDataMgr.subscribeAddAdminRoleVD((viewDataP:AddAdminRoleViewData) => {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      })
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 新建岗位 页面点击事件
   */
  addAdminRole(){
    this.viewData.storeAdminRole.name = AppUtils.trimBlank(this.viewData.storeAdminRole.name);
    if(!AppUtils.isNullOrWhiteSpace(this.viewData.storeAdminRole.name)){
      if(!this.checkHasRoleName()){
        this.service.addAdminRole(this.viewData,(successP:boolean) =>{
          if(successP){
            AppUtils.showSuccess("提示","新建成功");
            AppRouter.goManageRole();
          }else{
            AppUtils.showError("提示","新建失败");
          }
        })
      }else{
        AppUtils.showWarn("提示","该岗位已存在");
      }
    }else{
      AppUtils.showWarn("提示","名称不能为空");
    }
  }

  /**
   * 检查岗位名称是否重复
   * @returns {boolean}
   */
  private checkHasRoleName():boolean {
    let roleMap = this.viewData.storeClerkInfo.getRoleMap();
    let roleList = roleMap.values();
    let has: boolean = false;
    roleList.forEach((item) => {
      if (item.name == this.viewData.storeAdminRole.name) {
        has = true;
        return;
      }
    })
    return has;
  }

  /**
   * 权限复选框选择事件
   * @param e
   * @param permNum
   */
  // choosePerm(e,permNum){
  //   let value = e.target.checked;
  //   let permList = this.viewData.permList;
  //   for(let i=0;i<permList.length;i++){
  //     let permData = permList[i];
  //     if(permData.permItem.permNum == permNum){
  //       permData.checked = value;
  //     }
  //   }
  // }
  //
  // choosePerm2(){
  //   let permList = this.viewData.permList;
  //   for(let i=0;i<permList.length;i++){
  //     let permData = permList[i];
  //     if(permData.checked == true){
  //       permData.per;
  //     }
  //   }
  // }

}

export class AddAdminRoleService{
  constructor(private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new AddAdminRoleViewData();
    this.storeClerkInfoViewDataMgr.setAddAdminRoleViewData(viewDataTmp);

    this.buildViewData((viewDataP:AddAdminRoleViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.storeClerkInfoViewDataMgr.setAddAdminRoleViewData(viewDataP);
  }

  /**
   * 组装数据
   * @param callback
   */
  public async buildViewData(callback:(viewDataP:AddAdminRoleViewData) => void){
    let viewDataTmp = new AddAdminRoleViewData();

    //请求storeClerkInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.storeClerkInfo = storeClerkInfo;
    callback(viewDataTmp);
  }

  /**
   * 新建岗位
   * @param viewData
   * @param callback
   */
  public addAdminRole(viewData:AddAdminRoleViewData,callback:(successP:boolean) => void){
    let storeId = SessionUtil.getInstance().getStoreId();
    let role = viewData.storeAdminRole;
    let roleIdIndex:number = parseInt(viewData.storeClerkInfo.roleIdIndex.toString());
    let idIndex = roleIdIndex+1;
    role.id = idIndex.toString();
    let permListTmp = AppUtils.addAll(viewData.managePermList,viewData.businessPermList);
    let permList = AppUtils.addAll(permListTmp,viewData.secrecyPermList);
    let permSet:Array<number> = [];
    for(let i=0;i<permList.length;i++){
      let permData = permList[i];
      if(permData.checked){
        permSet.push(permData.permItem.permNum);
      }
    }
    role.permSet = permSet;
    this.storeClerkInfoMgr.addStoreAdminRole(storeId,role).then((success) =>{
      callback(success);
    })
  }

}

export class AddAdminRoleViewData{
  public storeClerkInfo:StoreClerkInfo;
  public storeAdminRole:StoreAdminRole = new StoreAdminRole();
  public managePermList:Array<PermData>;
  public businessPermList:Array<PermData>;
  public dataPermList:Array<PermData>;
  public secrecyPermList:Array<PermData>;
  constructor(){
    this.managePermList = StorePermBuilder.buildPermList(AdminPermType.MANAGE);
    this.businessPermList = StorePermBuilder.buildPermList(AdminPermType.BUSINESS);
    this.dataPermList = StorePermBuilder.buildPermList(AdminPermType.DATA);
    this.secrecyPermList = StorePermBuilder.buildPermList(AdminPermType.SECRECY);
    //过滤仪器管理权限
    let vipLevel = SessionUtil.getInstance().getVipLevel();
    if(vipLevel != StoreVipLevelEnum.HonKonUser){
      this.managePermList = this.managePermList.filter((item)=>{
        if(item.permItem.permNum == StoreAdminPermEnum.DEVICE_ADMIN){
          return false;
        }else{
          return true;
        }
      })
    }
  }
}

