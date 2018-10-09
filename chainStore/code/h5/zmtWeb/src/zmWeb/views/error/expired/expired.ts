import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";
import {Constants} from "../../common/Util/Constants";
import {AppRouter} from "../../../comModule/AppRouter";
import {ErrorViewDataMgr} from "../errorViewDataMgr";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";

/**
 * 会员过期异常页面
 */
@Component({
  selector:'expired',
  templateUrl:'expired.html',
  styleUrls: ['expired.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpiredPage implements OnInit,OnDestroy{
  constructor(private bUserSynDataHolder: BUserSynDataHolder,
              private storeSynDataHolder: StoreSynDataHolder,
              private errorViewDataMgr:ErrorViewDataMgr,
              private cdRef: ChangeDetectorRef) {
    this.service = new ExpiredService(this.bUserSynDataHolder,this.storeSynDataHolder,this.errorViewDataMgr);
  }
  public viewDataSub:any;
  public dataChangeSub:any;
  private service: ExpiredService;
  public viewData:ExpiredViewData;

  ngOnInit(){
    this.viewDataSub = this.errorViewDataMgr.subscribeExpiredVD((viewDataP:ExpiredViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.dataChangeSub = this.errorViewDataMgr.subscribeExpiredDataChanged(() =>{
      this.service.initViewData();
    });

    this.service.initViewData();

  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    if(!AppUtils.isNullObj(this.dataChangeSub)){
      this.dataChangeSub.unsubscribe();
    }
  }

  /**
   * 页面点击事件 咨询客服
   */
  contact(){
    // window.open('http://wpa.qq.com/msgrd?v=3&amp;uin=2101452905&amp;site=qq&amp;menu=yes');
    window.open('http://wpa.qq.com/msgrd?v=3&uin=2101452905&site=qq&menu=yes');
  }

  /**
   * 跳转续费升级页面
   */
  goVipCharge(){
    AppRouter.goVipCharge();
  }

  /**
   * 页面点击事件 确定跳转首页
   */
  public goHome(){
    AppRouter.goHome();
  }

  /**
   * 页面点击事件 暂无店铺确定跳转开店页面
   */
  public goBossAddStore(){
    AppRouter.goBossAddStore();
  }

}


class ExpiredService {

  constructor(private bUserSynDataHolder: BUserSynDataHolder,
              private storeSynDataHolder: StoreSynDataHolder,
              private errorViewDataMgr:ErrorViewDataMgr) {
  }

  public async initViewData(){
    let viewDataTmp = new ExpiredViewData();
    this.errorViewDataMgr.setExpiredViewData(viewDataTmp);
    this.buildViewData((viewData:ExpiredViewData) =>{
      this.handleViewData(viewData);
     });
  }

  private handleViewData(viewData:ExpiredViewData){
    this.errorViewDataMgr.setExpiredViewData(viewData);
  }

  private async buildViewData(callback:(viewDataTmp: ExpiredViewData) =>void) {
    let viewDataTmp = new ExpiredViewData();
    let userId = SessionUtil.getInstance().getUserId();
    let buser = await this.bUserSynDataHolder.getData(userId);
    let storeId = SessionUtil.getInstance().getStoreId();
    let nextMonthTime = new Date().getTime() + Constants.ONEDAY_TIMESTAMP*30;

    if (buser && buser.storeIdSet && buser.storeIdSet.length > 0 && !AppUtils.isNullOrWhiteSpace(storeId)){//有店
      let store = await this.storeSynDataHolder.getData(storeId);
      let boss = await this.bUserSynDataHolder.getData(store.bossId);
      if(boss && boss.id == userId){//老板
        if(boss.expiredTime && boss.expiredTime > nextMonthTime){
          AppRouter.goHome();
        }else{
          if (boss.expiredTime && boss.expiredTime <= this.getMinTime(new Date())) {//已过期
            viewDataTmp.showPage = 1;//老板已过期页面
            viewDataTmp.isExpired = true;
          } else {//快过期
            viewDataTmp.expiredDay = AppUtils.roundPoint((buser.expiredTime - this.getMinTime(new Date())) / Constants.ONEDAY_TIMESTAMP, 0);
            viewDataTmp.showPage = 2;//老板快过期提醒页面
          }
        }
      }else{//员工
        if(boss && boss.expiredTime && boss.expiredTime > nextMonthTime){
          AppRouter.goHome();
        }else{
          if (boss && boss.expiredTime && boss.expiredTime <= this.getMinTime(new Date())) {//工作者已过期
            viewDataTmp.showPage = 3;//工作者已过期页面
            viewDataTmp.isExpired = true;
          } else {//工作者快过期
            viewDataTmp.expiredDay = AppUtils.roundPoint((boss && boss.expiredTime - this.getMinTime(new Date())) / Constants.ONEDAY_TIMESTAMP, 0);
            viewDataTmp.showPage = 4;//工作者快过期提醒页面
          }
        }
      }
    }else{//无店铺 没有店铺的员工不会进入该页面
      if(buser.roleSet && AppUtils.arrayContains(buser.roleSet, "2")){//未选定角色状态
        viewDataTmp.showPage = 0;//请开通会员服务,咨询客服页面
        viewDataTmp.isExpired = true;
      }else if(buser.roleSet && AppUtils.arrayContains(buser.roleSet, "0")){//老板
        if(buser.expiredTime && buser.expiredTime > nextMonthTime){
          AppRouter.goBossAddStore();
        }else{
          if (buser.expiredTime && buser.expiredTime <= this.getMinTime(new Date())) {//已过期
            if (buser.expiredTime == 0) {
              viewDataTmp.showPage = 0;//请开通会员服务,咨询客服页面
            } else {
              viewDataTmp.showPage = 1;//老板已过期页面
            }
            viewDataTmp.isExpired = true;
          } else {//快过期
            viewDataTmp.expiredDay = AppUtils.roundPoint((buser.expiredTime - this.getMinTime(new Date())) / Constants.ONEDAY_TIMESTAMP, 0);
            viewDataTmp.showPage = 5;//老板快过期提醒页面
          }
        }
      }
    }

    callback(viewDataTmp);
  }

  /**
   * 获取一天零时的时间
   * @param dateP
   * @returns {number}
   */
  private getMinTime(dateP:Date): number {
    let arrTmp = [dateP.getFullYear(), dateP.getMonth()+1, dateP.getDate()];
    let date = new Date(arrTmp.join("/") + " 00:00:00");
    return date.getTime();
  }

}


export class ExpiredViewData {
  public showPage:number = -1;
  public expiredDay:number = 29;
  public isExpired: boolean = false;//是否过期
}
