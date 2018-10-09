import {Component, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ArrearagesViewDataMgr} from "../arrearagesViewDataMgr";
import {ArrearageMgr} from "../../../bsModule/arrearage/ArrearageMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PageResp} from "../../../comModule/PageResp";
import {ArrearageQueryForm} from "../../../bsModule/arrearage/apiData/ArrearageQueryForm";
import {Arrearage} from "../../../bsModule/arrearage/data/Arrearage";
import {ActivatedRoute} from "@angular/router";
import {AppRouter} from "../../../comModule/AppRouter";
import {AppUtils} from "../../../comModule/AppUtils";
import {PayPopup, PayPopupViewData} from "../modal/payPopup";
import {PayRecordPopup} from "../modal/payRecordPopup";
import {PayData} from "../../storeflow/wfComp/WFDataWraper";
import {ArrearageAddPaymentHistoryApiForm} from "../../../bsModule/arrearage/apiData/ArrearageAddPaymentHistoryApiForm";
import {PayItem} from "../../../bsModule/order/data/PayItem";
import {PayTypeEnum} from "../../../bsModule/order/data/PayTypeEnum";
import {PaySuccessPopup, PaySuccessPopupViewData} from "../modal/paySuccessPopup";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";


@Component({
  selector: "arrearages_details",
  templateUrl: './arrearagesDetails.html',
  styleUrls: ['arrearagesDetails.scss'],
})
export class ArrearagesDetailsPage implements OnInit,OnDestroy{

  private viewDataSub:any;
  private paramSub:any;
  public viewData:ArrearagesDetailViewData;
  private service:ArrearagesDetailsService;

  constructor(
              private arrearageViewDataMgr:ArrearagesViewDataMgr,
              private arrearageMgr:ArrearageMgr,
              private leaguerDetailSynDataHolder:LeaguerDetailSynDataHolder,
              private cdRef:ChangeDetectorRef,
              private route:ActivatedRoute,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new ArrearagesDetailsService(this.arrearageViewDataMgr,this.arrearageMgr,this.leaguerDetailSynDataHolder);
  }

