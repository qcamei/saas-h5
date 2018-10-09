import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {Charge} from "../../../bsModule/charge/data/Charge";
import {ChargeMgr} from "../../../bsModule/charge/ChargeMgr";
import {VipLevelMgr} from "../../../bsModule/vipLevel/VipLevelMgr";
import {ChargeViewDataMgr} from "../chargeViewDataMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChargeQueryForm} from "../../../bsModule/charge/apiData/ChargeQueryForm";
import {ChargeOriginEnum} from "../../../bsModule/charge/data/ChargeOriginEnum";
import {PageResp} from "../../../comModule/PageResp";

/**
 * 缴费升级记录列表
 */
@Component({
  selector: 'charge-list',
  templateUrl: 'chargeList.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChargeListPage implements OnInit,OnDestroy {

  a="2";

// 手机号查询
  getChargeOrder(){

  }
// 支付方式筛选
  findOrders(){

  }

// 日期
  findByTime(){

  }

  private viewDataSub:any;
  private service:ChargeListService;
  public viewData:ChargeListViewData;

  constructor(private chargeMgr:ChargeMgr,
              private vipLevelMgr:VipLevelMgr,
              private chargeViewDataMgr:ChargeViewDataMgr,
              private cdRef:ChangeDetectorRef){
    this.service = new ChargeListService(this.chargeMgr,this.vipLevelMgr,this.chargeViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chargeViewDataMgr.subscribeChargeListVD((viewDataP:ChargeListViewData)=>{
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
   * 查找记录
   */
  find(){
    this.getPageData(1);
  }

  /**
   * 翻页
   * @param curPage
   */
  getPageData(curPage){
    this.service.getPageData(curPage,this.viewData);
  }

}

export class ChargeListService{

  constructor(private chargeMgr:ChargeMgr,
              private vipLevelMgr:VipLevelMgr,
              private chargeViewDataMgr:ChargeViewDataMgr,){}

  public initViewData(){
    let viewDataTmp = new ChargeListViewData();
    this.chargeViewDataMgr.setChargeListViewData(viewDataTmp);

    this.buildViewData();
  }

  private async buildViewData() {
    let viewDataTmp = new ChargeListViewData();

    let buserId = SessionUtil.getInstance().getUserId();
    viewDataTmp.chargeQueryForm.buserId = buserId;
    viewDataTmp.chargeQueryForm.origin = ChargeOriginEnum.StoreMS;
    viewDataTmp.chargeQueryForm.minCreateTime = AppUtils.getMinTime(viewDataTmp.minTime);
    viewDataTmp.chargeQueryForm.maxCreateTime = AppUtils.getMaxTime(viewDataTmp.maxTime);
    let pageResp:PageResp = await this.chargeMgr.findChargePageInfo(viewDataTmp.chargeQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.list = pageResp.list;
      viewDataTmp.recordCount = pageResp.totalCount;
      viewDataTmp.curPage = pageResp.pageNo;
    }
    viewDataTmp.loadingFinish = true;
    this.chargeViewDataMgr.setChargeListViewData(viewDataTmp);
  }

  public async getPageData(curPage,viewData:ChargeListViewData){
    viewData.chargeQueryForm.minCreateTime = AppUtils.getMinTime(viewData.minTime);
    viewData.chargeQueryForm.maxCreateTime = AppUtils.getMaxTime(viewData.maxTime);
    viewData.chargeQueryForm.pageNo = curPage;
    let pageResp:PageResp = await this.chargeMgr.findChargePageInfo(viewData.chargeQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewData.list = pageResp.list;
      viewData.recordCount = pageResp.totalCount;
      viewData.curPage = pageResp.pageNo;
    }
    viewData.loadingFinish = true;
    this.chargeViewDataMgr.setChargeListViewData(viewData);
  }

}

export class ChargeListViewData{
  public list:Array<Charge> = new Array<Charge>();
  public chargeQueryForm:ChargeQueryForm = new ChargeQueryForm();

  public minTime: any;
  public maxTime: any;

  public recordCount:number;
  public curPage:number;
  public loadingFinish:boolean = false;

  constructor(){
    let date = new Date();
    this.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};

  }
}
