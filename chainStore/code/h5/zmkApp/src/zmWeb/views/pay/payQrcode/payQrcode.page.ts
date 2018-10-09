import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage, ViewController} from "ionic-angular";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {StoreMonitor} from "../../../comModule/session/StoreMonitor";
import {OrderMgr} from "../../../bsModule/order/orderMgr";
import {Order} from "../../../bsModule/order/data/Order";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PayQrcodeViewDataMgr} from "./payQrcodeViewDataMgr";
import {PayQrcodeViewData} from "./payQrcodeViewData";
import {PayDataWrappr} from "../payDataWrappr";
import {AppUtils} from "../../../comModule/AppUtils";
import {PayOrderForCuserForm} from "../../../bsModule/order/apiData/PayOrderForCuserForm";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";

@IonicPage({
  name: "payQrcode",
  segment: 'payQrcode'
})

@Component({
  template: `    
    <zm-modal-header title="支付二维码" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>
    <zm-page-content>
      <div w-100 style="padding-top:20px;" fxLayout="column" fxLayoutAlign="center center">
        <div style="width:250px;height:250px;"><img style="width:100%;height:100%;" src="{{viewData.payResp.imgUrl | zmImgPath}}"/></div>
        <div style="margin-top:50px;width:200px;"><button (click)="refreshClick()" block ion-button>刷新状态</button></div>
      </div>
  
      <ion-card style="margin-top:20px;">
        <ion-card-header>
            <span style="color:red;">*</span> 说明：
        </ion-card-header>
        <ion-card-content style="color:gray;">
        选择微信支付或者支付宝支付后，
        请先保存付款二维码至手机相册，
        然后打开微信/支付宝扫一扫，
        再点击扫一扫右上角的相册，扫描已保存的付款二维码进行付款，
        付款完成后进入小程序——我的订单找到对应订单点击确定支付完成订单支付。
        </ion-card-content>
      </ion-card>

    </zm-page-content>

  `
})
export class PayQrcodePage {

  private service: PayQrcodeService;
  private viewDataSub: any;
  public viewData: PayQrcodeViewData = new PayQrcodeViewData;
  modalCtrl:ModalCtrl;
  constructor(private cdRef: ChangeDetectorRef,
              private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    this.service = new PayQrcodeService();

    let initData = new PayQrcodeViewData();

    this.viewDataSub = PayQrcodeViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: PayQrcodeViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    StoreMonitor.getInstance().subscribe({}, () => {
      this.initData();
    });

  }

  ionViewDidEnter() {
    this.initData();
  }

  private initData() {
    this.service.initViewData();
  }

  async refreshClick(){
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let orderId = this.viewData.order.id;
    OrderMgr.getInstance().get(storeId,orderId).then((orderTmp:Order)=>{
      let isPaySuccess: boolean = false;
      if(!AppUtils.isNullObj(orderTmp.payItems)){
        for(let i=0;i<orderTmp.payItems.length;i++){
          let payItem = orderTmp.payItems[i];
          if(orderTmp.cost = payItem.cost){
            isPaySuccess = true;
            break;
          }
        }
      }
      if(isPaySuccess){
        AppUtils.showSuccess("提示","支付成功");
        OrderMgr.getInstance().payOrder(PayOrderForCuserForm.from(orderTmp));
        this.modalCtrl.dismiss(null);
        AppRouter.getInstance().goPaySuccessPage();
      }else{
        AppUtils.showInfo("提示","未支付成功，请重试");
      }
    });

  }

}

export class PayQrcodeService {

  constructor() {}

  public initViewData() {
    let viewDataTmp = new PayQrcodeViewData();
    PayQrcodeViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData((viewData: PayQrcodeViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: PayQrcodeViewData) {
    PayQrcodeViewDataMgr.getInstance().setData(viewDataP);
    PayDataWrappr.getInstance().setOrder(viewDataP.order);
  }

  public async buildViewData(callback: (viewDataP: PayQrcodeViewData) => void) {
    let viewDataTmp = new PayQrcodeViewData();
    viewDataTmp.order = PayDataWrappr.getInstance().getOrder();
    viewDataTmp.payResp = PayDataWrappr.getInstance().getPayResp();
    callback(viewDataTmp);
  }

}






