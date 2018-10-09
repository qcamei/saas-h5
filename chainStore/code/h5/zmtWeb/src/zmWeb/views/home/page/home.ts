import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppRouter} from "../../../comModule/AppRouter";
import {HomeViewDataMgr} from "../HomeViewDataMgr";
import {UserPermData} from "../../../comModule/session/SessionData";
import {AddLeaguerFromPageFlag} from "../../../comModule/enum/AddLeaguerFromPageFlag";

/**
 * 首页
 */
@Component({
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomePage implements OnInit,OnDestroy {

  private service: HomeService;
  public viewData: HomeViewData;


  constructor(
              private cdRef: ChangeDetectorRef){
    this.service = new HomeService();
  }

  private isInited:boolean = false;
  ngOnInit(): void {

    HomeViewDataMgr.getInstance().onDataChanged(new HomeViewData(),(viewDataTmp: HomeViewData) =>{
      this.viewData = viewDataTmp;
      this.cdRef.markForCheck();
    });
    //切换店铺刷新首页
    HomeViewDataMgr.getInstance().onInformDataChanged(() =>{
      this.service.initViewData();
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(this.isInited){
      HomeViewDataMgr.getInstance().onViewDestroy();
    }

  }

  /**开单收银*/
  turnToAddPurchase() {
    if (this.viewData.buserPermData.isPurchaseAdmin == false) {
      AppUtils.showWarn("提示", "抱歉,您没有该权限");
    } else {
      AppRouter.goConsume(0);
    }
  }

  /**会员充值*/
  turnToAddRecharge() {
    if (this.viewData.buserPermData.isRechargeAdmin == false) {
      AppUtils.showWarn("提示", "抱歉,您没有该权限");
    } else {
      AppRouter.goRecharge(0);
    }

  }

  /**新增会员*/
  turnToAddLeaguer() {
    if (this.viewData.buserPermData.isLeaguerAdmin == false) {
      AppUtils.showWarn("提示", "抱歉,您没有该权限");
    } else {
      AppRouter.goAddLeaguer(AddLeaguerFromPageFlag.FROM_MANAGE_MODULE);
    }

  }

  /**新增预约*/
  turnToAddAppoint() {
    if (this.viewData.buserPermData.isAppointmentAdmin == false) {
      AppUtils.showWarn("提示", "抱歉,您没有该权限");
    } else {
      AppRouter.goAddAppointment();
    }

  }

}

export class HomeViewData {
  storeId:string;
  buserPermData:UserPermData = new UserPermData();
  homeActive:boolean = false;

}

export class HomeService {
  constructor() {
  }


  public initViewData(){

    let viewDataTmp = new HomeViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      viewDataTmp.storeId = storeId;
      viewDataTmp.buserPermData = SessionUtil.getInstance().getUserPermData();
      //页面没数据状态
      if (  viewDataTmp.buserPermData.isPurchaseAdmin == false
        && viewDataTmp.buserPermData.isRechargeAdmin == false
        && viewDataTmp.buserPermData.isAppointmentAdmin == false)
      {
        viewDataTmp.homeActive = true;
      }
      HomeViewDataMgr.getInstance().setHomeViewData(viewDataTmp);
    }

  }
}

