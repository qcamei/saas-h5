import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ChainClerkMgr} from "../../../bsModule/chainClerk/ChainClerkMgr";
import {ChainClerkSynDataHolder} from "../../../bsModule/chainClerk/ChainClerkSynDataHolder";
import {ChainClerkViewDataMgr} from "../ChainClerkViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {AppRouter} from "../../../comModule/AppRouter";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChainClerk} from "../../../bsModule/chainClerk/data/ChainClerk";
import {AdminRole} from "../../../bsModule/chainClerk/data/adminRole/AdminRole";
import {PermData, StorePermBuilder, AdminPermType} from "../../../bsModule/chainClerk/data/adminRole/AdminPermEnum";
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

  constructor(private chainClerkMgr:ChainClerkMgr,
              private chainClerkSynDataHolder:ChainClerkSynDataHolder,
              private chainClerkViewDataMgr:ChainClerkViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new AddAdminRoleService(this.chainClerkMgr,this.chainClerkSynDataHolder,this.chainClerkViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chainClerkViewDataMgr.subscribeAddAdminRoleVD((viewDataP:AddAdminRoleViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
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
  public addAdminRole(){
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
    let roleMap = this.viewData.chainClerk.getRoleMap();
    let roleList = roleMap.values();
    let has: boolean = false;
    roleList.forEach((item) => {
      if (item.name == this.viewData.storeAdminRole.name) {
        has = true;
        return;
      }
    });
    return has;
  }

}

export class AddAdminRoleService{
  constructor(private chainClerkMgr:ChainClerkMgr,
              private chainClerkSynDataHolder:ChainClerkSynDataHolder,
              private chainClerkViewDataMgr:ChainClerkViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new AddAdminRoleViewData();
    this.chainClerkViewDataMgr.setAddAdminRoleViewData(viewDataTmp);

    this.buildViewData((viewDataP:AddAdminRoleViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.chainClerkViewDataMgr.setAddAdminRoleViewData(viewDataP);
  }

  /**
   * 组装数据
   * @param callback
   */
  public async buildViewData(callback:(viewDataP:AddAdminRoleViewData) => void){
    let viewDataTmp = new AddAdminRoleViewData();

    //请求chainClerk
    let chainId = SessionUtil.getInstance().getChainId();
    let chainClerk = await this.chainClerkSynDataHolder.getData(chainId);
    viewDataTmp.chainClerk = chainClerk;
    callback(viewDataTmp);
  }

  /**
   * 新建岗位
   * @param viewData
   * @param callback
   */
  public addAdminRole(viewData:AddAdminRoleViewData,callback:(successP:boolean) => void){
    let chainId = SessionUtil.getInstance().getChainId();
    let role = viewData.storeAdminRole;
    let roleIdIndex:number = parseInt(viewData.chainClerk.roleIdIndex.toString());
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
    this.chainClerkMgr.addAdminRole(chainId,role).then((success) =>{
      callback(success);
    })
  }

}

export class AddAdminRoleViewData{
  public chainClerk:ChainClerk;
  public storeAdminRole:AdminRole = new AdminRole();
  public managePermList:Array<PermData>;
  public businessPermList:Array<PermData>;
  public secrecyPermList:Array<PermData>;
  constructor(){
    this.managePermList = StorePermBuilder.buildPermList(AdminPermType.MANAGE);
    this.businessPermList = StorePermBuilder.buildPermList(AdminPermType.BUSINESS);
    this.secrecyPermList = StorePermBuilder.buildPermList(AdminPermType.SECRECY);
  }
}

