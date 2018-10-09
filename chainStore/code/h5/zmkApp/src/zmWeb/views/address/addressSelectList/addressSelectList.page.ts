import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {IonicPage, ViewController} from "ionic-angular";
import { AppRouter } from "../../zmComUtils/AppRouter";
import {ReceiverAddress} from "../../../bsModule/cuser/data/ReceiverAddress";
import {AddressListViewDataMgr} from "./addressSelectListViewDataMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {CUserMgr} from "../../../bsModule/cuser/CUserMgr";
import {CUser} from "../../../bsModule/cuser/data/CUser";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {Constants} from "../../zmComUtils/Constants";
import {AppUtils} from "../../../comModule/AppUtils";



@IonicPage({
  name: "addressSelectList",
  segment: 'addressSelectList'
})
@Component({
  template: `
        <zm-modal-header title="地址列表" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>
        <zm-page-content>
            <div mb-100-p>
              <zmk-address-select-item *ngFor="let item of viewData.addressList" [item]="item" 
                                       (onRadioClick)="radioClick($event)"
                                       (onItemEditClick)="goAddressEditPage($event)" ></zmk-address-select-item>
              <zm-no-data *ngIf="viewData.loadingFinish && viewData.addressList.length <= 0" ></zm-no-data>
            </div>
        </zm-page-content>
        <ion-footer>
          <zm-btn-sub [name]="'添加新地址'" (zmbtnClick)="goAddressAddPage()"></zm-btn-sub>
        </ion-footer>
    `,
  styles: [`
  

      `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddressSelectListPage {

  private viewDataSub: any;
  public viewData: AddressSelectListViewData = new AddressSelectListViewData();
  private service: AddressSelectListService;
  public modalCtrl:ModalCtrl;

  constructor(private cdRef: ChangeDetectorRef,private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    this.service = new AddressSelectListService();
    let initData = new AddressSelectListViewData();
    this.viewDataSub = AddressListViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: AddressSelectListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
  }

  ionViewDidEnter(){
    this.initData();
  }

  initData(){
    this.service.initViewData();
  }

  radioClick(address:ReceiverAddress){
    this.modalCtrl.dismiss(address);
  }

  goAddressEditPage(addressId){
    console.log(addressId);
    AppRouter.getInstance().goAddressEditPage(addressId, this.initData.bind(this));
  }

  goAddressAddPage(){
    if(this.isNotExceedAddressLimit()) {
      AppRouter.getInstance().goAddressAddPage(this.initData.bind(this));
    }
  }

  isNotExceedAddressLimit(){
    let addressLimit = Constants.CUSER_ADDRESS_LIMIT;
    if(this.viewData.addressList && this.viewData.addressList.length >= addressLimit){
      AppUtils.showWarn("","最多只能添加" + addressLimit + "个收货地址");
      return false;
    }
    return true;
  }

}


export class AddressSelectListViewData{
  addressList: Array<ReceiverAddress> = new Array<ReceiverAddress>();

  loadingFinish:boolean = false;
}


export class AddressSelectListService{

  public initViewData() {
    let viewDataTmp = new AddressSelectListViewData();
    AddressListViewDataMgr.getInstance().setData(viewDataTmp);
    this.buildViewData();
  }

  private async buildViewData() {
    let viewDataTmp = new AddressSelectListViewData();

    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let cuser:CUser = await CUserMgr.getInstance().getCUser(cuserId);
    if(cuser && cuser.addressMap){
      let addressList = cuser.getAddressList();
      viewDataTmp.addressList = addressList;
    }

    viewDataTmp.loadingFinish = true;
    AddressListViewDataMgr.getInstance().setData(viewDataTmp);
  }
}



