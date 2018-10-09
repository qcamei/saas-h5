import {UserBonus} from "../../../bsModule/workFlow/data/UserBonus";
import {StaffData} from "../../storeflow/selectStaffComp/selectStaffComp";
import {SimpleOrderInfo} from "../../../bsModule/orderDetail/data/SimpleOrderInfo";
import {BonusRecordForm} from "../../../bsModule/bonusRecord/apiData/BonusRecordForm";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BonusRecordMgr} from "../../../bsModule/bonusRecord/BonusRecordMgr";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {OrderViewDataMgr} from "../orderViewDataMgr";
import {OrderDetailMgr} from "../../../bsModule/orderDetail/OrderDetailMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {OrderDetail} from "../../../bsModule/orderDetail/data/OrderDetail";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {EditConsumeBonusViewData, OrderBonusData,BonusInfo} from "./EditConsumeBonusViewData";
import {UserBonusDetail} from "../../../bsModule/order/data/UserBonusDetail";
import {BonusRecordListForm} from "../../../bsModule/bonusRecord/apiData/BonusRecordListForm";

export class EditConsumeBonusService {
  constructor(
              private bonusRecordMgr: BonusRecordMgr,
              private storeClerkInfoMgr: StoreClerkInfoMgr,
              private buserMgr: BUserMgr,
              private orderViewDataMgr: OrderViewDataMgr,
              private orderDetailMgr: OrderDetailMgr,) {
  }

  public initViewData(orderId): void {
    let viewDataTmp = new EditConsumeBonusViewData();
    this.orderViewDataMgr.setEditConsumeBonusViewData(viewDataTmp);

    this.buildViewData(orderId, (viewDataP: EditConsumeBonusViewData) => {
      this.handleViewData(viewDataP);
    })
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP) {
    this.orderViewDataMgr.setEditConsumeBonusViewData(viewDataP);
  }

  /**
   * 请求店铺信息 组装viewData数据
   * @param orderId
   * @param callbackP
   */
  public async buildViewData(orderId, callbackP: (viewDataP: EditConsumeBonusViewData) => void) {
    let viewDataTmp = new EditConsumeBonusViewData();

    //请求storeClerkInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoMgr.get(clerkInfoId);
    viewDataTmp.clerkMap = storeClerkInfo.getClerkMap();
    viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

    //请求所有员工信息
    let clerkIdArray = viewDataTmp.clerkMap.keys();
    let buserList = await this.buserMgr.findByMultitId(clerkIdArray);
    viewDataTmp.buserMap = this.buildBuserMap(buserList);

    let orderDetail: OrderDetail = await this.orderDetailMgr.getOrderDetail(orderId);
    if (orderDetail && orderDetail.simpleOrderInfo) {
      viewDataTmp.simpleOrderInfo = orderDetail.simpleOrderInfo;
    }
    if (viewDataTmp.simpleOrderInfo && viewDataTmp.simpleOrderInfo.creatorId) {
      let buser: BUser = viewDataTmp.buserMap.get(viewDataTmp.simpleOrderInfo.creatorId.toString());
      viewDataTmp.creatorName = buser.name;
    }

    if (orderDetail && orderDetail.delimitCardDetails) {
      viewDataTmp.delimitCardDetails = orderDetail.delimitCardDetails;
    }
    if (orderDetail && orderDetail.buyDetails) {
      viewDataTmp.buyDetails = orderDetail.buyDetails;
      for (let item of orderDetail.buyDetails) {
        viewDataTmp.buyDetailsTotalPrice += parseFloat(item.pay.toString());
      }
    }
    if (orderDetail && orderDetail.donateDetails) {
      viewDataTmp.donateDetails = orderDetail.donateDetails;
    }

    if (orderDetail && orderDetail.orderBonusDetails) {
      viewDataTmp.bonusDetails = orderDetail.orderBonusDetails;
    }

    let orderBonusList = this.buildOrderBonusList(viewDataTmp);
    viewDataTmp.orderBonusList = orderBonusList;
    viewDataTmp.orderBonusList = viewDataTmp.orderBonusList.sort(function (a, b) {
      return a.payType - b.payType;
    });
    callbackP(viewDataTmp);

  }

