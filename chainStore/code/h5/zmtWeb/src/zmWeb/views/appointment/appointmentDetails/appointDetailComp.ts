import {Component, OnInit, OnDestroy, ChangeDetectorRef, Input} from "@angular/core";
import {AppointmentViewDataMgr} from "../AppointmentViewDataMgr";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {Appointment} from "../../../bsModule/appointment/data/Appointment";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {LeaguerMemberCard} from "../../../bsModule/storeLeaguerInfo/data/LeaguerMemberCard";
import {BUserCacheMgr} from "../../../bsModule/buser/BUserCacheMgr";
import {ProductData} from "../addAppointWraper/AddAppointDataWraper";
import {AppointProduct} from "../../../bsModule/appointment/data/AppointProduct";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {AppointmentSynDataHolder} from "../../../bsModule/appointment/AppointmentSynDataHolder";
import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {StoreProductInfoMgr} from "../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {CancelReason} from "../../../bsModule/appointment/data/CancelReason";

/**
 * 预约详情组件
 */
@Component({
  selector:'appoint-detail-comp',
  template: `

    <zm-card [expanded]="true" [withCollapse]="false" [header]="'基本信息'">
        <zm-table-detail class="table table-bordered text-center zmFullWidth">
              <thead>
                <th>预约时间</th>
                <th>接受状态</th>
                <th>预约渠道</th>
              </thead>
              <tbody>
              <tr class="c-tr">
                <td>{{viewData.appointmentDetail.appointTime|times}}</td>
                <td>{{viewData.appointmentDetail.status |appointmentStatusPipe}}</td>
                <td>{{viewData.appointmentDetail.origin |originTypePipe}}</td>
              </tr>
              <tr class="c-tr">
                <td colspan="3" align="left"><p style="float:left;margin:0;font-weight:bold;">取消原因：</p><p style="float:left;margin:0;">{{viewData.cancelReason.reason}}</p>
                
                <div *ngIf="viewData.cancelReason.remarks" style="clear:left;margin-top:25px"><span style="font-weight:bold;margin-left: 28px;">备注：</span>{{viewData.cancelReason.remarks}}</div>
                </td>
              </tr>
              </tbody>
        </zm-table-detail>
    </zm-card>

<!--会员信息-->
    <zm-card [expanded]="true" [withCollapse]="false" [header]="'会员信息'">
        <zm-table-detail class="table table-bordered text-center zmFullWidth">

          <thead>
          <th>会员姓名</th>
          <th>手机号</th>
          <th>会员卡</th>
          <th>项目折扣</th>
          <th>商品折扣</th>
          <th>次卡折扣</th>
          </thead>
          <tbody>
          <tr class="c-tr">
            <td>{{viewData.leaguerDetail.name}}</td>
            <td>{{viewData.leaguerDetail.phone}}</td>
            <td>{{viewData.memCard.name?viewData.memCard.name:"-"}}</td>
            <td>{{viewData.memCard.prodDiscount|discountPipe}}</td>
            <td>{{viewData.memCard.goodsDiscount|discountPipe}}</td>
            <td>{{viewData.memCard.prdCardDiscount|discountPipe}}</td>
          </tr>
          </tbody>
        </zm-table-detail>
    </zm-card>


<!--预约项目列表-->
    <zm-card [expanded]="true" [withCollapse]="false" [header]="'预约项目列表'">
        <zm-table-detail class="text-center zmFullWidth">
                  <thead>
                    <th>序号</th>
                    <th>名称</th>
                    <th>数量</th>
                    <th>结算方式</th>
                    <th>服务人员</th>
                  </thead>
                  <tbody>
                  <tr class="c-tr" *ngFor="let item of viewData.appointProductShow;let i = index;">
                    <td>{{i+1}}</td>
                    <td>{{item.id|productNamePipe:viewData.productInfoMap}}</td>
                    <td>{{item.count}}</td>
                    <td>{{item.payType==0?"现结":"划卡"}}</td>
                    <td>{{item.buserName?item.buserName:"-"}}</td>
                  </tr>
                  </tbody>
        </zm-table-detail>
    </zm-card>
`,
  styles:[`
    table{
      margin-bottom:0;
    }
    .text-center {
      text-align: center;
    }
    thead th {
      font-weight: bold;
      background-color: #f4f6fa !important;
      border-bottom-width: 1px !important;
    }
    tbody tr{
      margin-top: -1px;
    }
    tbody tr:nth-of-type(odd){
      background-color: #ffffff;
    }
    tbody tr:nth-of-type(even),tbody tr:nth-of-type(even) input,tbody tr:nth-of-type(even) select{
      background-color:#f9fafc;
    }
    tbody .c-tr:hover{
      background-color: #e7f3fd;
    }
    tbody a{cursor:pointer;}
    tbody a:hover{text-decoration: none;color:#03a9f4 !important;}
    
    th, td{
      vertical-align: middle !important;
      font-size: 14px;
      word-wrap:break-word;
      word-break: break-all;
    }
    .table-bordered thead th{
      border-bottom-width: 1px !important;
    }
    select::-ms-expand { display: none; }
    input[type=number] {
      -moz-appearance: textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
  `]
})
export class AppointDetailComp implements OnInit,OnDestroy {

  @Input() appointId:string;
  private viewDataSub: any;
  private service: AppointDetailCompService;
  public viewData: AppointDetailCompViewData;

  constructor(
              private appointmentViewDataMgr: AppointmentViewDataMgr,
              private leaguerDetailSynDataHolder:LeaguerDetailSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storePrdMgr: StoreProductInfoMgr,
              private buserCacheMgr:BUserCacheMgr,
              private appointmentSynDataHolder:AppointmentSynDataHolder,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new AppointDetailCompService(
      this.appointmentViewDataMgr,
      this.leaguerDetailSynDataHolder,
      this.storeCardInfoSynDataHolder,
      this.storePrdMgr,
      this.buserCacheMgr,
      this.appointmentSynDataHolder,
    );
  }

