import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy}from "@angular/core";

import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {StoreConfigSynDataHolder} from "../../../bsModule/storeConfig/StoreConfigSynDataHolder";
import {SettingsViewDataMgr} from "../SettingsViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {LeaguerAttributeStateEnum} from "../../../bsModule/storeConfig/data/leaguer/LeaguerAttributeStateEnum";
import {RequiredEnum} from "../../../bsModule/storeConfig/data/leaguer/RequiredEnum";
import {BaseAttributeStatusForm} from "../../../bsModule/storeConfig/apiData/BaseAttributeStatusForm";
import {ExpandAttributeComp} from "./expandAttributeComp";
import {LeaguerExpandAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerExpandAttribute";
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {ExpandAttributeStatusForm} from "../../../bsModule/storeConfig/apiData/ExpandAttributeStatusForm";
import {ExpandAttributeItem, LeaguerAttributeItem, SetAttributeViewData} from "./setAttributeViewData";
import {ExpandAttributeSortForm} from "../../../bsModule/storeConfig/apiData/ExpandAttributeSortForm";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";

/**
 * 会员属性设置
 */
@Component({
  selector:"set-attribute",
  templateUrl:"setAttribute.html",
  styleUrls:['setAttribute.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class SetAttributePage implements OnInit,OnDestroy{

  private viewDataSub:any;
  private service:SetAttributeService;
  public viewData:SetAttributeViewData;

  constructor(
              private storeConfigMgr:StoreConfigMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private settingViewDataMgr:SettingsViewDataMgr,
              private cdRef:ChangeDetectorRef,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new SetAttributeService(this.storeConfigMgr,this.storeConfigSynDataHolder,this.settingViewDataMgr);
  }

  ngOnInit():void{
    this.viewDataSub = this.settingViewDataMgr.subscribeSetAttributeVD((viewDataP:SetAttributeViewData)=>{
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
   * 新建扩展属性弹框
   */
  addExpandAttribute() {
    if(!AppUtils.isNullObj(this.viewData.leaguerConfig)){
      // const activeModal = this.modalService.open(ExpandAttributeComp,{backdrop:'static'});
      const activeModal = ZmModalMgr.getInstance().newModal(ExpandAttributeComp, null,null);
      activeModal.componentInstance.operation = OperationEnum.ADD;
      activeModal.componentInstance.leaguerConfig = this.viewData.leaguerConfig;
      activeModal.componentInstance.action = this.successCallback.bind(this);
    }else{
      AppUtils.showWarn("提示","加载失败");
    }
  }

  /**
   * 编辑扩展属性弹框
   */
  editExpandAttribute(expandAttributeItem:ExpandAttributeItem) {
    // const activeModal = this.modalService.open(ExpandAttributeComp,{backdrop:'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(ExpandAttributeComp, null,null);
    activeModal.componentInstance.operation = OperationEnum.EDIT;
    activeModal.componentInstance.expandAttributeItem = expandAttributeItem;
    activeModal.componentInstance.action = this.successCallback.bind(this);
  }

  /**
   * 添加、修改成功回调
   */
  successCallback(){
    this.service.initViewData();
  }

  /**
   * 页面点击事件 设置基础属性启用、必填
   * @param leaguerAttributeItem
   */
  updateBaseAttribute(leaguerAttributeItem:LeaguerAttributeItem){
    let leaguerBaseAttribute = this.viewData.leaguerAttributeMap.get(leaguerAttributeItem.attributeName);
    if((parseInt(leaguerBaseAttribute.require.toString()) == RequiredEnum.Selection) && leaguerAttributeItem.require){//勾选必填
      leaguerAttributeItem.enable = true;
    }
    if((parseInt(leaguerBaseAttribute.status.toString()) == LeaguerAttributeStateEnum.Enable) && !leaguerAttributeItem.enable){//取消启用
      leaguerAttributeItem.require = false;
    }
    this.service.updateBaseAttribute(leaguerAttributeItem).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","设置成功");
        this.service.refreshViewData(this.viewData);
      }else{
        AppUtils.showError("提示","设置失败");
      }
    })
  }

  /**
   * 页面点击事件 设置扩展属性启用、必填
   * @param expandAttributeItem
   */
  setExpandAttributeStatus(expandAttributeItem:ExpandAttributeItem){
    let leaguerExpandAttribute = this.viewData.expandAttributeMap.get(expandAttributeItem.id);
    if((parseInt(leaguerExpandAttribute.require.toString()) == RequiredEnum.Selection) && expandAttributeItem.require){//勾选必填
      expandAttributeItem.enable = true;
    }
    if((parseInt(leaguerExpandAttribute.status.toString()) == LeaguerAttributeStateEnum.Enable) && !expandAttributeItem.enable){//取消启用
      expandAttributeItem.require = false;
    }
    this.service.setExpandAttributeStatus(expandAttributeItem).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","设置成功");
        this.service.refreshViewData(this.viewData);
      }else{
        AppUtils.showError("提示","设置失败");
      }
    })
  }

  /**
   * 扩展属性升降序
   * @param expandAttributeItem
   * @param direction
   */
  sortExpandAttribute(expandAttributeItem:ExpandAttributeItem,direction:number){
    this.service.sortExpandAttribute(expandAttributeItem.id,direction).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","设置成功");
        this.service.refreshViewData(this.viewData);
      }else{
        AppUtils.showError("提示","设置失败");
      }
    })
  }

}

