import {
  Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, OnDestroy,
  ChangeDetectionStrategy
} from "@angular/core";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {CUserMgr} from "../../../bsModule/cuser/CUserMgr";
import {CUser} from "../../../bsModule/cuser/data/CUser";
import {AppUtils} from "../../../comModule/AppUtils";
import {ReceiverAddress} from "../../../bsModule/cuser/data/ReceiverAddress";
import {AddressSelectCompViewDataMgr} from "./addressSelectCompViewDataMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";

//  <address-select-comp [(addressVD)]= "" ></address-select-comp>
@Component({
  selector:'address-select-comp',
  template: `


    <ion-row>
      <div fxLayout="row" fxLayoutAlign="start center" w-100 style="padding:0 10px 10px 10px;">
        <div fxLayout="column" fxLayoutGap="5px" style="width:100%;">
          <div fxLayout="row">
            <div fxLayout="row" fxLayoutAlign="space-between center" fxFlex="1 1">
              <span>{{addressVD.receiver}}</span>
              <span> {{addressVD.phone}}</span>
            </div>
          </div>
          <div (click)="goAddressSelectListPage()" fxLayout="row" fxLayoutAlign="space-between center">
            <div overflow-hidden-2 fxFlex="1 1 90%" *ngIf="!isNullDefaultAddress()">
              <span>{{addressVD.addressArea}}</span>&nbsp;<span>{{addressVD.addressDetail}}</span>
            </div>
            <div *ngIf="isNullDefaultAddress()" fxFlex="1 1 90%">请选择地址</div>
            <ion-icon name="arrow-forward"></ion-icon>
          </div>
        </div>
      </div>
    </ion-row>


  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class AddressSelectComp implements OnInit,OnDestroy{


  private viewDataSub: any;

  /**
   * addressVD 双向绑定
   */
  private addressVDTmp: ReceiverAddress = new ReceiverAddress();
  @Output() addressVDChange = new EventEmitter();
  @Input()
  get addressVD() {
    return this.addressVDTmp;
  }
  set addressVD(val) {
    this.addressVDTmp = val;
    this.addressVDChange.emit(this.addressVD);
  }

  constructor(private cdRef: ChangeDetectorRef) {
    let initData = new ReceiverAddress();
    this.viewDataSub = AddressSelectCompViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: ReceiverAddress) => {
      this.addressVD = viewDataP;
      this.cdRef.markForCheck();
    });

  }

  ngOnInit(){
    this.initData();
  }

  ngOnDestroy() {
  }

  initData(){
    // this.initDefaultAddress();
  }

  async initDefaultAddress(){
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let cuser:CUser = await CUserMgr.getInstance().getCUser(cuserId);
    if(!AppUtils.isNullObj(cuser)){
      let defaultAddress = cuser.getDefaultAddress();
      AddressSelectCompViewDataMgr.getInstance().setData(defaultAddress);
    }

  }

  isNullDefaultAddress(){
    return AppUtils.isNullOrWhiteSpace(this.addressVD.addressArea);
  }

  goAddressSelectListPage(){
    AppRouter.getInstance().goAddressSelectListPage(this.selectedCallback.bind(this));
  }

  selectedCallback(addressP:ReceiverAddress){
    if(!AppUtils.isNullObj(addressP)){
      AddressSelectCompViewDataMgr.getInstance().setData(addressP);
    }
  }


}

