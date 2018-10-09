import {Component,  ChangeDetectorRef} from "@angular/core";
import {IonicPage, NavParams, ViewController} from "ionic-angular";
import { CityDataProvider } from "../cityDataProvider/cityDataProvider";
import {ReceiverAddress} from "../../../bsModule/cuser/data/ReceiverAddress";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {AddressEditViewDataMgr} from "./addressEditViewDataMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {CUserMgr} from "../../../bsModule/cuser/CUserMgr";
import {CUser} from "../../../bsModule/cuser/data/CUser";
import {DefaultFlagEnum} from "../../../bsModule/cuser/data/DefaultFlagEnum";
import {CUserAddressUpdateForm} from "../../../bsModule/cuser/apiData/CUserAddressUpdateForm";
import {AppUtils} from "../../../comModule/AppUtils";
import {Constants} from "../../zmComUtils/Constants";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {AlertUtils} from "../../zmComUtils/AlertUtils";
import {CUserAddressRemoveForm} from "../../../bsModule/cuser/apiData/CUserAddressRemoveForm";


@IonicPage({
  name: "addressEdit",
  segment: 'addressEdit'
})
@Component({
  template: `
        <!--<zm-page-header title="编辑地址"></zm-page-header>-->
            <zm-modal-header title="编辑地址" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>
            <zm-page-content>
                <div mb-100-p>
                
                    <div  fxLayout="row" fxLayoutAlign="space-between center"  style="border-bottom:1px solid #ccc;padding:12px 16px">
                        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px"  style="width:93%;">
                          <span style="width:60px;color:gray;">收货人</span>
                          <ion-input  class="text-right" type="text" maxlength="10" placeholder="姓名" [(ngModel)]="viewData.address.receiver" no-margin></ion-input>

                        </div>
                          <span style="font-size:20px;"> <ion-icon ios="ios-close" style="color:gray" (click)="clearReceiver()"></ion-icon></span>
                    </div>
               
                    <div  fxLayout="row" fxLayoutAlign="space-between center"  style="border-bottom:1px solid #ccc;padding:12px 16px">
                        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" style="width:93%;">
                          <span style="width:60px;color:gray;">联系方式</span>
                          <ion-input class="text-right" type="tel" maxlength="11"  placeholder="手机号码" [(ngModel)]="viewData.address.phone" no-margin></ion-input>
                        </div>
                          <span style="font-size:20px;"> <ion-icon ios="ios-close" style="color:gray" (click)="clearPhone()"></ion-icon></span>
                    </div>

                    <div  fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px" style="border-bottom:1px solid #ccc;padding-right:10px;">
                        <button zmk-item-sm ion-item fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px"  style="width:100%;font-size:14px;">
                          <ion-label style="width:60px;color:gray;font-size:14px;">所在地区</ion-label>
                          <ion-multi-picker item-content [multiPickerColumns]="cities" [(ngModel)] = "viewData.address.addressPickerValue" [cancelText]="'取消'" [doneText]="'完成'"></ion-multi-picker>
                        </button>
                    </div>

                    <div  fxLayout="row" fxLayoutAlign="space-between center"  style="border-bottom:1px solid #ccc;padding:12px 16px">
                        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" style="width:95%;">
                          <span style="width:60px;color:gray;">详细地址</span>
                          <ion-input class="text-right" type="text" maxlength="50" placeholder="如街道名称，楼层，门牌号等" [(ngModel)]="viewData.address.addressDetail"  no-margin></ion-input>
                          <!--<ion-textarea maxlength="50" placeholder="如街道名称，楼层，门牌号等" [(ngModel)]="viewData.address.addressDetail"  no-margin></ion-textarea>-->
                        </div>
                          <span style="font-size:20px;"> <ion-icon ios="ios-close" style="color:gray" class="mx-0" (click)="clearAddressDetail()"></ion-icon></span>
                    </div>

                    <zm-img-radio [trackType]="viewData.address.defaultFlag==1" [label]="'设为默认地址'" (zmClick)="onDefaultFlagChange()"></zm-img-radio>
                  <div style="padding:15px 0;">
                    <zm-btn-sub [name]="'保存'" (zmbtnClick)="saveBtnClick()"></zm-btn-sub>
                    <zm-btn-sub  [outline]="true" [name]="'删除地址'" (zmbtnClick)="removeBtnClick()"></zm-btn-sub>
                  </div>

                </div>
           
            </zm-page-content>

    `,
  styles: [`
   
 .ion-ios-close:before {
      margin: 0;
  }
  .text-right input{
    text-align:right;
    padding-right:5px;
  }
  .text-input-ios {
  
    width: calc(100% - 0px);
}

      `],
})