  ngOnInit() {
    this.viewDataSub = this.appointmentViewDataMgr.subscribeAppointDetailCompVD((viewDataP: AppointDetailCompViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    if(!AppUtils.isNullObj(this.appointId) && !AppUtils.isNullOrWhiteSpace(this.appointId)){
      this.service.initViewData(this.appointId);
    }
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }
}

class AppointDetailCompService {

  constructor(
              private appointmentViewDataMgr: AppointmentViewDataMgr,
              private leaguerDetailSynDataHolder:LeaguerDetailSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storePrdMgr: StoreProductInfoMgr,
              private buserCacheMgr:BUserCacheMgr,
              private appointmentSynDataHolder:AppointmentSynDataHolder) {
  }

  public initViewData(apptId: string): void {
    this.appointmentViewDataMgr.setAppointDetailCompViewData(new AppointDetailCompViewData());

    this.buildViewData(apptId).then((viewDataTmp: AppointDetailCompViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: AppointDetailCompViewData) {
    this.appointmentViewDataMgr.setAppointDetailCompViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param apptId: number
   * @returns Promise<AppointmentDetailViewData>
   */
  public async buildViewData(apptId: string): Promise<AppointDetailCompViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: AppointDetailCompViewData = new AppointDetailCompViewData();
    let appointment = await this.appointmentSynDataHolder.getData(apptId);

    let leaguerId = "";
    if (appointment) {
      leaguerId = appointment.leaguerId;
      let appointProducts:Array<AppointProduct> = appointment.appointProducts;
      let ids = this.getBuserIds(appointProducts);
      let buserMap:ZmMap<BUser> = await this.buserCacheMgr.getList(ids);
      viewDataTmp.appointmentDetail = appointment;
      AppUtils.copy(viewDataTmp.cancelReason,appointment.cancelReason);
      viewDataTmp.appointProductShow = this.bulidProductData(appointProducts,buserMap);
    }

    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId); //请求storeCardInfo 会员卡信息
    let storePrd = await this.storePrdMgr.getStoreProductInfo(storeId);//请求storeProductInfo 项目信息
    viewDataTmp.memberCardMap = storeCardInfo.getMemberCardMap();
    viewDataTmp.productInfoMap = storePrd.getAllProductInfoMap();

    let leaguerDetail:LeaguerDetail= await this.leaguerDetailSynDataHolder.getData(leaguerId);
    if(!AppUtils.isNullObj(leaguerDetail)){
      if(SessionUtil.getInstance().getUserPermData().isPhoneAdmin){
        viewDataTmp.leaguerDetail = leaguerDetail;
      }else{
        viewDataTmp.leaguerDetail = leaguerDetail.encryptLeaguerDetail();
      }

      if (viewDataTmp.leaguerDetail.leaguerMemberCard != null) {
        viewDataTmp.leaguerMemCard = viewDataTmp.leaguerDetail.leaguerMemberCard;
        let mbCardId = viewDataTmp.leaguerMemCard.cardId;
        if (mbCardId) {
          viewDataTmp.memCard = viewDataTmp.memberCardMap.get(mbCardId);
        } else {
          viewDataTmp.memCard = new MembershipCard();
        }
      }
    }

    return new Promise<AppointDetailCompViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  /**
   * 预约跟进人员列表
   * @param appointProducts: Array<AppointProduct>
   * @return Array<string>
   */
  private getBuserIds(appointProducts: Array<AppointProduct>) {
    let buserIds = new Array<string>();
    for (let index in appointProducts) {
      let arr = appointProducts[index].buserIds;
      if (arr != null) {
        buserIds = buserIds.concat(arr);
      }
    }
    buserIds = AppUtils.uniquelize(buserIds);
    return buserIds;
  }

  /**
   * 组装预约项目列表
   * @param appointProducts:Array<AppointProduct>
   * @param buserMap:ZmMap<BUser>
   * @return Array<ProductData>
   */
  private bulidProductData(appointProducts:Array<AppointProduct>,buserMap:ZmMap<BUser>):Array<ProductData>{
    let appointProductTmp: Array<ProductData> = new Array<ProductData>();
    for (let index in appointProducts) {
      let productData = new ProductData();
      productData.id = appointProducts[index].productId;
      productData.payType = appointProducts[index].operateType;
      productData.count = appointProducts[index].productCount;
      productData.buserId = appointProducts[index].buserIds;
      productData.buserName = this.getBuserName(productData.buserId,buserMap);
      appointProductTmp.push(productData);
    }
    return appointProductTmp;
  }

  /**
   * 获取服务人员姓名
   */
  private getBuserName(buserIdArray:Array<string>,buserMap:ZmMap<BUser>):string{
    let buserNameArr = [];
    for (let i in buserIdArray) {
      let buser = buserMap.get(buserIdArray[i]);
      if(buser){
        buserNameArr.push(buser.name);
      }
    }
    return buserNameArr.join("、");
  }

}

export class AppointDetailCompViewData {
  appointmentDetail: Appointment = new Appointment();//预约详情
  cancelReason:CancelReason = new CancelReason();
  appointProductShow: Array<ProductData> = new Array<ProductData>();//预约项目列表显示

  leaguerDetail: LeaguerDetail = new LeaguerDetail();//会员详情
  leaguerMemCard: LeaguerMemberCard = new LeaguerMemberCard();//会员会员卡
  memCard: MembershipCard = new MembershipCard();//会员卡详情

  memberCardMap: ZmMap<MembershipCard>;
  productInfoMap: ZmMap<ProductInfo>;
}

