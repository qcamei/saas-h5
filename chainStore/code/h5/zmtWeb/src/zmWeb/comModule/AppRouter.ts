import {Router} from "@angular/router";

/**
 * 页面路由跳转
 */

export class AppRouter {

  private static router: Router;

  constructor() {
  }

  public static setRouter(routerP: Router) {
    AppRouter.router = routerP;
  }

  /**
   * buser
   */
  public static goLogin() {
    AppRouter.router.navigate(["/login"]);
  }

  public static goReg(roleSet) {
    AppRouter.router.navigate(["/reg/" + roleSet]);
  }

  public static goMain() {
    AppRouter.router.navigate(["/main"]);
  }

  public static goHome() {
    AppRouter.router.navigate(["/main/home/home"]);
  }

  /**跳转至开单收银*/
  public static goConsume(workFlowId) {
    AppRouter.router.navigate(["main/storeFlow/consume/" + workFlowId]);
  }

  public static goConsumeWithLeaguerId(workFlowId,leaguerId) {
    AppRouter.router.navigate(["main/storeFlow/consume/"+workFlowId,{leaguerId: leaguerId}]);
  }

  /**跳转至会员充值*/
  public static goRecharge(workFlowId) {
    AppRouter.router.navigate(["/main/storeFlow/recharge/" + workFlowId]);
  }

  public static goRechargeWithLeaguerId(workFlowId,leaguerId) {
    AppRouter.router.navigate(["/main/storeFlow/recharge/" + workFlowId,{leaguerId: leaguerId}]);
  }

  public static goRechargeList() {
    AppRouter.router.navigate(["/main/membershipRecharge/list"]);
  }


  /**项目列表*/
  public static goProductInfoList() {
    AppRouter.router.navigate(['/main/storeProductInfo/productInfoList']);
  }

  public static goAddProductInfo() {
    AppRouter.router.navigate(['/main/storeProductInfo/addProductInfo']);
  }

  public static goProductInfoDetail(productDetailId) {
    AppRouter.router.navigate(['/main/storeProductInfo/productInfoDetail/' + productDetailId]);
  }

  public static goEditProductInfo(productId) {
    AppRouter.router.navigate(['/main/storeProductInfo/editProductInfo/' + productId]);
  }

  /**会员卡列表*/
  public static goMemberCardList() {
    AppRouter.router.navigate(['/main/storeCardInfo/memberCard/list']);
  }

  public static goAddMemberCard() {
    AppRouter.router.navigate(['/main/storeCardInfo/memberCard/add']);
  }

  public static goEditMemberCard(cardId) {
    AppRouter.router.navigate(['/main/storeCardInfo/memberCard/update/' + cardId]);
  }

  public static goMemberCardDetail(cardId) {
    AppRouter.router.navigate(['/main/storeCardInfo/memberCard/detail/' + cardId]);
  }

  /**次卡列表*/
  public static goProductCardList() {
    AppRouter.router.navigate(['/main/storeCardInfo/productCard/list']);
  }

  public static goAddProductCard() {
    AppRouter.router.navigate(['/main/storeCardInfo/productCard/add']);
  }

  public static goEditProductCard(cardId) {
    AppRouter.router.navigate(['/main/storeCardInfo/productCard/update/' + cardId]);
  }

  public static goProductCardDetail(cardId) {
    AppRouter.router.navigate(['/main/storeCardInfo/productCard/detail/' + cardId]);
  }

  /**跟进记录*/

  public static goAddRecord(leaguerId) {
    AppRouter.router.navigate(['/main/storeLeaguerInfo/addRecord/' + leaguerId]);
  }

  /**编辑跟进记录*/
  public static goEditRecord(leaguerRecordId) {
    AppRouter.router.navigate(['/main/storeLeaguerInfo/editRecord/' + leaguerRecordId]);
  }

  /**跟进记录详情*/
  public static goRecordDetail(leaguerRecordId) {
    AppRouter.router.navigate(['/main/storeLeaguerInfo/recordDetail/' + leaguerRecordId]);
  }


  /**预约列表*/
  public static goAppointmentList() {
    AppRouter.router.navigate(['/main/appointment/appointmentList']);
  }

  /**新建预约*/
  public static goAddAppointment() {
    AppRouter.router.navigate(['/main/appointment/addAppointment/0']);
  }
  /**新建预约*/
  public static goAddAppointmentByLeaguer(leaguerId) {
    AppRouter.router.navigate(['/main/appointment/addAppointment/' + leaguerId]);
  }

  /**提成详情*/
  public static goBonusDetail(buserId) {
    AppRouter.router.navigate(['/main/bonus/bonusDetail/' + buserId]);
  }

// 商城订单详情

public static goShoppingDetail(orderId: string) {
  AppRouter.router.navigate(['/main/shopping/shoppingDetails/'+orderId]);
}

  /**
   * order 订单管理
   */
  public static goOrderList() {
    AppRouter.router.navigate(['/main/order/orderList']);
  }

