import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {IonicPage} from "ionic-angular";
import { AppRouter } from "../../zmComUtils/AppRouter";
import {ReceiverAddress} from "../../../bsModule/cuser/data/ReceiverAddress";
import {AddressListViewDataMgr} from "./addressListViewDataMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {CUserMgr} from "../../../bsModule/cuser/CUserMgr";
import {CUser} from "../../../bsModule/cuser/data/CUser";
import {Constants} from "../../zmComUtils/Constants";
import {AppUtils} from "../../../comModule/AppUtils";



@IonicPage({
  name: "addressList",
  segment: 'addressList'
})
@Component({
  template: `
        <zm-page-header title="地址列表"></zm-page-header>
             
        <zm-page-content>
            <div mb-100-p>
              <zmk-address-item *ngFor="let item of viewData.addressList" [item]="item" 
                                (onItemClick)="goAddressEditPage($event)" ></zmk-address-item>
              <zm-no-data *ngIf="viewData.loadingFinish && viewData.addressList.length <= 0" ></zm-no-data>
            </div>
        </zm-page-content>
        <ion-footer style="background:#fff;">
          <zm-btn-sub [name]="'添加新地址'" (zmbtnClick)="goAddressAddPage()"></zm-btn-sub>
        </ion-footer>
    `,
  styles: [`
  

      `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddressListPage {

  private viewDataSub: any;
  public viewData: AddressListViewData = new AddressListViewData();
  private service: AddressListService;

  constructor(private cdRef: ChangeDetectorRef) {
    this.service = new AddressListService();
    let initData = new AddressListViewData();
    this.viewDataSub = AddressListViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: AddressListViewData) => {
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

  goAddressEditPage(addressId){
    console.log(addressId);
    AppRouter.getInstance().goAddressEditPage(addressId, this.initData.bind(this));
  }

  goAddressAddPage(){
    if(this.isNotExceedAddressLimit()){
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


export class AddressListViewData{
  addressList: Array<ReceiverAddress> = new Array<ReceiverAddress>();

  loadingFinish:boolean = false;
}


export class AddressListService{

  public initViewData() {
    let viewDataTmp = new AddressListViewData();
    AddressListViewDataMgr.getInstance().setData(viewDataTmp);
    this.buildViewData();
  }

  private async buildViewData() {
    let viewDataTmp = new AddressListViewData();
    AppUtils.showLoading(viewDataTmp.loadingFinish);

    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let cuser:CUser = await CUserMgr.getInstance().getCUser(cuserId);
    if(cuser && cuser.addressMap){
      let addressList = cuser.getAddressList();
      viewDataTmp.addressList = addressList;
    }
    viewDataTmp.loadingFinish = true;
    AppUtils.hideLoading(viewDataTmp.loadingFinish);
    AddressListViewDataMgr.getInstance().setData(viewDataTmp);
  }
}



