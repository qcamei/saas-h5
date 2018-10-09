import {NavController, ModalController, NavParams} from "ionic-angular";
import {MgrPool} from "../../comModule/MgrPool";
/**
 * 页面路由跳转
 */

export class AppRouter {

  public static getInstance():AppRouter{
    return MgrPool.getInstance().get("AppRouter",AppRouter);
  }

  private navCtrl: NavController;
  private modalCtrl: ModalController;

  constructor(){}

  public initRouter( navCtrl: NavController,modalCtrl: ModalController){
    this.navCtrl = navCtrl;
    this.modalCtrl = modalCtrl;
  }

  public openModal( modalName, callBackFun ){
    this.openModalWithTargetId(modalName,null,callBackFun);
  }

  /**
   e.g
   AppRouter.getInstance().openModalWithTargetId("RegPage","targetId",(data)=>{
          console.log(data);
    });
   */
  public openModalWithTargetId( modalName:string,targetId:string, callBackFun ){
    let queryParams:QueryParams = null;
    if(targetId){
      queryParams = QueryParams.newWithTargetId(targetId);
    }
    let modal = this.modalCtrl.create(modalName,queryParams);
    modal.onDidDismiss((data)=>{
      if(callBackFun){
        callBackFun(data);
      }
    });
    modal.present();
  }

  private setRoot(pageName:string){
    this.navCtrl.setRoot(pageName);
  }

  public pop(){
    this.navCtrl.pop();
  }

  private push(path:string){
    this.pushWithTargetId(path,null)
  }

  private pushWithTargetId(pageName:string, targetId:string){
    let queryParams:QueryParams = null;
    if(targetId){
      queryParams = QueryParams.newWithTargetId(targetId);
    }
    this.navCtrl.push(pageName,queryParams);
  }

  public getTargetId(navParams: NavParams):string{
    return navParams.get("targetId");
  }


  public goLogin(){
    this.setRoot("loginPage");
  }

  public goMain(){
    this.setRoot("main");
  }

  public goMyPage(){
    this.push("myPage");
  }

  public goAppointmentPage(){
    this.push("appointment");
  }

  //goods
  public goAddOrderPage(){
    this.push("addOrder");
  }

  public goAddOrderPageWithId(orderId:string){
    this.pushWithTargetId("addOrder",orderId);
  }

  public goMallPage(){
    this.push("mallList");
  }

  public goPayTypeSelectPage(orderId:string){
    this.pushWithTargetId("payTypeSelect",orderId);
  }

  public goPayQrcodePage(){
    AppRouter.getInstance().openModal("payQrcode",null);
  }

  public goPaySuccessPage(){
    this.push("paySuccess");
  }

  public goWaitForPayPage(orderId:string){
    this.pushWithTargetId("waitForPay",orderId);
  }

//my
  public goMyPreCardPage(){
    this.push("myPreCard");
  }

  public goMyMemCardPage(){
    this.push("myMemCard");
  }

  public goMemCardDetailPage(memCardId:string){
    this.pushWithTargetId("memCardDetail",memCardId);
  }

  public goMyProductCardPage(){
    this.push("myProductCard");
  }

  public goPrdCardDetailPage(prdCardId:string){
    this.pushWithTargetId("productCardDetail",prdCardId);
  }

  // public goPayCodePage(){
  //   this.push("payCodePage");
  // }

  // public goPayTypeSelectPage(orderId:string){
  //   this.pushWithTargetId("payTypeSelect",orderId);
  // }

  // public goMyInfoPage(){
  //   this.push("myInfo");
  // }

  public goMyInfoPage(callbackFun){
    this.openModal("myInfo", callbackFun);
  }

  public goMyOrderPage(){
    this.push("myOrder");
  };

  public goMyOrderDetailPage(){
    this.push("orderDetail");
  };

  public goOrderDetailPage(orderId:string){
    this.pushWithTargetId("orderDetail",orderId);
  };

  public goAboutUs(){
    this.push("aboutUs");
  };

  public goProtocolPage(){
    this.push("protocol");
  };


  // 我的地址 => 地址列表
  public goAddressListPage(){
    this.push("addressList");
  }

  // 填写订单 => 地址选择列表
  public goAddressSelectListPage(callbackFun){
    this.openModal("addressSelectList", callbackFun);
  }

  // 地址编辑
  public goAddressEditPage(addressId:string, callbackFun){
    // this.pushWithTargetId("addressEdit",addressId);
    this.openModalWithTargetId("addressEdit",addressId, callbackFun);
  }

  // 地址新增
  public goAddressAddPage(callbackFun){
    // this.push("addressAdd");
    this.openModal("addressAdd", callbackFun);
  }

  /**
   * 预约列表
   */
  public goMyAppointPage(){
    this.push("appointList");
  }

  /**
   * 预约详情
   */
  public goAppointDetailPage(appointId:string){
    this.pushWithTargetId("appointDetail",appointId);
  }

  public goProductListPage(callbackFun){
    this.openModal("selectProduct", callbackFun);
  }

  public goSelectStaffPage(callbackFun){
    this.openModal("selectStaff", callbackFun)
  }

  public goMainWUnitEdit(wunitId:string){
    this.pushWithTargetId("mainWUniEdit",wunitId);
  }
  public goMainWUnitAdd(onAddFinish){
    this.openModal("mainWUniAdd",onAddFinish)
  }


  public goAddImg(){
    this.openModal("multiImgUpload",null);
  }




}




class QueryParams{
  targetId:string;
  wunitId:string;
  storeId:string;

  public static newWithTargetId(targetId):QueryParams{
    let target:QueryParams = QueryParams.newParam();
    target.targetId = targetId;
    return target;
  }

  public static newParam():QueryParams{
    // let wunitId = SessionUtil.getInstance().getCurWUnitId();
    let target:QueryParams = new QueryParams();
    // target.wunitId = wunitId;
    target.storeId = "1";
    target.wunitId = "1";
    return target;
  }

}

