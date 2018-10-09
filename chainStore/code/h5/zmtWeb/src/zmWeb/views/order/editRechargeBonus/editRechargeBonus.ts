import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {OrderViewDataMgr} from "../orderViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {BonusRecordMgr} from "../../../bsModule/bonusRecord/BonusRecordMgr";
import {StaffData, SelectStaffComp} from "../../storeflow/selectStaffComp/selectStaffComp";
import {UserBonus} from "../../../bsModule/workFlow/data/UserBonus";
import {BonusRecordForm} from "../../../bsModule/bonusRecord/apiData/BonusRecordForm";

import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";
import {PrdCardPayEnum} from "../../../bsModule/workFlow/data/PrdCardPayEnum";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {SimpleOrderInfo} from "../../../bsModule/orderDetail/data/SimpleOrderInfo";
import {SimpleLeaguerInfo} from "../../../bsModule/orderDetail/data/SimpleLeaguerInfo";
import {OrderDetailMgr} from "../../../bsModule/orderDetail/OrderDetailMgr";
import {RechargeDetail} from "../../../bsModule/orderDetail/data/RechargeDetail";
import {UserBonusDetail} from "../../../bsModule/order/data/UserBonusDetail";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**
 * 订单管理 修改提成 (会员充值)
 */
@Component({
  selector:'edit-recharge-bonus',
  templateUrl:'editRechargeBonus.html',
  styleUrls:['editRechargeBonus.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class EditRechargeBonusPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramsSub:any;
  private service: EditRechargeBonusService;
  public viewData: EditRechargeBonusViewData;

  constructor(private matDialog: MatDialog,
              private orderDetailMgr:OrderDetailMgr,
              private bonusRecordMgr:BonusRecordMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private orderViewDataMgr:OrderViewDataMgr,
              private buserMgr:BUserMgr,
              private cdRef: ChangeDetectorRef,
              private route:ActivatedRoute){
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new EditRechargeBonusService(this.orderDetailMgr,this.bonusRecordMgr,this.storeClerkInfoSynDataHolder,this.orderViewDataMgr,this.buserMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.orderViewDataMgr.subscribeEditRechargeBonusVD((viewDataP:EditRechargeBonusViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params =>{
      let orderId = params["orderId"];
      this.service.initViewData(orderId);
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  //弹出设置服务人员提成窗口
  setServicePerson():void{
    const activeModal = ZmModalMgr.getInstance().newModal(SelectStaffComp);
    //数据传递 回调执行
    activeModal.componentInstance.data = this.viewData.staffDataList;
    activeModal.componentInstance.amount = this.viewData.rechargeDetail.pay;
    activeModal.componentInstance.action = this.selectStaffCallback.bind(this);
  }

  /**
   * 选择服务人员回调
   * @param staffList
   */
  selectStaffCallback(staffList:Array<StaffData>):void{
    //修改提成
    this.updateBonusRecord(staffList,(success:boolean)=>{
      if(success){
        let staffNameArr = staffList.map((item) =>{
          return item.name;
        });
        this.viewData.staffName = staffNameArr.join("、");
      }
    });
  }

  /**
   * 修改提成
   */
  updateBonusRecord(staffList:Array<StaffData>,callbackP:(successP:boolean)=>void){
    this.service.updateBonusRecord(this.viewData.simpleOrderInfo,staffList,(success:boolean) => {
      if(success){
        AppUtils.showSuccess("提示","修改成功");
        callbackP(success);
        AppRouter.goOrderList();
      }else{
        AppUtils.showError("提示","修改失败");
      }
    })
  }

}

export class EditRechargeBonusService{
  constructor(private orderDetailMgr:OrderDetailMgr,
              private bonusRecordMgr:BonusRecordMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private orderViewDataMgr:OrderViewDataMgr,
              private buserMgr:BUserMgr,
  ){}

  public initViewData(orderId):void{
    let viewDataTmp = new EditRechargeBonusViewData();
    this.orderViewDataMgr.setEditRechargeBonusViewData(viewDataTmp);

    this.buildViewData(orderId,(viewData:EditRechargeBonusViewData) =>{
      this.handleViewData(viewData);
    })
  }

  /**
   * 处理回调
   * @param viewDataTmp
   */
  public handleViewData(viewDataTmp:EditRechargeBonusViewData){
    this.orderViewDataMgr.setEditRechargeBonusViewData(viewDataTmp);
  }

  /**
   * 请求页面初始化数据
   * @param orderId
   * @param callback
   * @returns {Promise<void>}
   */
  public async buildViewData(orderId,callback:(viewDataTmp:EditRechargeBonusViewData) => void){
    let viewDataTmp = new EditRechargeBonusViewData();
    //请求storeClerkInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.clerkMap = storeClerkInfo.getClerkMap();
    viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

    let clerkIdArray = viewDataTmp.clerkMap.keys();
    let buserList = await this.buserMgr.findByMultitId(clerkIdArray);
    viewDataTmp.buserMap = this.buildBuserMap(buserList);

    let orderDetail: OrderDetail = await this.orderDetailMgr.getOrderDetail(orderId);
    viewDataTmp.orderDetail = orderDetail;

    if (orderDetail && orderDetail.simpleLeaguerInfo) {
      if (!SessionUtil.getInstance().getUserPermData().isPhoneAdmin) {
        orderDetail.simpleLeaguerInfo.phone = AppUtils.replaceLeaguerPhone(orderDetail.simpleLeaguerInfo.phone);
      }
      viewDataTmp.simpleLeaguerInfo = orderDetail.simpleLeaguerInfo;
    }
    if (orderDetail && orderDetail.rechargeDetails) {
      viewDataTmp.rechargeDetail = orderDetail.rechargeDetails[0];
    }

    if (orderDetail && orderDetail.simpleOrderInfo) {
      viewDataTmp.simpleOrderInfo = orderDetail.simpleOrderInfo;
      let creatorId = orderDetail.simpleOrderInfo.creatorId;
      if (!AppUtils.isNullOrWhiteSpace(creatorId)) {
        let buser: BUser = viewDataTmp.buserMap.get(creatorId);
        viewDataTmp.creatorName = buser ? buser.name : "-";
      }
    }

    let userBonusList = new Array<UserBonusDetail>();
    if (orderDetail && orderDetail.orderBonusDetails) {
      orderDetail.orderBonusDetails.forEach((item)=>{
        let userBonusListTmp = this.mapToList(item.userBonusMap);
        userBonusList = userBonusList.concat(userBonusListTmp);
      });
    }
    //组装staffDataList
    let staffDataList = this.buildStaffDataList(userBonusList,viewDataTmp.clerkMap,viewDataTmp.roleMap);
    viewDataTmp.staffDataList = staffDataList;
    viewDataTmp.staffName = staffDataList.map((item) => {
      return item.name;
    }).join("、");

    callback(viewDataTmp);
  }

  private buildBuserMap(buserList: Array<BUser>):ZmMap<BUser> {
    let buserMap = new ZmMap<BUser>();
    for (let i = 0; i < buserList.length; i++) {
      buserMap.put(buserList[i].id, buserList[i]);
    }
    return buserMap;
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
   * 组装staffDataList
   * @param bonusRecordList
   * @param viewDataTmp
   */
  private buildStaffDataList(userBonusList: Array<UserBonusDetail>,clerkMap:ZmMap<ClerkInfo>,roleMap:ZmMap<StoreAdminRole>):Array<StaffData> {
    let staffDataList = userBonusList.map((item) => {
      let staffData = new StaffData();
      staffData.id = item.buserId;
      staffData.name = item.buserName;
      //角色名
      let clerkInfo = clerkMap.get(item.buserId);
      if (clerkInfo && clerkInfo.roleSet) {
        let roleSet = clerkInfo.roleSet;
        let roleNameArr = roleSet.map((item) => {
          return roleMap.get(item)?roleMap.get(item).name:"";
        });
        staffData.roleName = roleNameArr.join("、");
      } else {
        staffData.roleName = "-";
      }
      staffData.amount = item.amount;
      staffData.bonusType = item.bonusType;
      staffData.percentage = item.percentage;
      staffData.cost = item.cost;
      return staffData;
    });
    return staffDataList;
  }


  /**
   * 修改提成
   * @param viewData
   * @param callback
   */
  public updateBonusRecord(order:SimpleOrderInfo,staffList:Array<StaffData>,callback:(success:boolean) => void){
    let bonusRecordForm = this.buildBonusRecordForm(order,staffList);
    this.bonusRecordMgr.add(bonusRecordForm).then((success) => {
      callback(success);
    })
  }

  /**
   * 组装添加提成form
   * @param order
   * @param orderItemData
   * @returns {BonusInfoAddForm}
   */
  private buildBonusRecordForm(order:SimpleOrderInfo,staffList:Array<StaffData>) {
    let bonusRecordForm = new BonusRecordForm();
    bonusRecordForm.storeId = order.storeId;
    bonusRecordForm.orderId = order.orderId;
    bonusRecordForm.buyType = BuyTypeEnum.RECHARGE;
    bonusRecordForm.prdCardPayType = PrdCardPayEnum.CashPay;
    bonusRecordForm.buyName = "会员充值";

    let userBonusMap = {};
    for (let i = 0; i < staffList.length; i++) {
      let staffData: StaffData = staffList[i];
      userBonusMap[staffData.id] = UserBonus.fromStaffItem(staffData);
    }

    bonusRecordForm.userBonusMap = userBonusMap;
    return bonusRecordForm;
  }

}


export class EditRechargeBonusViewData{
  public clerkMap: ZmMap<ClerkInfo>;
  public roleMap: ZmMap<StoreAdminRole>;
  public buserMap: ZmMap<BUser>;


  public orderDetail: OrderDetail = new OrderDetail();
  public simpleOrderInfo: SimpleOrderInfo = new SimpleOrderInfo();
  public simpleLeaguerInfo: SimpleLeaguerInfo = new SimpleLeaguerInfo();
  public rechargeDetail: RechargeDetail;

  //服务人员
  public staffDataList: Array<StaffData> = new Array();
  public staffName:string = "";

  public creatorName:string;
}
