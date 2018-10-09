import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {StoreClerkInfoViewDataMgr} from "../StoreClerkInfoViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreAdminRoleState} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRoleState";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {Popup} from "../../common/popup/popup";

/**
 * 店员管理 岗位管理
 */
@Component({
  selector:'manage-role',
  templateUrl:'manageRole.html',
  styleUrls:['manageRole.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class ManageRolePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: ManageRoleService;
  public viewData: ManageRoleViewData;

  constructor(private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new ManageRoleService(this.storeClerkInfoMgr,this.storeClerkInfoSynDataHolder,this.storeClerkInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeClerkInfoViewDataMgr.subscribeManageRoleVD((viewDataP:ManageRoleViewData) => {
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
   * 跳转新建岗位 页面点击事件
   */
  goAddStoreAdminRole(){
    AppRouter.goAddAdminRole();
  }

  /**
   * 跳转编辑岗位 页面点击事件
   */
  goEditAdminRole(roleId){
    AppRouter.goEditAdminRole(roleId);
  }

  /**
   * 删除岗位
   */
  deleteAdminRole(role){
    Popup.getInstance().open("删除岗位","确定删除"+role.name+"？",() =>{
      this.service.deleteAdminRole(this.viewData,role.id,(successP:boolean) =>{
        if(successP){
          AppUtils.showSuccess("提示","删除成功");
          this.service.initViewData();
        }else{
          AppUtils.showSuccess("提示","删除失败");
        }
      })
    })
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    let data = this.viewData.roleMap.values();
    let  pageData = AppUtils.getPageData(curPage,data);
    this.viewData.roleList = pageData;
  }

}

export class ManageRoleService{
  constructor(private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new ManageRoleViewData();
    this.storeClerkInfoViewDataMgr.setManageRoleViewData(viewDataTmp);

    this.buildViewData((viewDataP:ManageRoleViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.storeClerkInfoViewDataMgr.setManageRoleViewData(viewDataP);
  }

  /**
   * 组装数据
   * @param callback
   */
  public async buildViewData(callback:(viewDataP:ManageRoleViewData) => void){
    let viewDataTmp = new ManageRoleViewData();
    //请求storeClerkInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.roleMap = storeClerkInfo.getEditRoleMap();

    viewDataTmp.page = 1;
    viewDataTmp.recordCount = viewDataTmp.roleMap.values().length;
    viewDataTmp.roleList = AppUtils.getPageData(1,viewDataTmp.roleMap.values());
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  /**
   * 删除岗位
   * @param viewData
   * @param roleId
   * @param callback
   */
  public deleteAdminRole(viewData,roleId,callback:(successP:boolean) => void){
    let storeId = SessionUtil.getInstance().getStoreId();
    let roleMap = viewData.roleMap;
    let storeAdminRole = roleMap.get(roleId);
    storeAdminRole.state = StoreAdminRoleState.Delete;
    this.storeClerkInfoMgr.updateStoreAdminRole(storeId,storeAdminRole).then((success) =>{
      callback(success);
    })
  }

}

export class ManageRoleViewData{
  public storeClerkInfo:StoreClerkInfo = new StoreClerkInfo();
  public roleMap:ZmMap<StoreAdminRole>;
  //页面显示数据
  public roleList:Array<StoreAdminRole>;

  public page:number;//当前页码
  public recordCount:number;//总记录数
  public loadingFinish :boolean = false;
}