  public static goOrderRechargeDetail(orderId) {
    AppRouter.router.navigate(['/main/order/orderRechargeDetail/' + orderId]);
  }

  public static goOrderConsumeDetail(orderId) {
    AppRouter.router.navigate(['/main/order/orderConsumeDetail/' + orderId]);
    // AppRouter.router.navigate(['/main/order/orderConsumeDetail/' + orderId],{fragment:'top'});
  }

  //订单添加跟进记录
  public static goAddOrderRecord(orderId, leaguerId) {
    AppRouter.router.navigate(['/main/order/addRecord', {orderId: orderId, leaguerId: leaguerId}]);
  }

  public static goEditConsumeBonus(orderId) {
    AppRouter.router.navigate(['/main/order/editConsumeBonus/' + orderId]);
  }

  public static goEditRechargeBonus(orderId) {
    AppRouter.router.navigate(['/main/order/editRechargeBonus/' + orderId]);
  }

  public static goOrderPay(orderId) {
    AppRouter.router.navigate(['/main/order/consumePay/' + orderId]);
  }

  public static goRechargeOrderPay(orderId) {
    AppRouter.router.navigate(['/main/order/rechargePay/' + orderId]);
  }

  /**
   * storeClerkInfo 店员管理
   */
  public static goFindClerk(tabIndex) {
    AppRouter.router.navigate(['/main/storeClerkInfo/findClerk/' + tabIndex]);
  }

  public static goManageRole() {
    AppRouter.router.navigate(['/main/storeClerkInfo/manageRole']);
  }

  public static goAddClerk() {
    AppRouter.router.navigate(['/main/storeClerkInfo/addClerk']);
  }

  public static goAllocationRole(clerkId) {
    AppRouter.router.navigate(['/main/storeClerkInfo/allocationRole/' + clerkId]);
  }

  public static goAddAdminRole() {
    AppRouter.router.navigate(['/main/storeClerkInfo/addAdminRole']);
  }

  public static goEditAdminRole(roleId) {
    AppRouter.router.navigate(['/main/storeClerkInfo/editAdminRole/' + roleId]);
  }

  /**
   * 店铺管理
   */
  public static goAddStore() {
    AppRouter.router.navigate(['/main/store/addStore']);
  }

  public static goFindStore() {
    AppRouter.router.navigate(['/main/store/findStore']);
  }

  public static goEditStore(storeId) {
    AppRouter.router.navigate(['/main/store/editStore/' + storeId]);
  }

  public static goStoreDetail(storeId) {
    AppRouter.router.navigate(['/main/store/storeDetail/' + storeId]);
  }

  public static goBossAddStore() {
    AppRouter.router.navigate(['/main/store/bossAddStore']);
  }

  public static goClerkApplyStore() {
    AppRouter.router.navigate(['/main/store/clerkApplyStore']);
  }

  public static goApplyStore() {
    AppRouter.router.navigate(['/main/store/applyStore']);
  }

  /**
   * storeGoods
   */
  public static goStoreGoodsList() {
    AppRouter.router.navigate(['/main/storeGoods/storeGoodsList']);
  }

  public static goFindGoodsDetail(goodsId) {
    AppRouter.router.navigate(['/main/storeGoods/goodsDetails/' + goodsId]);
  }

  public static goEditGoods(goodsDetailId) {
    AppRouter.router.navigate(['/main/storeGoods/editGoods/' + goodsDetailId]);
  }

  public static goAddStoreGoods() {
    AppRouter.router.navigate(['/main/storeGoods/addGoods']);
  }

  /**
   * storeLeaguerInfo 会员管理
   */
  public static goFindLeaguer() {
    AppRouter.router.navigate(['/main/storeLeaguerInfo/findLeaguer']);
  }

  public static goAddLeaguer(fromFlag:number) {
    AppRouter.router.navigate(['/main/storeLeaguerInfo/addLeaguer/'+fromFlag]);
  }

  public static goLeaguerDetail(leaguerId) {
    AppRouter.router.navigate(['/main/storeLeaguerInfo/leaguerDetail/' + leaguerId]);
  }

  public static goLeaguerDetailByTab(leaguerId, tabIndex) {
    AppRouter.router.navigate(['/main/storeLeaguerInfo/leaguerDetail/' + leaguerId, {tabIndex: tabIndex}]);
  }

  public static goEditLeaguer(leaguerId) {
    AppRouter.router.navigate(['/main/storeLeaguerInfo/editLeaguer/' + leaguerId]);
  }

  /**
   * userCenter 个人中心
   */
  public static goUserDetail() {
    AppRouter.router.navigate(["/main/userCenter/userDetail"]);
  }

  public static goChangePassword(){
    AppRouter.router.navigate(["/main/userCenter/changePassword"]);
  }


  /**
   * 异常模块 error
   */
  public static goExpired() {
    AppRouter.router.navigate(['/main/error/expired']);
  }