  ngOnInit(): void {
    this.viewDataSub = this.arrearageViewDataMgr.subscribeArrearageDetailVD((viewDataP:ArrearagesDetailViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.paramSub = this.route.params.subscribe(params =>{
      let leaguerId = params['leaguerId'];
      this.service.initViewData(leaguerId);
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 还款
   */
  pay(itemP:Arrearage) {
    // const payModal = this.modalService.open(PayPopup, {size:'lg',backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(PayPopup, null,null);
    //设置弹窗数据
    this.viewData.arrearage = itemP;
    this.viewData.payData = new PayData();
    activeModal.componentInstance.data = PayPopupViewData.fromArrearageDetail(this.viewData);
    activeModal.componentInstance.action = this.payCallback.bind(this);
  }

  /**
   * 支付回调
   */
  payCallback(payAmount:number){
    let arrearageId = this.viewData.arrearage.id;
    let payData = this.viewData.payData;
    this.service.addPayRecord(arrearageId,payData,(successP:boolean)=>{
      if(successP){
        // AppUtils.showSuccess("提示","还款成功");
        this.showPaySuccessPopup(payAmount);
      }else{
        AppUtils.showError("提示","还款失败");
      }
    })
  }

  /**
   * 显示支付成功弹窗
   */
  showPaySuccessPopup(payAmount:number){
    // const payModal = this.modalService.open(PaySuccessPopup, {size:'lg',backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(PaySuccessPopup, null,null);
    let balanceDue = AppUtils.roundPoint(this.viewData.arrearage.balanceDue,2) - payAmount;
    activeModal.componentInstance.data = PaySuccessPopupViewData.newInstance(payAmount,balanceDue);
    activeModal.componentInstance.action = this.paySuccessCallback.bind(this);
  }

  /**
   * 付款成功弹窗回调
   */
  paySuccessCallback(){
    this.service.initViewData(this.viewData.leaguer.id);
  }

  /**
   * 显示还款记录弹窗
   */
  showPayRecordPopup(itemP:Arrearage){
    // const payRecordModal = this.modalService.open(PayRecordPopup, {size:'lg',backdrop: 'static'});

    const activeModal = ZmModalMgr.getInstance().newModal(PayRecordPopup, null,null);
    activeModal.componentInstance.data = itemP;
  }

  /**
   * 跳转订单详情
   * @param orderId
   */
  goOrderDetail(orderId){
    AppRouter.goOrderConsumeDetail(orderId);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    this.service.getPageData(curPage,this.viewData);
  }

  /**
   * 根据时间过滤
   */
  findByTime(){
    if(!AppUtils.isNullObj(this.viewData.minTime) && !AppUtils.isNullObj(this.viewData.maxTime)){
      this.viewData.queryForm.minTime = AppUtils.getMinTime(this.viewData.minTime);
      this.viewData.queryForm.maxTime = AppUtils.getMaxTime(this.viewData.maxTime);
      this.getPageData(1);
    }
  }

  /**
   * 根据欠款类型查询
   */
  findByStatus(){
    let statusSet = new Array<number>();
    if(this.viewData.status == -1){
      statusSet.push(0);
      statusSet.push(1);
    }else{
      statusSet.push(this.viewData.status);
    }
    this.viewData.queryForm.statusSet = statusSet;
    this.getPageData(1);
  }
}

export class ArrearagesDetailsService{
  constructor(private arrearageViewDataMgr:ArrearagesViewDataMgr,
              private arrearageMgr:ArrearageMgr,
              private leaguerDetailSynDataHolder:LeaguerDetailSynDataHolder){

  }

  public initViewData(leaguerId){
    let viewDataTmp = new ArrearagesDetailViewData()
    this.handleViewData(viewDataTmp);
    this.buildViewData(leaguerId,(viewDataP:ArrearagesDetailViewData)=>{
      this.handleViewData(viewDataP);
    })
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP:ArrearagesDetailViewData){
    this.arrearageViewDataMgr.setArrearageDetailVD(viewDataP);
  }

  public async buildViewData(leaguerId,callback:(viewDataP:ArrearagesDetailViewData)=>void){
    let viewDataTmp = new ArrearagesDetailViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    //请求会员
    let leaguerDetail:LeaguerDetail = await this.leaguerDetailSynDataHolder.getData(leaguerId);
    viewDataTmp.leaguer = leaguerDetail.encryptLeaguerDetail();

    viewDataTmp.queryForm.storeId = storeId;
    viewDataTmp.queryForm.leaguerId = leaguerId;
    viewDataTmp.queryForm.minTime = "0";
    viewDataTmp.queryForm.maxTime = "0";
    viewDataTmp.queryForm.pageItemCount = 10;
    viewDataTmp.queryForm.pageNo = 1;
    //请求欠款总金额
    viewDataTmp.arrearageTotalAmount = await this.getArrearageGroupList(viewDataTmp.queryForm)
    //请求会员前框详情列表
    let pageResp:PageResp = await this.getArrearageList(viewDataTmp.queryForm);
    pageResp.list.sort((a:Arrearage,b:Arrearage)=>{
      return a.balanceDue > b.balanceDue?-1:1;
    })
    viewDataTmp.arrearageList = this.filterArrearageList(pageResp.list);
    viewDataTmp.page = 1;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage,viewData){
    viewData.loadingFinish = false;
    viewData.arrearageList = [];
    viewData.queryForm.pageNo = curPage;
    let pageResp:PageResp = await this.getArrearageList(viewData.queryForm);
    pageResp.list.sort((a:Arrearage,b:Arrearage)=>{
      return a.balanceDue > b.balanceDue?-1:1;
    })
    viewData.arrearageList = this.filterArrearageList(pageResp.list);
    viewData.page = curPage;
    viewData.recordCount = pageResp.totalCount;

    viewData.loadingFinish = true;
    this.handleViewData(viewData);
  }

  /**
   * 根据权限过滤显示列表数据
   * @param list
   * @returns {Arrearage[]}
   */
  private filterArrearageList(list: Array<Arrearage>):Array<Arrearage> {
    let arrearageList = new Array<Arrearage>();
    if (SessionUtil.getInstance().getUserPermData().isPhoneAdmin) {
      arrearageList = list;
    } else {
      arrearageList = list.map((item) => {
        let phoneStr = item.leaguerPhone.toString();
        item.leaguerPhone = phoneStr.replace(phoneStr.slice(3, 7), "****");
        return item;
      });
    }
    return arrearageList;
  }

  /**
   * 请求业务数据
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  private async getArrearageGroupList(queryForm){
    let pageResp:PageResp = await this.arrearageMgr.getArrearageGroupPageInfo(queryForm)
    return pageResp.list.length == 1? pageResp.list[0].totalAmount:0;
  }

  /**
   * 请求业务数据
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  private getArrearageList(queryForm){
    return this.arrearageMgr.getArrearagePageInfo(queryForm);
  }

  /**
   * 还款
   * @param arrearageId
   * @param payData
   * @param callback
   */
  public addPayRecord(arrearageId,payData:PayData,callback:(success:boolean)=>void){
    let storeId = SessionUtil.getInstance().getStoreId();
    let arrearageAddPaymentHistoryApiForm = new ArrearageAddPaymentHistoryApiForm();
    arrearageAddPaymentHistoryApiForm.creatorId = SessionUtil.getInstance().getUserId();
    arrearageAddPaymentHistoryApiForm.creatorName = SessionUtil.getInstance().getUserName();
    arrearageAddPaymentHistoryApiForm.payItems = this.buildPayItem(payData);
    this.arrearageMgr.addPayRecord(storeId,arrearageId,arrearageAddPaymentHistoryApiForm).then((success)=>{
      callback(success);
    })
  }

  /**
   * 组装支付方式列表
   * @returns {PayItem[]}
   */
  private buildPayItem(payData:PayData) {
    let payItems = new Array<PayItem>();
    if(payData.cash){
      let cash = new PayItem();
      cash.payType = PayTypeEnum.CASH;
      cash.cost = payData.cash;
      payItems.push(cash);
    }
    if(payData.alipay){
      let alipay = new PayItem();
      alipay.payType = PayTypeEnum.ALIPAY;
      alipay.cost = payData.alipay;
      payItems.push(alipay);
    }
    if(payData.wechat){
      let wechat = new PayItem();
      wechat.payType = PayTypeEnum.WECHAT;
      wechat.cost = payData.wechat;
      payItems.push(wechat);
    }
    if(payData.memberCard){
      let memberCard = new PayItem();
      memberCard.payType = PayTypeEnum.MEMBERSHIPCARD;
      memberCard.cost = payData.memberCard;
      payItems.push(memberCard);
    }
    if(payData.slotCard){
      let slotCard = new PayItem();
      slotCard.payType = PayTypeEnum.SLOT_CARD;
      slotCard.cost = payData.slotCard;
      payItems.push(slotCard);
    }
    return payItems;
  }

}

export class ArrearagesDetailViewData{
  public queryForm:ArrearageQueryForm = new ArrearageQueryForm;
  public arrearageTotalAmount:number = 0;
  public arrearageList:Array<Arrearage> = new Array<Arrearage>();

  public status:number = -1;//状态
  public minTime:any;
  public maxTime:any;

  public loadingFinish:boolean = false;
  public page:number;//当前页码
  public recordCount:number;//总记录数

  public payData:PayData = new PayData();
  public leaguer:LeaguerDetail;//会员
  public arrearage:Arrearage;//对应操作的欠款记录
}











