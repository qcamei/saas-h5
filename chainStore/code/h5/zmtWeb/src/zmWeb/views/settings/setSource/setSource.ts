import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef}from "@angular/core";

import {LeaguerOriginModalComp} from "../popup/LeaguerOriginModalComp";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {SettingsViewDataMgr} from "../SettingsViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {LeaguerOriginConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerOriginConfig";
import {LeaguerOriginOperationEnum} from "./leaguerOriginOperationEnum";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {LeaguerOriginRemoveForm} from "../../../bsModule/storeConfig/apiData/LeaguerOriginRemoveForm";
import {StoreConfigSynDataHolder} from "../../../bsModule/storeConfig/StoreConfigSynDataHolder";
import {Popup} from "../../common/popup/popup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**
 * 会员来源设置
 */
@Component({
  selector:"set-source",
  templateUrl:"setSource.html",
  styleUrls:['setSource.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class SetSourcePage implements OnInit,OnDestroy{

  private viewDataSub:any;
  private service:SetSourceService;
  public viewData:SetSourceViewData;

  constructor(
              private storeConfigMgr:StoreConfigMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private settingsViewDataMgr:SettingsViewDataMgr,
              private cdRef:ChangeDetectorRef,
              matDialog: MatDialog) {

      ZmModalMgr.getInstance().reset(matDialog);
      this.service = new SetSourceService(this.storeConfigMgr,this.storeConfigSynDataHolder,this.settingsViewDataMgr);
  }


  ngOnInit(): void {
    this.viewDataSub = this.settingsViewDataMgr.subscribeSetSourceVD((viewDataP:SetSourceViewData)=>{
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
   * 新建来源弹框
   */
  addOrigin() {
    if(!AppUtils.isNullObj(this.viewData.leaguerConfig)){
      // const activeModal = this.modalService.open(LeaguerOriginModalComp,{backdrop:'static'});
      const activeModal = ZmModalMgr.getInstance().newSmallModal(LeaguerOriginModalComp, null,null);
      activeModal.componentInstance.operation = LeaguerOriginOperationEnum.ADD;
      activeModal.componentInstance.leaguerConfig = this.viewData.leaguerConfig;
      activeModal.componentInstance.action = this.successCallback.bind(this);
    }else{
      AppUtils.showWarn("提示","加载失败");
    }
  }

  /**
   * 编辑来源弹框
   */
  editOrigin(leaguerOriginConfigP:LeaguerOriginConfig){
    // const activeModal = this.modalService.open(LeaguerOriginModalComp,{backdrop:'static'});
    const activeModal = ZmModalMgr.getInstance().newSmallModal(LeaguerOriginModalComp, null,null);
    activeModal.componentInstance.operation = LeaguerOriginOperationEnum.EDIT;
    activeModal.componentInstance.leaguerOriginConfig = leaguerOriginConfigP;
    activeModal.componentInstance.action = this.successCallback.bind(this);
  }

  /**
   * 新建、编辑成功回调
   */
  successCallback(){
    this.service.initViewData();
  }

  /**
   * 删除来源弹框
   */
  deleteOrigin(leaguerOriginConfig:LeaguerOriginConfig){
    Popup.getInstance().open("删除来源", "确定删除来源“"+leaguerOriginConfig.originName+"”?", () => {
      this.service.deleteLeaguerOrigin(leaguerOriginConfig.id).then((success:boolean)=>{
        if(success){
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
    let data = this.viewData.leaguerOriginMap.values();
    data.sort((a:LeaguerOriginConfig,b:LeaguerOriginConfig)=>{
      return parseInt(b.id) - parseInt(a.id);
    })
    this.viewData.leaguerOriginList = AppUtils.getPageData(curPage,data);
  }
}

export class SetSourceService{

  constructor(private storeConfigMgr:StoreConfigMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private settingsViewDataMgr:SettingsViewDataMgr){}

  public initViewData(){
    let viewDataTmp = new SetSourceViewData();
    this.settingsViewDataMgr.setSourceViewData(viewDataTmp)
    this.buildViewData((viewDataP:SetSourceViewData)=>{
      this.settingsViewDataMgr.setSourceViewData(viewDataP);
    })

  }

  public buildViewData(callback:(viewData:SetSourceViewData)=>void){
    let viewDataTmp = new SetSourceViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeConfigSynDataHolder.getData(storeId).then((storeConfig:StoreConfig)=>{
      if(!AppUtils.isNullObj(storeConfig)){
        if(!AppUtils.isNullObj(storeConfig.leaguerConfig.leaguerOriginConfigMap)){
          let leaguerConfigTmp = new LeaguerConfig();
          AppUtils.copy(leaguerConfigTmp,storeConfig.leaguerConfig)
          viewDataTmp.leaguerConfig = leaguerConfigTmp;
          viewDataTmp.leaguerOriginMap = leaguerConfigTmp.getLeaguerOriginMap();
          viewDataTmp.leaguerOriginList = viewDataTmp.leaguerOriginMap.values();
          viewDataTmp.leaguerOriginList.sort((a:LeaguerOriginConfig,b:LeaguerOriginConfig)=>{
            return parseInt(b.id) - parseInt(a.id);
          })
          viewDataTmp.page = 1;
          viewDataTmp.recordCount = viewDataTmp.leaguerOriginList.length;
        }
      }else{
        AppUtils.showError("提示","加载失败");
      }
      viewDataTmp.loadingFinish = true;
      callback(viewDataTmp);
    })
  }

  /**
   * 删除会员来源
   * @param leaguerOriginConfigId
   * @returns {Promise<boolean>}
   */
  public deleteLeaguerOrigin(leaguerOriginConfigId:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let leaguerOriginRemoveForm = new LeaguerOriginRemoveForm();
    leaguerOriginRemoveForm.id = leaguerOriginConfigId;
    return this.storeConfigMgr.removeLeaguerOrigin(storeId,leaguerOriginRemoveForm);
  }

}

export class SetSourceViewData{
  public leaguerConfig:LeaguerConfig;
  public leaguerOriginMap:ZmMap<LeaguerOriginConfig> = new ZmMap<LeaguerOriginConfig>();
  public leaguerOriginList:Array<LeaguerOriginConfig> = new Array<LeaguerOriginConfig>();

  public loadingFinish:boolean = false;
  public page:number;//当前页码
  public recordCount:number;//总记录数
}
