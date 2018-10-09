

import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ChainClerkMgr} from "../../../bsModule/chainClerk/ChainClerkMgr";
import {ChainClerkSynDataHolder} from "../../../bsModule/chainClerk/ChainClerkSynDataHolder";
import {ChainClerkViewDataMgr} from "../ChainClerkViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppRouter} from "../../../comModule/AppRouter";
import {Popup} from "../../common/popup/popup";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChainClerk} from "../../../bsModule/chainClerk/data/ChainClerk";
import {AdminRole} from "../../../bsModule/chainClerk/data/adminRole/AdminRole";
/**
 * 店员管理 岗位管理
 */
@Component({
  selector:'manage-role',
  templateUrl:'manageRole.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class ManageRolePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: ManageRoleService;
  public viewData: ManageRoleViewData;

  constructor(private chainClerkMgr:ChainClerkMgr,
              private chainClerkSynDataHolder:ChainClerkSynDataHolder,
              private chainClerkViewDataMgr:ChainClerkViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new ManageRoleService(this.chainClerkMgr,this.chainClerkSynDataHolder,this.chainClerkViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chainClerkViewDataMgr.subscribeManageRoleVD((viewDataP:ManageRoleViewData) => {
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
   * 跳转新建岗位 页面点击事件
   */
  goAddAdminRole(){
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
    Popup.getInstance().open("删除岗位","确定删除#"+role.name+"#？",() =>{
      this.service.deleteAdminRole(role.id,(successP:boolean) =>{
        if(successP){
          AppUtils.showSuccess("提示","删除成功");
          this.service.initViewData();
        }else{
          AppUtils.showError("提示","删除失败");
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
  constructor(private chainClerkMgr:ChainClerkMgr,
              private chainClerkSynDataHolder:ChainClerkSynDataHolder,
              private chainClerkViewDataMgr:ChainClerkViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new ManageRoleViewData();
    this.chainClerkViewDataMgr.setManageRoleViewData(viewDataTmp);

    this.buildViewData((viewDataP:ManageRoleViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.chainClerkViewDataMgr.setManageRoleViewData(viewDataP);
  }

  /**
   * 组装数据
   * @param callback
   */
  public async buildViewData(callback:(viewDataP:ManageRoleViewData) => void){
    let viewDataTmp = new ManageRoleViewData();
    //请求chainClerk
    let chainId = SessionUtil.getInstance().getChainId();
    let chainClerk:ChainClerk = await this.chainClerkSynDataHolder.getData(chainId);
    viewDataTmp.roleMap = chainClerk.getEditRoleMap();

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
  public deleteAdminRole(roleId,callback:(successP:boolean) => void){
    let chainId = SessionUtil.getInstance().getChainId();
    this.chainClerkMgr.removeAdminRole(chainId,roleId).then((success) =>{
      callback(success);
    })
  }

}

export class ManageRoleViewData{
  public chainClerk:ChainClerk = new ChainClerk();
  public roleMap:ZmMap<AdminRole>;
  //页面显示数据
  public roleList:Array<AdminRole>;

  public page:number;//当前页码
  public recordCount:number;//总记录数
  public loadingFinish :boolean = false;
}
