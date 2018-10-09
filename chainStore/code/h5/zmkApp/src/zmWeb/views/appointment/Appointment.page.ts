import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {AppointmentViewData, StaffItemData, ProductItemData} from "./AppointmentViewData";
import {AppointmentService} from "./AppointmentService";
import {AppointmentViewDataMgr} from "./AppointmentViewDataMgr";
import {AppRouter} from "../zmComUtils/AppRouter";
import {AppointmentFormData} from "./AppointmentFormData";
import {AppUtils} from "../../comModule/AppUtils";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";
import {AppointmentAddApiForm} from "../../bsModule/appointment/apiData/AppointmentAddApiForm";

@IonicPage({
  name:"appointment",
  segment: 'appointment'
})

@Component({
  template: `
           <zm-root-page-header></zm-root-page-header>

           <zm-page-content>
             <div style="padding-top:40px;background:url(assets/img/rectangle.png) no-repeat;background-size:100%">
                 <ion-card>
                 <ion-list>     
                    <zm-date [label]="'预约日期'" 
                             [placeholder]="'请选择日期'"
                             [minDate]="viewData.appointDateMin"
                             [(currentValue)]="viewData.curAppointDate">
                    </zm-date>
                    <zm-time [label]="'预约时间'" 
                             [placeholder]="'请选择时间'" 
                             [minDate]="viewData.appointTimeMin"
                             [maxDate]="viewData.appointTimeMax"
                             [(zmValue)]="viewData.curAppointTime">
                    </zm-time>
                   </ion-list> 
                 </ion-card>
                 <ion-card style="margin-top:10px;">
                    <button  ion-item style="border-bottom:1px solid #F7F5F5;" (click)="goSelectProductPage()">
                      <ion-icon ios="ios-browsers-outline" md="md-alarm" item-start color="primary"></ion-icon>
                      <span>预约项目</span>
                    </button>
                    <div style="max-height:170px;overflow:auto;">
                      <ion-item zmk-item-sm style="border-top:3px solid #f2f2f2;"  *ngFor="let item of viewData.selectedProductList">
                        <div style="padding:15px 0;" item-title>{{item.name}}</div>
                        <div w-100 fxLayout="row" fxLayoutAlign="space-between center" item-subtitle style="padding:5px 0 2px 0;border-top:1px solid #F7F7F7;" (click)="goSelectStaffPage(item)">
                            <span>选择服务人员</span>
                            <div *ngIf="getStaffName(item)" item-subtitle>{{getStaffName(item)}}</div>
                            <ion-icon  *ngIf="!getStaffName(item)" ios="ios-arrow-forward" ></ion-icon>
                        </div>
                      </ion-item>
                    </div>
                   
                 </ion-card>
                <div padding><button ion-button block (click)="submitAppoint()">马上预约</button></div>
             </div>

            </zm-page-content>
            
    `,
    styles:[`
  
    `],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentPage{

  viewData: AppointmentViewData = new AppointmentViewData();
  service: AppointmentService;

  constructor(private cdRef: ChangeDetectorRef) {
    this.service = new AppointmentService();
    let initViewData: AppointmentViewData = this.viewData;
    AppointmentViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    }));
  }

  ionViewDidEnter() {
    this.service.buildViewData();
  }

  ionViewDidLeave(){
    AppointmentViewDataMgr.getInstance().onViewDestroy();
    AppointmentFormData.getInstance().clear();
  }

  /**
   * 获取已选中的服务人员名称
   * @param item
   * @returns {string}
   */
  getStaffName(item:ProductItemData){
    let nameArr:Array<string> = [];
    item.staffList.forEach((item:StaffItemData)=>{
      if(item.selected){
        nameArr.push(item.name)
      }
    })
    return nameArr.join(",");
  }

  /**
   * 跳转选择项目modal
   */
  goSelectProductPage(){
    AppointmentFormData.getInstance().setAppointmentViewData(this.viewData);
    AppRouter.getInstance().goProductListPage(this.selectProductCallback.bind(this));
  }

  /**
   * 选择项目回调
   */
  selectProductCallback(){
    this.viewData.selectedProductList = [];
    this.viewData.productList.forEach((item)=>{
      if(item.selected){
        this.viewData.selectedProductList.push(item);
      }
    })
    AppointmentViewDataMgr.getInstance().setData(this.viewData);
  }

  /**
   * 跳转选择服务人员modal
   */
  goSelectStaffPage(item:ProductItemData){
    this.viewData.selectedProductItem = item;
    AppointmentFormData.getInstance().setAppointmentViewData(this.viewData);
    AppRouter.getInstance().goSelectStaffPage(this.selectStaffCallback.bind(this));
  }


  /**
   * 选择项目回调
   */
  selectStaffCallback(){
    AppointmentViewDataMgr.getInstance().setData(this.viewData);
  }

  /**
   * 添加预约
   * @returns {Promise<void>}
   */
  async submitAppoint(){
    AppointmentFormData.getInstance().setAppointmentViewData(this.viewData);
    let appointmentAddApiForm = AppointmentFormData.getInstance().toAddApiForm();
    if(!this.checkForm(appointmentAddApiForm)) {
      return;
    }
    let restResp: RestResp = await this.service.addAppointment(appointmentAddApiForm);
    this.handleRestResp(restResp);
  }

  checkForm( appointmentAddApiForm: AppointmentAddApiForm): boolean{
    if(!AppUtils.isNumberType(appointmentAddApiForm.appointTime)
      || appointmentAddApiForm.appointTime < new Date().getTime()){
      AppUtils.showWarn("提示","预约时间不能小于当前时间");
      return false;
    }
    if(!appointmentAddApiForm.isValidAppointProducts()){
      AppUtils.showWarn("提示","请选择预约项目");
      return false;
    }
    return true;
  }

  handleRestResp(restResp: RestResp){
    if(!AppUtils.isNullObj(restResp) && (restResp.code == 200)){
      AppUtils.showSuccess("提示","提交预约成功");
      AppointmentFormData.getInstance().clear();
      this.service.buildViewData();
    }else{
      if(!AppUtils.isNullObj(restResp)){
        AppUtils.showError("提示",restResp.tips);
      }else{
        AppUtils.showError("提示","提交预约失败");
      }
    }
  }

}




