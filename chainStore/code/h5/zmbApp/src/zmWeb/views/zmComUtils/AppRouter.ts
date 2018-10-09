import {NavController, ModalController, NavParams} from "ionic-angular";
import {MgrPool} from "../../comModule/MgrPool";
import {TimeSlotEnum} from "../zmComp/form/date/timeSlot/TimeSlotEnum";
import {TimeSlot} from "../zmComp/form/date/timeSlot/TimeSlot";
import {Dynamic} from "../../bsModule/dynamic/data/Dynamic";
/**
 * 页面路由跳转
 */

export class AppRouter {

  public static getInstance(): AppRouter {
    return MgrPool.getInstance().get("AppRouter", AppRouter);
  }

  private navCtrl: NavController;
  private modalCtrl: ModalController;

  constructor() {
  }

  public initRouter(navCtrl: NavController, modalCtrl: ModalController) {
    this.navCtrl = navCtrl;
    this.modalCtrl = modalCtrl;
  }

  public openModal(modalName, callBackFun) {
    this.openModalWithTargetId(modalName, null, callBackFun);
  }

  /**
   e.g
   AppRouter.getInstance().openModalWithTargetId("RegPage","targetId",(data)=>{
          console.log(data);
    });
   */
  public openModalWithTargetId(modalName: string, targetId: string, callBackFun) {
    let queryParams: QueryParams = null;
    if (targetId) {
      queryParams = QueryParams.newWithTargetId(targetId);
    }
    let modal = this.modalCtrl.create(modalName, queryParams);
    modal.onDidDismiss((data) => {
      if (callBackFun) {
        callBackFun(data);
      }
    });
    modal.present();
  }

  public openModelWithTargetObj(modalName: string, targetObj: any, callBackFun) {
    let queryParams:QueryParams = null;
    if(targetObj){
      queryParams = QueryParams.newWithTargetObj(targetObj);
    }
    let modal = this.modalCtrl.create(modalName, queryParams);
    modal.onDidDismiss((data) => {
      if (callBackFun) {
        callBackFun(data);
      }
    });
    modal.present();
  }

  private setRoot(pageName: string) {
    this.navCtrl.setRoot(pageName);
  }

  public pop() {
    this.navCtrl.pop();
  }


  public push(path:string){
    this.pushWithTargetId(path,null)
  }

  private pushWithTargetId(pageName: string, targetId: string) {
    let queryParams: QueryParams = null;
    if (targetId) {
      queryParams = QueryParams.newWithTargetId(targetId);
    }
    this.navCtrl.push(pageName, queryParams);
  }

  private pushWithTargetObj(pageName: string, targetObj: any) {
    let queryParams: QueryParams = null;
    if (targetObj) {
      queryParams = QueryParams.newWithTargetObj(targetObj);
    }
    this.navCtrl.push(pageName, queryParams);
  }

  private pushWithTargetObjAndCallback(pageName: string, targetObj: any, targetCallback:any) {
    let queryParams = QueryParams.newWithTargetObjAndCallback(targetObj,targetCallback);
    this.navCtrl.push(pageName, queryParams);
  }


  public getTargetId(navParams: NavParams): string {
    return navParams.get("targetId");
  }

  public getTargetObj(navParams: NavParams): any {
    return navParams.get("targetObj");
  }

  public getTargetCallback(navParams: NavParams): any {
    return navParams.get("targetCallback");
  }



  public goLogin(){
    this.setRoot("loginPage");
  }

  public goMain() {
    this.setRoot("main");
  }

  public goMyPage() {
    this.push("myPage");
  }

  public goAppointmentPage() {
    this.push("appointment");
  }

  //订单
  public goOrderListPage(){
    this.push("orderList");
  };

  public goOrderDetailPage(){
    this.push("orderDetail");
  };

  public goOrderDetailPageWithId(orderId:string){
    this.pushWithTargetId("orderDetail",orderId);
  };

  //动态
  public goAddDynamicPage(){
    this.push("addDynamic");
  };

  public goSharePage(dynamic:Dynamic){
    this.openModelWithTargetObj("share",dynamic,null);
  };


  // 开单管理
  public goWorkFlowListPage(){
    this.push("workFlowList");
  };


  public goOpenWFPage(){
    this.push("openWF");
  };