  /**
   * 获取orderItemList列表
   * @param buyItems
   * @param bonusRecordList
   * @param buserMap
   * @param clerkMap
   * @param roleMap
   * @returns {OrderBonusData[]}
   */
  private buildOrderBonusList(viewDataTmp: EditConsumeBonusViewData) {
    let orderBonusList = new Array<OrderBonusData>();
    let listFromBuyDetails = this.buildFromBuyDetails(viewDataTmp);
    let listFromDelimitCardDetails = this.buildFromDelimitCardDetails(viewDataTmp);
    let listFromDonateDetails = this.buildFromDonateDetails(viewDataTmp);
    return orderBonusList.concat(listFromBuyDetails,listFromDelimitCardDetails,listFromDonateDetails);
  }

  private buildFromBuyDetails(viewDataTmp:EditConsumeBonusViewData){
    let orderBonusList = new Array<OrderBonusData>();
    if (viewDataTmp.buyDetails) {
      for (let buyDetail of viewDataTmp.buyDetails) {
        let orderBonusData = OrderBonusData.fromBuyDetail(buyDetail);

        let bonusList = new Array<UserBonusDetail>();
        viewDataTmp.bonusDetails.forEach((item)=>{
          if (item.buyType == orderBonusData.buyType && item.pgId == orderBonusData.pgId) {
            AppUtils.copy(bonusList, this.mapToList(item.userBonusMap));
          }
        });
        let bonusInfo = this.setBonusInfo(bonusList,viewDataTmp);
        orderBonusData.staffBonusList = bonusInfo.staffBonusList;
        orderBonusData.staffName = bonusInfo.staffName;

        orderBonusList.push(orderBonusData);
      }
    }
    return orderBonusList;
  }

  private buildFromDelimitCardDetails(viewDataTmp:EditConsumeBonusViewData){
    let orderBonusList = new Array<OrderBonusData>();
    if (viewDataTmp.delimitCardDetails) {
      for (let delimitCardDetail of viewDataTmp.delimitCardDetails) {
        let orderBonusData = OrderBonusData.fromDelimitCardDetail(delimitCardDetail);

        let bonusList = new Array<UserBonusDetail>();
        viewDataTmp.bonusDetails.forEach((item)=>{
          if (item.buyType == orderBonusData.buyType && item.pgId == orderBonusData.pgId) {
            AppUtils.copy(bonusList, this.mapToList(item.userBonusMap));
          }
        });

        let bonusInfo = this.setBonusInfo(bonusList,viewDataTmp);
        orderBonusData.staffBonusList = bonusInfo.staffBonusList;
        orderBonusData.staffName = bonusInfo.staffName;

        orderBonusList.push(orderBonusData);
      }
    }
    return orderBonusList;
  }

