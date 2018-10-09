import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ChainClerkMgr} from "../../../bsModule/chainClerk/ChainClerkMgr";
import {ChainClerkSynDataHolder} from "../../../bsModule/chainClerk/ChainClerkSynDataHolder";
import {ChainClerkViewDataMgr} from "../ChainClerkViewDataMgr";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppRouter} from "../../../comModule/AppRouter";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AdminRole} from "../../../bsModule/chainClerk/data/adminRole/AdminRole";
import {PermData, StorePermBuilder, AdminPermType} from "../../../bsModule/chainClerk/data/adminRole/AdminPermEnum";

/**
 * 总店员工管理 编辑岗位
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

  constructor(private chainClerkMgr:ChainClerkMgr,
              private chainClerkSynDataHolder:ChainClerkSynDataHolder,
              private chainClerkViewDataMgr:ChainClerkViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private route:ActivatedRoute){
    this.service = new EditAdminRoleService(this.chainClerkMgr,this.chainClerkSynDataHolder,this.chainClerkViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chainClerkViewDataMgr.subscribeEditAdminRoleVD((viewDataP:EditAdminRoleViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
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
    });
    if(count > 1){
      return true;
    }else{
      return false;
    }
  }

}

export class EditAdminRoleService{
  constructor(private chainClerkMgr:ChainClerkMgr,
              private chainClerkSynDataHolder:ChainClerkSynDataHolder,
              private chainClerkViewDataMgr:ChainClerkViewDataMgr){}

  public initViewData(roleId):void{
    let viewDataTmp = new EditAdminRoleViewData();
    this.chainClerkViewDataMgr.setEditAdminRoleViewData(viewDataTmp);

    this.buildViewData(roleId,(viewDataP:EditAdminRoleViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.chainClerkViewDataMgr.setEditAdminRoleViewData(viewDataP);
  }

  /**
   * 组装数据
   * @param callback
   */
  public async buildViewData(roleId,callback:(viewDataP:EditAdminRoleViewData) => void){
    let viewDataTmp = new EditAdminRoleViewData();
    //请求chainClerk
    let chainId = SessionUtil.getInstance().getChainId();
    let chainClerk = await this.chainClerkSynDataHolder.getData(chainId);
    viewDataTmp.roleMap = chainClerk.getRoleMap();
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
    // viewDataTmp.businessPermList.forEach((item)=>{
    //   if(AppUtils.arrayContains(permSet,item.permItem.permNum.toString())){
    //     item.checked = true;
    //   }
    // });
    // viewDataTmp.secrecyPermList.forEach((item)=>{
    //   if(AppUtils.arrayContains(permSet,item.permItem.permNum.toString())){
    //     item.checked = true;
    //   }
    // });
    callback(viewDataTmp);
  }

  /**
   * 编辑岗位
   * @param viewData
   * @param callback
   */
  public updateAdminRole(viewData:EditAdminRoleViewData,callback:(successP:boolean) => void){
    let chainId = SessionUtil.getInstance().getChainId();
    let permList = viewData.managePermList;
    // let permListTmp = AppUtils.addAll(viewData.managePermList,viewData.businessPermList);
    // let permList = AppUtils.addAll(permListTmp,viewData.secrecyPermList);
    let permSet:Array<number> = [];
    for(let i=0;i<permList.length;i++){
      let editPermData = permList[i];
      if(editPermData.checked){
        permSet.push(editPermData.permItem.permNum);
      }
    }
    viewData.role.permSet = permSet;
    this.chainClerkMgr.updateAdminRole(chainId,viewData.role).then((success) =>{
      callback(success);
    })
  }

}

export class EditAdminRoleViewData{
  public roleMap:ZmMap<AdminRole>;
  //页面数据
  public role:AdminRole = new AdminRole();
  //权限列表
  public managePermList:Array<PermData>;
  // public businessPermList:Array<PermData>;
  // public secrecyPermList:Array<PermData>;
  constructor(){
    this.managePermList = StorePermBuilder.buildPermList(AdminPermType.MANAGE);
    // this.businessPermList = StorePermBuilder.buildPermList(AdminPermType.BUSINESS);
    // this.secrecyPermList = StorePermBuilder.buildPermList(AdminPermType.SECRECY);
  }
}