  /**
   * 指引
   */
  public static goGuide() {
    AppRouter.router.navigate(["/main/guide/guide"]);
  }

  /**
   * 欠款管理
   */
  public static goArrearageList() {
    AppRouter.router.navigate(["/main/arrearages/arrearagesList"]);
  }

  public static goArrearageDetail(leaguerId) {
    AppRouter.router.navigate(["/main/arrearages/arrearagesDetails/" + leaguerId]);
  }

  /**
   * 管理设置
   */
  public static goSettinig() {
    AppRouter.router.navigate(["/main/settings/index"]);
  }

  /***
   * 套餐管理
   */
  public static goPackageList() {
    AppRouter.router.navigate(["/main/storePackageProject/packageList"]);
  }

  public static goPackageDetail(packageDetailId) {
    AppRouter.router.navigate(["/main/storePackageProject/packageDetail/" + packageDetailId]);
  }

  public static goAddPackageProject() {
    AppRouter.router.navigate(["/main/storePackageProject/addPackage"]);
  }

  public static goEditPackageProject(packageDetailId) {
    AppRouter.router.navigate(["/main/storePackageProject/editPackage/" + packageDetailId]);
  }

  /**
   * 开单列表
   */
  public static goBillList() {
    AppRouter.router.navigate(["/main/bill/billList"]);
  }

  public static goBillDetail(workFlowId) {
    AppRouter.router.navigate(["/main/bill/billDetail/" + workFlowId]);
  }

  public static goBillDetailByComp(workFlowId, compIndex) {
    AppRouter.router.navigate(["/main/bill/billDetail/" + workFlowId, {compIndex: compIndex}]);
  }

// 收支记账
//   public static goAddIncomePay() {
//     AppRouter.router.navigate(["/main/incomePay/addIncomePay/0"]);
//   }

  public static goAddIncomePayByCagegory(category) {
    AppRouter.router.navigate(["/main/incomePay/addIncomePay/" + category]);
  }

  public static goEditIncomePay(incomePayId) {
    AppRouter.router.navigate(["/main/incomePay/editIncomePay/" + incomePayId]);
  }

  public static goIncomePayList() {
    AppRouter.router.navigate(["/main/incomePay/incomePayList"]);
  }

  public static goIncomePayTypeList() {
    AppRouter.router.navigate(["/main/incomePay/incomePayType"]);
  }

  /**
   * 数据获取
   */
  public static goPullData() {
    this.router.navigate(["/main/pullData"]);
  }

  public static goPullProduct() {
    this.router.navigate(["/main/pullData/pullProduct"]);
  }

  public static goPullGoods() {
    this.router.navigate(["/main/pullData/pullGoods"]);
  }

  public static goPullPackage() {
    this.router.navigate(["/main/pullData/pullPackage"]);
  }

  public static goPullCard() {
    this.router.navigate(["/main/pullData/pullCard"]);
  }

  public static goPullMemberCard() {
    this.router.navigate(["/main/pullData/pullMemberCard"]);
  }

  public static goPullClerk() {
    this.router.navigate(["/main/pullData/pullClerk"]);
  }

  public static goProductDetail(id) {
    this.router.navigate(["/main/pullData/productDetail/" + id]);
  }

  public static goGoodsDetail(id) {
    this.router.navigate(["/main/pullData/goodsDetail/" + id]);
  }

  public static goChainPackageDetail(id) {
    this.router.navigate(["/main/pullData/packageDetail/" + id]);
  }

  public static goChainCardDetail(id) {
    this.router.navigate(["/main/pullData/cardDetail/" + id]);
  }

  public static goChainMemberCardDetail(id) {
    this.router.navigate(["/main/pullData/memberCardDetail/" + id]);
  }

  public static goReport() {
    this.router.navigate(["/statisMain/phoneStatistic/financial"]);
  }

  //续费充值
  public static goVipCharge() {
    this.router.navigate(["/main/charge/vipCharge"]);
  }

  public static goChargePay(chargeId:string) {
    this.router.navigate(["/main/charge/chargePay/" + chargeId]);
  }

  public static goChargeList() {
    this.router.navigate(["/main/charge/chargeList"]);
  }

  //消息中心
  public static goMessageCenter() {
    this.router.navigate(["/main/buserMessage/buserMessageList"]);
  }

  //日结列表
  public static goCheckDayList() {
    this.router.navigate(["/main/checkDay/checkDayList"]);
  }

  //交班日结
  public static goCheckDayHand() {
    this.router.navigate(["/main/checkDay/checkDayHand"]);
  }
  //交班详情
  public static goCheckDayDetail(id) {
    this.router.navigate(["/main/checkDay/checkDayHandDetail/" + id]);
  }

  /**
   * 获取二维码
   */
  public static goGetQrcode() {
    AppRouter.router.navigate(['/main/storeQrcode/getQrcode']);
  }
}