  private buildFromDonateDetails(viewDataTmp:EditConsumeBonusViewData){
    let orderBonusList = new Array<OrderBonusData>();
    if(viewDataTmp.donateDetails){
      for (let donateDetail of viewDataTmp.donateDetails) {
        let orderBonusData = OrderBonusData.fromDonateDetail(donateDetail);

        let bonusList = new Array<UserBonusDetail>();
        viewDataTmp.bonusDetails.forEach((item)=>{
          if (item.buyType == orderBonusData.buyType && item.pgId == orderBonusData.pgId) {
            AppUtils.copy(bonusList, this.mapToList(item.userBonusMap));
          }
        });
        let bonusInfo = this.setBonusInfo(bonusList,viewDataTmp);
        orderBonusData.staffBonusList = bonusInfo.staffBonusList;
        orderBonusData.staffName = bonusInfo.staffName;
        orderBonusList.push(orderBonusData);
      }
    }
    return orderBonusList;
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

  private setBonusInfo(bonusList:Array<UserBonusDetail>,viewDataTmp:EditConsumeBonusViewData){
    let bonusInfo = new BonusInfo();
    let staffBonusList: Array<StaffData> = this.getStaffBonusList(bonusList, viewDataTmp.buserMap, viewDataTmp.clerkMap, viewDataTmp.roleMap);
    bonusInfo.staffBonusList = staffBonusList;

    let nameArr:Array<String> = staffBonusList.map((item) => {
      return item.name;
    });
    bonusInfo.staffName = nameArr.join("、");
    return bonusInfo;
  }

  /**
   * 获取提成列表
   * @param bonusList
   * @param buserMap
   * @param clerkMap
   * @param roleMap
   * @returns {StaffData[]}
   */
  private getStaffBonusList(bonusList:Array<UserBonusDetail>, buserMap: ZmMap<BUser>, clerkMap: ZmMap<ClerkInfo>, roleMap: ZmMap<StoreAdminRole>):Array<StaffData> {

      let staffBonusList = bonusList.map((item) => {
        let staffData = new StaffData();
        let buserId = item.buserId.toString();
        staffData.id = buserId;
        staffData.name = "-";
        if (buserMap.get(buserId) && buserMap.get(buserId).name) {
          staffData.name = buserMap.get(buserId).name;
        }
        //角色名
        let clerkInfo = clerkMap.get(buserId);
        staffData.roleName = "-";
        if (clerkInfo && clerkInfo.roleSet) {
          let roleSet = clerkInfo.roleSet;
          let roleNameArr = roleSet.map((item) => {
            return roleMap.get(item) ? roleMap.get(item).name : "";
          });
          staffData.roleName = roleNameArr.join("、");
        }
        staffData.amount = item.amount;
        staffData.bonusType = item.bonusType;
        staffData.percentage = item.percentage;
        staffData.cost = item.cost;
        return staffData;
      });
    return staffBonusList;
  }

  /**
   * 组装用户详情
   * @param buserList
   * @param viewDataTmp
   */
  private buildBuserMap(buserList: Array<BUser>): ZmMap<BUser> {
    let buserMap = new ZmMap<BUser>();
    for (let i = 0; i < buserList.length; i++) {
      buserMap.put(buserList[i].id, buserList[i]);
    }
    return buserMap;
  }

  /**
   * 修改提成
   * @param viewData
   * @param callback
   */
  public updateBonusRecord(simpleOrderInfo: SimpleOrderInfo, orderBonusData: OrderBonusData, callback: (success: boolean) => void) {
    let bonusRecordForm = this.buildBonusRecordForm(simpleOrderInfo, orderBonusData);
    this.bonusRecordMgr.add(bonusRecordForm).then((success) => {
      callback(success);
    })
  }

  /**
   * 修改提成列表
   * @param viewData
   * @param callback
   */
  public saveBonusList(simpleOrderInfo: SimpleOrderInfo, orderBonusDataList: Array<OrderBonusData>, callback: (success: boolean) => void) {
    let bonusRecordListForm = new BonusRecordListForm();
    bonusRecordListForm.orderId = simpleOrderInfo.orderId;
    bonusRecordListForm.bonusRecordForms = orderBonusDataList.map((item)=>{
      return this.buildBonusRecordForm(simpleOrderInfo, item);
    })
    this.bonusRecordMgr.saveList(bonusRecordListForm).then((success) => {
      callback(success);
    })
  }

  /**
   * 组装添加提成form
   * @param order
   * @param orderBonusData
   * @returns {BonusInfoAddForm}
   */
  private buildBonusRecordForm(simpleOrderInfo: SimpleOrderInfo, orderBonusData: OrderBonusData) {
    let bonusRecordForm = new BonusRecordForm();
    bonusRecordForm.storeId = simpleOrderInfo.storeId;
    bonusRecordForm.orderId = simpleOrderInfo.orderId;
    bonusRecordForm.buyType = orderBonusData.buyType;
    bonusRecordForm.pgId = orderBonusData.pgId;
    bonusRecordForm.prdCardPayType = orderBonusData.payType;
    if (orderBonusData.leaguerPrdCardId) {
      bonusRecordForm.leaguerPrdCardId = orderBonusData.leaguerPrdCardId;
    }

    let userBonusMap = {};
    for (let i = 0; i < orderBonusData.staffBonusList.length; i++) {
      let staffData: StaffData = orderBonusData.staffBonusList[i];
      userBonusMap[staffData.id] = UserBonus.fromStaffItem(staffData);
    }
    bonusRecordForm.userBonusMap = userBonusMap;
    return bonusRecordForm;
  }

}