  // 填写订单 => 地址选择列表
  public goAddressSelectListPage(callbackFun) {
    this.openModal("addressSelectList", callbackFun);
  }


  public goProtocolPage(){
    this.push("protocol");
  };


  /**
   * 预约列表
   */
  public goMyAppointPage() {
    this.push("appointList");
  }

  /**
   * 预约详情
   */
  public goAppointDetailPage(appointId: string) {
    this.pushWithTargetId("appointDetail", appointId);
  }

  public goProductListPage(callbackFun) {
    this.openModal("selectProduct", callbackFun);
  }


  public goMainWUnitEdit(wunitId:string){
    this.pushWithTargetId("mainWUniEdit",wunitId);
  }

  public goMainWUnitAdd(onAddFinish) {
    this.openModal("mainWUniAdd", onAddFinish)
  }


  public goAddImg() {
    this.openModal("multiImgUpload", null);
  }


  public goUserDetailPage(){
    this.push("userDetail");
  }

  //时间段选择组件
  public goSelectTime(timeSlotEnums:Array<TimeSlotEnum>,curValue:TimeSlot,callbackFun) {
    this.openModelWithTargetObj("zmTimeSlot",{timeSlotEnums,curValue},callbackFun);
  }

  /**
   * 会员管理
   */
  public goLeaguerList() {
    this.push("leaguerList");
  }

  /**
   * 数据统计
   */
  public goDataReport() {
    this.push("dataReportHome");
  }

  public goLeaguerDetailPage(id: string) {
    this.pushWithTargetId("leaguerDetail", id);
  }

  public goLeaguerAttributePage(id:string){
    this.pushWithTargetId("leaguerAttribute",id);
  }

  public goAddLeaguerPage(){
    this.push("addLeaguer");
  }

  public goAddLabelPage(callbackFun){
    this.openModal("addLabel",callbackFun);
  }

  public goSelectStaffPage(targetObj, callbackFun){
    // this.openModal("selectStaff",callbackFun);
    this.pushWithTargetObjAndCallback("selectStaff",targetObj,callbackFun);
  }

  public goEditLeaguerPage(id:string){
    this.pushWithTargetId("editLeaguer",id);
  }

  public goMessageList(){
    this.push("messageList");
  }

  public goQrcodePage(){
    this.push("qrcodePage");
  }

  public goChangePasswordPage(buser){
    this.pushWithTargetObj("changePassword", buser);
  }

  /**
   * 我的预约 => 预约列表
   */
  public goMyAppointmentList(isFromHomePage){
    this.pushWithTargetObj("appointmentList",isFromHomePage);
  }

  public goAppointCancelReasonPage(appointId){
    this.pushWithTargetId("appointCancelReason", appointId);
  }

  public goAppointmentAddPage(){
    this.push("appointmentAdd");
  }

  public goProductSelectList(callBackFun){
    this.pushWithTargetObj("productSelectList",callBackFun);
  }

  /**
   * 我的提成
   */
  public goMyBonusPage(){
    this.push("myBonus");
  }

  /**
   * 选择员工
   */
  goBuserSelect(callbackFun){
    this.pushWithTargetObj("buserSelect",callbackFun);
  }

  /**
   * 选择会员
   */
  goLeaguerSelect(callbackFun){
    this.pushWithTargetObj("leaguerSelect",callbackFun);
  }
}


class QueryParams{
  targetId:string;
  storeId:string;
  targetObj:any;
  targetCallback:any;

  public static newWithTargetId(targetId:string):QueryParams{
    let target:QueryParams = QueryParams.newParam();
    target.targetId = targetId;
    return target;
  }

  public static newWithTargetObj(targetObjP: any): QueryParams {
    let target: QueryParams = QueryParams.newParam();
    target.targetObj = targetObjP;
    return target;
  }

  public static newWithTargetObjAndCallback(targetObjP: any, targetCallbackP: any): QueryParams {
    let target: QueryParams = QueryParams.newParam();
    target.targetObj = targetObjP;
    target.targetCallback = targetCallbackP;
    return target;
  }

  public static newParam():QueryParams{
    let target:QueryParams = new QueryParams();
    // let storeId = SessionUtil.getInstance().getCurStoreId();
    // target.storeId = storeId;
    return target;
  }

}