export class AddressEditPage {

  private service: AddressEditService;
  private viewDataSub: any;
  public viewData: AddressEditViewData = new AddressEditViewData();

  cities: Array<any>;
  public modalCtrl:ModalCtrl;

  constructor( private cdRef: ChangeDetectorRef,
               public navParams: NavParams,
               private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    this.cities = CityDataProvider.getInstance().getCities();
    this.service = new AddressEditService();
    let initData = new AddressEditViewData();
    this.viewDataSub = AddressEditViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: AddressEditViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
  }


  ionViewDidEnter() {
    this.initViewData();
  }

  private initViewData() {
    let addressId = AppRouter.getInstance().getTargetId(this.navParams);
    this.service.initViewData(addressId);
  }

  async saveBtnClick(){
    let updateForm = this.buildUpdateForm();
    if(!updateForm.isValid()){
      AppUtils.showWarn("","请将地址信息填写完整");
      return;
    }else{
      let cuserId = SessionUtil.getInstance().getLoginCUserId();
      let success = await this.service.updateAddress(cuserId, updateForm);
      this.handleResult(success, "添加");
    }
  }

  removeBtnClick(){
    AlertUtils.getInstance().showConfirm("删除地址","确定要删除地址吗？", this.doRemoveAddress.bind(this), null);
  }

  async doRemoveAddress(){
    let removeForm = this.buildRemoveForm();
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let success = await this.service.removeAddress(cuserId, removeForm);
    this.handleResult(success, "删除");

  }

  handleResult(success:boolean, operationName:string){
    if(success){
      AppUtils.showSuccess("", operationName + "成功");
      // AppRouter.getInstance().pop();
      this.modalCtrl.dismiss(null);
    }else{
      AppUtils.showError("", operationName + "失败");
    }
  }


  buildUpdateForm():CUserAddressUpdateForm{
    let updateForm = new CUserAddressUpdateForm();
    AppUtils.copy(updateForm, this.viewData.address);
    updateForm.addressArea = CityDataProvider.getInstance().getAddressAreaStr(this.viewData.address.addressPickerValue);
    return updateForm;
  }

  buildRemoveForm():CUserAddressRemoveForm{
    let removeForm = new CUserAddressRemoveForm();
    removeForm.addressId = this.viewData.address.id;
    return removeForm;
  }

  onDefaultFlagChange(){
    if(this.viewData.address.defaultFlag == DefaultFlagEnum.IS_DEFAULT){
      this.viewData.address.defaultFlag = DefaultFlagEnum.NON_DEFAULT;
    }else if(this.viewData.address.defaultFlag == DefaultFlagEnum.NON_DEFAULT){
      this.viewData.address.defaultFlag = DefaultFlagEnum.IS_DEFAULT;
    }
  }

  clearReceiver(){
    this.viewData.address.receiver = Constants.BLANK_STRING;
  }

  clearPhone(){
    this.viewData.address.phone = Constants.BLANK_STRING;
  }

  clearAddressDetail(){
    this.viewData.address.addressDetail = Constants.BLANK_STRING;
  }
}

export class AddressEditViewData{
  address:ReceiverAddress = new ReceiverAddress();
}

export class AddressEditService{

  public initViewData(addressId) {
    let viewDataTmp = new AddressEditViewData();
    AddressEditViewDataMgr.getInstance().setData(viewDataTmp);
    this.buildViewData(addressId);
  }

  private async buildViewData(addressId) {
    let viewDataTmp = new AddressEditViewData();
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let cuser:CUser = await CUserMgr.getInstance().getCUser(cuserId);
    if(cuser && cuser.addressMap){
      let addressList = cuser.getAddressList();
      addressList.forEach((addressTmp)=>{
        if(addressTmp.id == addressId){
          viewDataTmp.address = addressTmp;
        }
      });
    }
    AddressEditViewDataMgr.getInstance().setData(viewDataTmp);
  }

  public updateAddress(cuserId, updateForm: CUserAddressUpdateForm){
    return new Promise<boolean>(resolve => {
      CUserMgr.getInstance().updateAddress(cuserId, updateForm).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  public removeAddress(cuserId, removeForm: CUserAddressRemoveForm){
    return new Promise<boolean>(resolve => {
      CUserMgr.getInstance().removeAddress(cuserId, removeForm).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

}



