import {Component,  ChangeDetectorRef} from "@angular/core";
import {IonicPage, ViewController} from "ionic-angular";
import { CityDataProvider } from "../cityDataProvider/cityDataProvider";
import {AddressAddViewDataMgr} from "./addressAddViewDataMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {DefaultFlagEnum} from "../../../bsModule/cuser/data/DefaultFlagEnum";
import {ReceiverAddress} from "../../../bsModule/cuser/data/ReceiverAddress";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {CUserMgr} from "../../../bsModule/cuser/CUserMgr";
import {CUserAddressAddForm} from "../../../bsModule/cuser/apiData/CUserAddressAddForm";
import {AppUtils} from "../../../comModule/AppUtils";
import {Constants} from "../../zmComUtils/Constants";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";


@IonicPage({
  name: "addressAdd",
  segment: 'addressAdd'
})
@Component({
  template: `
            <!--<zm-page-header title="新增地址"></zm-page-header>-->
            <zm-modal-header title="新增地址" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header> 
            <zm-page-content>
                <div mb-100-p>
                
                    <div  fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px" style="border-bottom:1px solid #ccc;padding:12px 16px">
                        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px"  style="width:87%;">
                          <span style="width:60px;color:gray;">收货人</span>
                          <ion-input class="text-right" type="text" maxlength="10" placeholder="姓名" [(ngModel)]="viewData.address.receiver" no-margin></ion-input>

                        </div>
                          <span style="font-size:20px;"> <ion-icon ios="ios-close" style="color:gray" (click)="clearReceiver()"></ion-icon></span>
                    </div>
               
                    <div  fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px" style="border-bottom:1px solid #ccc;padding:12px 16px">
                        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" style="width:87%;">
                          <span style="width:60px;color:gray;">联系方式</span>
                          <ion-input class="text-right" type="tel" maxlength="11"  placeholder="手机号码" [(ngModel)]="viewData.address.phone" no-margin></ion-input>
                        </div>
                          <span style="font-size:20px;"> <ion-icon ios="ios-close" style="color:gray" (click)="clearPhone()"></ion-icon></span>
                    </div>

                    <div  fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px" style="border-bottom:1px solid #ccc;padding-right:10px;">
                        <button zmk-item-sm ion-item fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px"  style="width:100%;font-size:14px;">
                          <ion-label style="width:60px;color:gray;font-size:14px;">所在地区</ion-label>
                          <ion-multi-picker item-content [multiPickerColumns]="cities" [(ngModel)]="viewData.address.addressPickerValue" [cancelText]="'取消'" [doneText]="'完成'"></ion-multi-picker>
                        </button>
                    </div>

                    <div  fxLayout="row" fxLayoutAlign="space-between center"  style="border-bottom:1px solid #ccc;padding:12px 16px">
                        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" style="width:95%;">
                          <span style="width:60px;color:gray;">详细地址</span>
                          <ion-input class="text-right" type="text" maxlength="50" placeholder="如街道名称，楼层，门牌号等"  [(ngModel)]="viewData.address.addressDetail"  no-margin></ion-input>
                        </div>
                          <span style="font-size:20px;"> <ion-icon ios="ios-close" style="color:gray" class="mx-0" (click)="clearAddressDetail()"></ion-icon></span>
                    </div>
                    
                    <zm-img-radio [trackType]="viewData.address.defaultFlag==1" [label]="'设为默认地址'" (zmClick)="onDefaultFlagChange()"></zm-img-radio>

                  <div style="padding:30px 0">
                    <zm-btn-sub [name]="'保存'" (zmbtnClick)="saveBtnClick()"></zm-btn-sub>
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

export class AddressAddPage {


  private service: AddressAddService;
  private viewDataSub: any;
  public viewData: AddressAddViewData = new AddressAddViewData();

  cities: Array<any>;
  public modalCtrl:ModalCtrl;

  constructor(private cdRef: ChangeDetectorRef,
              private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    this.cities = CityDataProvider.getInstance().getCities();
    this.service = new AddressAddService();
    let initData = new AddressAddViewData();
    this.viewDataSub = AddressAddViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: AddressAddViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
  }


  ionViewDidEnter() {
    this.initViewData();
  }

  private initViewData() {
    this.service.initViewData();
  }

  async saveBtnClick(){
    let addForm = this.buildAddForm();
    if(!addForm.isValid()){
      AppUtils.showWarn("","请将地址信息填写完整");
      return;
    }else{
      let cuserId = SessionUtil.getInstance().getLoginCUserId();
      let success = await this.service.addAddress(cuserId, addForm);
      this.handleResult(success);
    }
  }

  handleResult(success:boolean){
    if(success){
      AppUtils.showSuccess("","添加成功");
      // AppRouter.getInstance().pop();
      this.modalCtrl.dismiss(null);
    }else{
      AppUtils.showError("","添加失败");
    }
  }

  buildAddForm():CUserAddressAddForm{
    let addForm = new CUserAddressAddForm();
    AppUtils.copy(addForm, this.viewData.address);
    addForm.index = parseInt(this.viewData.address.id);
    addForm.addressArea = CityDataProvider.getInstance().getAddressAreaStr(this.viewData.address.addressPickerValue);
    return addForm;
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

export class AddressAddViewData{
  address:ReceiverAddress = new ReceiverAddress();
}

export class AddressAddService{

  public initViewData() {
    let viewDataTmp = new AddressAddViewData();
    AddressAddViewDataMgr.getInstance().setData(viewDataTmp);
    this.buildViewData();
  }

  private async buildViewData() {
    let viewDataTmp = new AddressAddViewData();
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let addressIdIndex:number = await this.getAddressIdIndex(cuserId);
    viewDataTmp.address.id = (parseInt(addressIdIndex.toString()) + 1).toString();
    AddressAddViewDataMgr.getInstance().setData(viewDataTmp);
  }

  public addAddress(cuserId, addForm: CUserAddressAddForm){
    return new Promise<boolean>(resolve => {
      CUserMgr.getInstance().addAddress(cuserId, addForm).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 获取addressIdIndex,addressId
   * @param   cuserId:string
   * @returns Promise<number>
   */
  public getAddressIdIndex(cuserId: string): Promise<number> {
    return new Promise<number>(resolve => {
      CUserMgr.getInstance().getCUser(cuserId).then(cuserTmp => {
        if (cuserTmp) {
          resolve(cuserTmp.addressIdIndex);
        }
      })
    })
  }
}





