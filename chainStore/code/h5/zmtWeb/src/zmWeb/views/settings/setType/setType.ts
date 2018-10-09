import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef}from "@angular/core";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {StoreConfigSynDataHolder} from "../../../bsModule/storeConfig/StoreConfigSynDataHolder";
import {SettingsViewDataMgr} from "../SettingsViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {LeaguerTypeConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerTypeConfig";
import {LeaguerTypeUpdateForm} from "../../../bsModule/storeConfig/apiData/LeaguerTypeUpdateForm";
import {AppRouter} from "../../../comModule/AppRouter";
import {LeaguerAnalysisConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerAnalysisConfig";
import {SysInitLeaguerAnalysisEnum} from "../../../bsModule/storeConfig/data/leaguer/SysInitLeaguerAnalysisEnum";
import {LeaguerAnalysisUpdateForm} from "../../../bsModule/storeConfig/apiData/LeaguerAnalysisUpdateForm";

/**
 * 类型设置
 */
@Component({
  selector:"set-type",
  templateUrl:"setType.html",
  styleUrls:['setType.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class SetTypePage implements OnInit,OnDestroy{

  private viewDataSub:any;
  private service:SetTypeService;
  public viewData:SetTypeViewData;

  constructor(private storeConfigMgr:StoreConfigMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private settingViewDataMgr:SettingsViewDataMgr,
              private cdRef:ChangeDetectorRef){
    this.service = new SetTypeService(this.storeConfigMgr,this.storeConfigSynDataHolder,this.settingViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.settingViewDataMgr.subscribeSetTypeVD((viewDataP:SetTypeViewData)=>{
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
   * 保存按钮点击事件
   */
  updateLeaguerType(){
    if(AppUtils.isNullObj(this.viewData.highGrade)
      || AppUtils.isNullObj(this.viewData.risk)
      || AppUtils.isNullObj(this.viewData.quiescence)
      || AppUtils.isNullObj(this.viewData.productCardExpiredThreshold)
      || AppUtils.isNullObj(this.viewData.memberCardExpiredThreshold)
      || AppUtils.isNullObj(this.viewData.memberCardBalanceThreshold)){
      AppUtils.showWarn("提示","请检查输入");
    }else if(this.viewData.highGrade<0
      || this.viewData.risk<0
      || this.viewData.quiescence<0
      || this.viewData.productCardExpiredThreshold<0
      || this.viewData.memberCardExpiredThreshold<0
      || this.viewData.memberCardBalanceThreshold<0){
      AppUtils.showWarn("提示","请检查输入");
    }else if(this.viewData.risk >= this.viewData.quiescence){
      AppUtils.showWarn("提示","静止会员的阈值需大于风险流失会员的阈值");
    }else{
      this.viewData.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.HIGH_GRADE_CUSTOMER+1).toString()).threshold = parseInt(this.viewData.highGrade.toString());
      this.viewData.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.RISK_CUSTOMER+1).toString()).threshold = parseInt(this.viewData.risk.toString());
      this.viewData.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.QUIESCENCE_CUSTOMER+1).toString()).threshold = parseInt(this.viewData.quiescence.toString());
      this.viewData.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.PRODUCTCARD_EXPIRED_THRESHOLD+1).toString()).threshold = parseInt(this.viewData.productCardExpiredThreshold.toString());
      this.viewData.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.MEMBERCARD_EXPIRED_THRESHOLD+1).toString()).threshold = parseInt(this.viewData.memberCardExpiredThreshold.toString());
      this.viewData.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.MEMBERCARD_BALANCE_THRESHOLD+1).toString()).threshold = parseInt(this.viewData.memberCardBalanceThreshold.toString());

      this.service.updateLeaguerType(this.viewData.leaguerAnalysisMap).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","保存成功");
          AppRouter.goSettinig();
        }else{
          AppUtils.showError("提示","保存失败");
        }
      })
    }
  }

}

export class SetTypeService{
  constructor(private storeConfigMgr:StoreConfigMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private settingViewDataMgr:SettingsViewDataMgr){}

  public initViewData(){
    let viewDataTmp = new SetTypeViewData();
    this.settingViewDataMgr.setTypeViewData(viewDataTmp);

    this.buildViewData((viewData:SetTypeViewData)=>{
      this.settingViewDataMgr.setTypeViewData(viewData);
    })
  }

  public buildViewData(callback:(viewData:SetTypeViewData)=>void){
    let viewDataTmp = new SetTypeViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeConfigSynDataHolder.getData(storeId).then((storeConfig:StoreConfig)=>{
      if(!AppUtils.isNullObj(storeConfig)){
        if(!AppUtils.isNullObj(storeConfig.leaguerConfig.leaguerOriginConfigMap)){
          let leaguerConfigTmp = new LeaguerConfig();
          AppUtils.copy(leaguerConfigTmp,storeConfig.leaguerConfig)
          viewDataTmp.leaguerConfig = leaguerConfigTmp;
          viewDataTmp.leaguerAnalysisMap = leaguerConfigTmp.getLeaguerAnalysisMap();
          viewDataTmp.highGrade = viewDataTmp.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.HIGH_GRADE_CUSTOMER+1).toString()).threshold;
          viewDataTmp.risk = viewDataTmp.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.RISK_CUSTOMER+1).toString()).threshold;
          viewDataTmp.quiescence = viewDataTmp.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.QUIESCENCE_CUSTOMER+1).toString()).threshold;
          viewDataTmp.productCardExpiredThreshold = viewDataTmp.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.PRODUCTCARD_EXPIRED_THRESHOLD+1).toString()).threshold;
          viewDataTmp.memberCardExpiredThreshold = viewDataTmp.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.MEMBERCARD_EXPIRED_THRESHOLD+1).toString()).threshold;
          viewDataTmp.memberCardBalanceThreshold = viewDataTmp.leaguerAnalysisMap.get((SysInitLeaguerAnalysisEnum.MEMBERCARD_BALANCE_THRESHOLD+1).toString()).threshold;
        }
      }else{
        AppUtils.showError("提示","加载失败");
      }
      callback(viewDataTmp);
    })
  }

  /**
   * 设置会员类型
   * @param leaguerAnalysisMapP
   * @returns {Promise<boolean>}
   */
  public updateLeaguerType(leaguerAnalysisMapP:ZmMap<LeaguerAnalysisConfig>):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let leaguerAnalysisConfigMap = {};
    leaguerAnalysisMapP.values().forEach((item:LeaguerAnalysisConfig) =>{
      leaguerAnalysisConfigMap[item.id] = item;
    })
    let leaguerAnalysisUpdateForm = new LeaguerAnalysisUpdateForm();
    leaguerAnalysisUpdateForm.leaguerAnalysisConfigMap = leaguerAnalysisConfigMap;
    return this.storeConfigMgr.updateLeaguerAnalysis(storeId,leaguerAnalysisUpdateForm);
  }

}

export class SetTypeViewData{
  public leaguerConfig:LeaguerConfig;
  public leaguerAnalysisMap:ZmMap<LeaguerAnalysisConfig> = new ZmMap<LeaguerAnalysisConfig>();
  public highGrade:number;//优质客限制天数
  public risk:number;//风险客限制天数
  public quiescence:number;//静止客限制天数
  public productCardExpiredThreshold: number;//次卡即将过期阈值
  public memberCardExpiredThreshold: number;//会员卡即将过期阈值
  public memberCardBalanceThreshold: number;//会员卡余额不足阈值

}
