import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {StoreClerkInfoViewDataMgr} from "../StoreClerkInfoViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {StorePermBuilder,
  StoreAdminPermEnum, AdminPermType, PermData
} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminPermEnum";
import {StoreVipLevelEnum} from "../../../bsModule/buser/data/StoreVipLevelEnum";

/**
 * 店员管理 编辑岗位
 */
@Component({
  selector:'edit-admin-role',
  templateUrl:'editAdminRole.html',
  styleUrls:['editAdminRole.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class EditAdminRolePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramSub: any;
  private service: EditAdminRoleService;
  public viewData: EditAdminRoleViewData;

  constructor(private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private route:ActivatedRoute){
    this.service = new EditAdminRoleService(this.storeClerkInfoMgr,this.storeClerkInfoSynDataHolder,this.storeClerkInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeClerkInfoViewDataMgr.subscribeEditAdminRoleVD((viewDataP:EditAdminRoleViewData) => {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      })
    this.paramSub = this.route.params.subscribe(params =>{
      let roleId = params['roleId'];
      if(roleId){
        this.service.initViewData(roleId);
      }
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 编辑岗位信息 页面点击事件
   */
  updateAdminRole(){
    this.viewData.role.name = AppUtils.trimBlank(this.viewData.role.name);
    if(!AppUtils.isNullOrWhiteSpace(this.viewData.role.name)){
      if(!this.checkHasRoleName()){
        this.service.updateAdminRole(this.viewData,(successP:boolean) =>{
          if(successP){
            AppUtils.showSuccess("提示","保存成功");
            // MainViewDataMgr.getInstance().notifyDataChanged();//修改为只有老板才能编辑 不需要通知权限刷新
            AppRouter.goManageRole();
          }else{
            AppUtils.showError("提示","保存失败");
          }
        })
      }else{
        AppUtils.showWarn("提示","岗位名称重复");
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
    let roleMap = this.viewData.roleMap;
    let roleList = roleMap.values();
    let count:number = 0;
    roleList.forEach((item) => {
      if (item.name == this.viewData.role.name) {
        count ++;
      }
    })
    if(count > 1){
      return true;
    }else{
      return false;
    }
  }

}

export class EditAdminRoleService{
  constructor(private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr){}

  public initViewData(roleId):void{
    let viewDataTmp = new EditAdminRoleViewData();
    this.storeClerkInfoViewDataMgr.setEditAdminRoleViewData(viewDataTmp);

    this.buildViewData(roleId,(viewDataP:EditAdminRoleViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.storeClerkInfoViewDataMgr.setEditAdminRoleViewData(viewDataP);
  }

  /**
   * 组装数据
   * @param callback
   */
  public async buildViewData(roleId,callback:(viewDataP:EditAdminRoleViewData) => void){
    let viewDataTmp = new EditAdminRoleViewData();
    //请求storeClerkInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.roleMap = storeClerkInfo.getRoleMap();
    viewDataTmp.role = viewDataTmp.roleMap.get(roleId);
    //遍历设置是否选中
    let permSet = [];
    if(viewDataTmp.role && viewDataTmp.role.permSet){
      permSet = viewDataTmp.role.permSet;
    }
    viewDataTmp.managePermList.forEach((item)=>{
      if(AppUtils.arrayContains(permSet,item.permItem.permNum.toString())){
        item.checked = true;
      }
    });
    viewDataTmp.businessPermList.forEach((item)=>{
      if(AppUtils.arrayContains(permSet,item.permItem.permNum.toString())){
        item.checked = true;
      }
    });
    viewDataTmp.secrecyPermList.forEach((item)=>{
      if(AppUtils.arrayContains(permSet,item.permItem.permNum.toString())){
        item.checked = true;
      }
    });
    callback(viewDataTmp);
  }

  /**
   * 编辑岗位
   * @param viewData
   * @param callback
   */
  public updateAdminRole(viewData:EditAdminRoleViewData,callback:(successP:boolean) => void){
    let storeId = SessionUtil.getInstance().getStoreId();
    let permListTmp = AppUtils.addAll(viewData.managePermList,viewData.businessPermList);
    let permList = AppUtils.addAll(permListTmp,viewData.secrecyPermList);
    let permSet:Array<number> = [];
    for(let i=0;i<permList.length;i++){
      let editPermData = permList[i];
      if(editPermData.checked){
        permSet.push(editPermData.permItem.permNum);
      }
    }
    viewData.role.permSet = permSet;
    this.storeClerkInfoMgr.updateStoreAdminRole(storeId,viewData.role).then((success) =>{
      callback(success);
    })
  }

}

export class EditAdminRoleViewData{
  public roleMap:ZmMap<StoreAdminRole>;
  //页面数据
  public role:StoreAdminRole = new StoreAdminRole();
  //权限列表
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

