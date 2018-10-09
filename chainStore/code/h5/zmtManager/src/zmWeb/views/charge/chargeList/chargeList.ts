
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChargeMgr} from "../../../bsModule/charge/ChargeMgr";
import {ChargeViewDataMgr} from "../ChargeViewDataMgr";
import {ChargeQueryForm} from "../../../bsModule/charge/apiData/ChargeQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {AppUtils} from "../../../comModule/AppUtils";
import {Charge} from "../../../bsModule/charge/data/Charge";
import {Constants} from "../../common/Util/Constants";

/**
 * 收费管理 列表
 */
@Component({
  selector: 'charge-list',
  templateUrl: 'chargeList.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChargeListPage implements OnInit,OnDestroy {

  private viewDataSub:any
  private service:ChargeListService;
  public viewData:ChargeListViewData;

  constructor(private chargeMgr:ChargeMgr,
              private chargeViewDataMgr:ChargeViewDataMgr,
              private cdRef:ChangeDetectorRef) {
      this.service = new ChargeListService(this.chargeMgr,this.chargeViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chargeViewDataMgr.subscribeChargeListVD((viewDataP:ChargeListViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.service.initViewData();
  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 点击事件 跳转新建收费
   */
  goAddCharge(){
    AppRouter.goAddCharge();
  }

  /**
   * 点击事件 跳转编辑收费
   */
  goEditCharge(id){
    AppRouter.goEditCharge(id);
  }

  /**
   * 查询charge
   */
  findCharge(){
    if(!AppUtils.isNullObj(this.viewData.phone)){
      this.viewData.phone = AppUtils.isNullOrWhiteSpace(this.viewData.phone)?"":AppUtils.trimBlank(this.viewData.phone);
    }
    this.getPageData(1);
  }

  /**
   * 分页回调
   */
  public getPageData(curPage){
    this.service.getPageData(curPage,this.viewData);
  }

}

export class ChargeListService{
  constructor(private chargeMgr:ChargeMgr,
              private chargeViewDataMgr:ChargeViewDataMgr,){}

  public initViewData(){
    let viewDataTmp = new ChargeListViewData();
    this.chargeViewDataMgr.setChargeListViewData(viewDataTmp);

    this.buildViewData();
  }

  private buildViewData(){
    let viewDataTmp = new ChargeListViewData();
    let chargeQueryForm = new ChargeQueryForm();
    chargeQueryForm.phone = viewDataTmp.phone;
    chargeQueryForm.chargeChannel = viewDataTmp.chargeChannel;
    chargeQueryForm.minCreateTime = AppUtils.getMinTime(viewDataTmp.minTime);
    chargeQueryForm.maxCreateTime = AppUtils.getMaxTime(viewDataTmp.maxTime);
    this.chargeMgr.findChargePageInfo(chargeQueryForm).then((pageResp:PageResp)=>{
      if(!AppUtils.isNullObj(pageResp)){
        viewDataTmp.chargeVDList = this.chargeListToChargeVDList(pageResp.list);
        viewDataTmp.curPage = 1;
        viewDataTmp.recordCount = pageResp.totalCount;
      }
      viewDataTmp.loadingFinish = true;
      this.chargeViewDataMgr.setChargeListViewData(viewDataTmp);
    })
  }

  private chargeListToChargeVDList(chargeList: Array<Charge>):Array<ChargeVD>{
    let chargeVDList = new Array<ChargeVD>();
    chargeList.forEach((value, index, array)=>{
      let chargeVD = ChargeVD.fromCharge(value);
      chargeVDList.push(chargeVD);
    });
    return chargeVDList;
  }

  /**
   * 获取列表分页数据
   * @param curPage
   * @param viewData
   */
  public getPageData(curPage:number,viewData:ChargeListViewData){
    viewData.loadingFinish = false;
    viewData.chargeVDList = [];
    let chargeQueryForm = new ChargeQueryForm();
    chargeQueryForm.phone = viewData.phone;
    chargeQueryForm.chargeChannel = viewData.chargeChannel;
    chargeQueryForm.minCreateTime = AppUtils.getMinTime(viewData.minTime);
    chargeQueryForm.maxCreateTime = AppUtils.getMaxTime(viewData.maxTime);
    chargeQueryForm.pageNo = curPage;
    this.chargeMgr.findChargePageInfo(chargeQueryForm).then((pageResp:PageResp)=>{
      if(!AppUtils.isNullObj(pageResp)){
        viewData.chargeVDList = this.chargeListToChargeVDList(pageResp.list);
        viewData.curPage = curPage;
        viewData.recordCount = pageResp.totalCount;
      }
      viewData.loadingFinish = true;
      this.chargeViewDataMgr.setChargeListViewData(viewData);
    })
  }

}

export class ChargeListViewData{

  public chargeVDList:Array<ChargeVD> = new Array<ChargeVD>();

  //查询参数
  public phone: string = Constants.BLANK_STRING;
  public chargeChannel:number = Constants.DEFAULT_STATE_VALUE;
  public minTime: any;
  public maxTime: any;

  public curPage: number = 1;
  public recordCount: number;
  public loadingFinish:boolean = false;

  constructor(){
    let date = new Date();
    this.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }
}

export class ChargeVD{
  constructor(){}
  id:string;
  buserId:string;
  phone:string;
  name:string;
  chargeType:number; //ChargeTypeEnum

  vipLevelId:number;
  expiredTime:number;

  chargeChannel:number; //收费渠道
  money: number; //收费金额

  agencyArea:string;
  agencyName:string;
  agencyPhone:string;
  remark:string;
  entityState:number;
  origin:number;//来源 ChargeOriginEnum
  status:number;//状态 ChargeStatusEnum
  createdTime:number;
  lastUpdateTime:number;
  ver:number;

  public static fromCharge(charge: Charge){
    let chargeVD = new ChargeVD();
    AppUtils.copy(chargeVD, charge);
    if(charge.payItems && charge.payItems.length > 0){
      let chargePayItem = charge.payItems[0];
      chargeVD.chargeChannel = chargePayItem.payType;
      chargeVD.money = chargePayItem.cost;
    }
    return chargeVD;
  }
}
