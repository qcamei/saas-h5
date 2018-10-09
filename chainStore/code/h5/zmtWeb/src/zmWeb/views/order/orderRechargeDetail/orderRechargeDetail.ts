import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {OrderViewDataMgr} from "../orderViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {AppRouter} from "../../../comModule/AppRouter";
import {OrderDetailMgr} from "../../../bsModule/orderDetail/OrderDetailMgr";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {SimpleOrderInfo} from "../../../bsModule/orderDetail/data/SimpleOrderInfo";
import {SimpleLeaguerInfo} from "../../../bsModule/orderDetail/data/SimpleLeaguerInfo";
import {RechargeDetail} from "../../../bsModule/orderDetail/data/RechargeDetail";
import {PayItem} from "../../../bsModule/order/data/PayItem";
import {UserBonusDetail} from "../../../bsModule/order/data/UserBonusDetail";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";

/**
 * 订单管理 订单详情 (会员充值)
 */
@Component({
  selector: 'order-recharge-detail',
  templateUrl: 'orderRechargeDetail.html',
  styleUrls: ['orderRechargeDetail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrderRechargeDetailPage implements OnInit,OnDestroy {

  private viewDataSub: any;
  private paramsSub: any;
  private service: OrderRechargeDetailService;
  public viewData: OrderRechargeDetailViewData;

  constructor(
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private orderDetailMgr: OrderDetailMgr,
              private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private orderViewDataMgr: OrderViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private route: ActivatedRoute) {
    this.service = new OrderRechargeDetailService(
      this.storeClerkInfoSynDataHolder,
      this.buserMgr,
      this.orderDetailMgr,
      this.leaguerDetailSynDataHolder,
      this.storeCardInfoSynDataHolder,
      this.orderViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.orderViewDataMgr.subscribeOrderRechargeDetailVD((viewDataP: OrderRechargeDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe((params) => {
      let orderId = params["orderId"];
      this.service.initViewData(orderId);
    })
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  goLeaguer(leaguer): void {
    AppRouter.goLeaguerDetail(leaguer);
  }
}

export class OrderRechargeDetailService {
  constructor(
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private orderDetailMgr: OrderDetailMgr,
              private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private orderViewDataMgr: OrderViewDataMgr) {
  }

  /**
   * 初始化页面数据
   * @param orderId
   */
  public initViewData(orderId): void {
    let viewDataTmp = new OrderRechargeDetailViewData();
    this.orderViewDataMgr.setOrderRechargeDetailViewData(viewDataTmp);

    this.buildViewData(orderId, (viewData: OrderRechargeDetailViewData) => {
      this.handleViewData(viewData);
    })
  }

  /**
   * 处理回调数据
   * @param viewData
   */
  public handleViewData(viewData: OrderRechargeDetailViewData) {
    this.orderViewDataMgr.setOrderRechargeDetailViewData(viewData);
  }

  /**
   * 加载初始化数据
   * @param orderId
   * @param callback
   * @returns {Promise<void>}
   */
  public async buildViewData(orderId, callback: (viewDataP: OrderRechargeDetailViewData) => void) {
    let viewDataTmp = new OrderRechargeDetailViewData();

    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.clerkMap = storeClerkInfo.getClerkMap();

    let clerkIdArray = viewDataTmp.clerkMap.keys();
    let buserList = await this.buserMgr.findByMultitId(clerkIdArray);
    viewDataTmp.buserMap = this.buildBuserMap(buserList);

    //请求订单信息
    let orderDetail: OrderDetail = await this.orderDetailMgr.getOrderDetail(orderId);
    viewDataTmp.orderDetail = orderDetail;

    if (orderDetail && orderDetail.simpleOrderInfo) {
      viewDataTmp.simpleOrderInfo = orderDetail.simpleOrderInfo;
      let creatorId = orderDetail.simpleOrderInfo.creatorId;
      if (!AppUtils.isNullOrWhiteSpace(creatorId)) {
        let buser: BUser = viewDataTmp.buserMap.get(creatorId);
        viewDataTmp.creatorName = buser ? buser.name : "-";
      }
    }

    if (orderDetail && orderDetail.simpleLeaguerInfo) {
      if (!SessionUtil.getInstance().getUserPermData().isPhoneAdmin) {
        orderDetail.simpleLeaguerInfo.phone = AppUtils.replaceLeaguerPhone(orderDetail.simpleLeaguerInfo.phone);
      }
      viewDataTmp.simpleLeaguerInfo = orderDetail.simpleLeaguerInfo;
    }

    if (orderDetail && orderDetail.rechargeDetails) {
      viewDataTmp.rechargeDetail = orderDetail.rechargeDetails[0];
    }

    if (orderDetail && orderDetail.payItems) {
      viewDataTmp.payItems = orderDetail.payItems;
    }

    let userBonusList = new Array<UserBonusDetail>();
    if (orderDetail && orderDetail.orderBonusDetails) {
      orderDetail.orderBonusDetails.forEach((item)=>{
        let userBonusListTmp = this.mapToList(item.userBonusMap);
        userBonusList = userBonusList.concat(userBonusListTmp);
      });
    }
    viewDataTmp.userBonusList = userBonusList;

    //请求会员信息
    if (orderDetail && orderDetail.simpleLeaguerInfo) {
      let leaguerId = orderDetail.simpleLeaguerInfo.id;
      let leaguerDetail: LeaguerDetail = await this.leaguerDetailSynDataHolder.getData(leaguerId);
      viewDataTmp.leaguerDetail = leaguerDetail.encryptLeaguerDetail();
    }

    //请求会员卡包信息
    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    if (viewDataTmp.leaguerDetail && viewDataTmp.leaguerDetail.leaguerMemberCard && viewDataTmp.leaguerDetail.leaguerMemberCard.cardId) {
      let membershipCard = storeCardInfo.getMemberCardMap().get(viewDataTmp.leaguerDetail.leaguerMemberCard.cardId);
      viewDataTmp.membershipCard = membershipCard;
    }

    callback(viewDataTmp);
  }

  private mapToList(userBonusMap){
    let userBonusList = new Array<UserBonusDetail>();
    for(let key in userBonusMap){
      let item = userBonusMap[key];
      let userBonus = new UserBonusDetail();
      AppUtils.copy(userBonus,item);
      userBonusList.push(userBonus);
    }
    return userBonusList;
  }

  /**
   * 组装用户详情
   * @param buserList
   * @param viewDataTmp
   */
  private buildBuserMap(buserList: Array<BUser>):ZmMap<BUser> {
    let buserMap = new ZmMap<BUser>();
    for (let i = 0; i < buserList.length; i++) {
      buserMap.put(buserList[i].id, buserList[i]);
    }
    return buserMap;
  }

}


export class OrderRechargeDetailViewData {
  public clerkMap: ZmMap<ClerkInfo>;
  public buserMap: ZmMap<BUser>;

  public orderDetail: OrderDetail = new OrderDetail();
  public simpleOrderInfo: SimpleOrderInfo = new SimpleOrderInfo();
  public simpleLeaguerInfo: SimpleLeaguerInfo = new SimpleLeaguerInfo();
  public rechargeDetail: RechargeDetail = new RechargeDetail();
  public payItems: Array<PayItem> = new Array<PayItem>();
  public userBonusList: Array<UserBonusDetail> = new Array<UserBonusDetail>();

  public leaguerDetail: LeaguerDetail = new LeaguerDetail();
  public membershipCard: MembershipCard = new MembershipCard();

  public creatorName: string = "-";//跟进人员

}