export class SetAttributeService{
  constructor(private storeConfigMgr:StoreConfigMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private settingViewDataMgr:SettingsViewDataMgr){}

  public initViewData(){
    let viewDataTmp = new SetAttributeViewData();
    this.settingViewDataMgr.setAttributeViewData(viewDataTmp);

    this.buildViewData((viewData:SetAttributeViewData)=>{
      this.settingViewDataMgr.setAttributeViewData(viewData);
    })
  }

  private buildViewData(callback:(viewData:SetAttributeViewData)=>void){
    let viewData = new SetAttributeViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeConfigSynDataHolder.getData(storeId).then((storeConfig:StoreConfig)=>{
      if(!AppUtils.isNullObj(storeConfig)){
        let leaguerConfigTmp = new LeaguerConfig();
        AppUtils.copy(leaguerConfigTmp,storeConfig.leaguerConfig);
        viewData.leaguerConfig = leaguerConfigTmp;
        //基础属性
        viewData.leaguerAttributeMap = leaguerConfigTmp.getBaseAttributeMap();
        viewData.leaguerAttributeList = leaguerConfigTmp.leaguerBaseAttributes.map((item)=>{
          return LeaguerAttributeItem.formBaseAttribute(item);
        });
        //扩展属性
        viewData.expandAttributeMap = leaguerConfigTmp.getLeaguerExpandAttributeMap();
        viewData.expandAttributeList = viewData.expandAttributeMap.values().map((item:LeaguerExpandAttribute)=>{
          return ExpandAttributeItem.formExpandAttribute(item);
        });
        viewData.expandAttributeList.sort((a:ExpandAttributeItem,b:ExpandAttributeItem)=>{
          return a.sort - b.sort;
        });
      }else{
        AppUtils.showError("提示","加载失败");
      }
      callback(viewData);
    })
  }

  /**
   * 刷新页面数据
   * @param viewData
   * @returns {Promise<void>}
   */
  public refreshViewData(viewData:SetAttributeViewData){
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeConfigSynDataHolder.getData(storeId).then((storeConfig:StoreConfig)=>{
      if(!AppUtils.isNullObj(storeConfig)){
        let leaguerConfigTmp = new LeaguerConfig();
        AppUtils.copy(leaguerConfigTmp,storeConfig.leaguerConfig);
        viewData.leaguerConfig = leaguerConfigTmp;
        //基础属性
        viewData.leaguerAttributeMap = leaguerConfigTmp.getBaseAttributeMap();
        viewData.leaguerAttributeList = leaguerConfigTmp.leaguerBaseAttributes.map((item)=>{
          return LeaguerAttributeItem.formBaseAttribute(item);
        });
        //扩展属性
        viewData.expandAttributeMap = leaguerConfigTmp.getLeaguerExpandAttributeMap();
        viewData.expandAttributeList = viewData.expandAttributeMap.values().map((item:LeaguerExpandAttribute)=>{
          return ExpandAttributeItem.formExpandAttribute(item);
        });
        viewData.expandAttributeList.sort((a:ExpandAttributeItem,b:ExpandAttributeItem)=>{
          return a.sort - b.sort;
        });
      }else{
        AppUtils.showError("提示","加载失败");
      }
      this.settingViewDataMgr.setAttributeViewData(viewData);
    })
  }

  /**
   * 设置会员基础属性
   * @param leaguerAttributeItem
   * @returns {Promise<boolean>}
   */
  public updateBaseAttribute(leaguerAttributeItem:LeaguerAttributeItem):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let baseAttributeStatusForm = new BaseAttributeStatusForm();
    baseAttributeStatusForm.attributeName = leaguerAttributeItem.attributeName;
    baseAttributeStatusForm.status = leaguerAttributeItem.enable?LeaguerAttributeStateEnum.Enable:LeaguerAttributeStateEnum.Disable;
    baseAttributeStatusForm.require = leaguerAttributeItem.require?RequiredEnum.Required:RequiredEnum.Selection;
    return this.storeConfigMgr.updateBaseAttribute(storeId,baseAttributeStatusForm);
  }

  /**
   * 设置会员扩展属性
   * @param expandAttributeItem
   * @returns {Promise<boolean>}
   */
  public setExpandAttributeStatus(expandAttributeItem:ExpandAttributeItem):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let baseAttributeStatusForm = new ExpandAttributeStatusForm();
    baseAttributeStatusForm.id = expandAttributeItem.id;
    baseAttributeStatusForm.status = expandAttributeItem.enable?LeaguerAttributeStateEnum.Enable:LeaguerAttributeStateEnum.Disable;
    baseAttributeStatusForm.require = expandAttributeItem.require?RequiredEnum.Required:RequiredEnum.Selection;
    return this.storeConfigMgr.setExpandAttributeStatus(storeId,baseAttributeStatusForm);
  }

  /**
   * 扩展属性升降序
   * @param expandAttributeItem
   * @returns {Promise<boolean>}
   */
  public sortExpandAttribute(id:string,direction:number):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let baseAttributeStatusForm = new ExpandAttributeSortForm();
    baseAttributeStatusForm.id = id;
    baseAttributeStatusForm.sort = direction;
    return this.storeConfigMgr.sortExpandAttribute(storeId,baseAttributeStatusForm);
  }

}
