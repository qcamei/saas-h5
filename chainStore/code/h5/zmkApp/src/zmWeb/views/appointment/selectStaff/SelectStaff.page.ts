import {Component, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, OnInit} from '@angular/core';
import {IonicPage, ViewController} from "ionic-angular";
import {PageContent} from "../../zmComp/layout/PageContent";
import {AppointmentFormData} from "../AppointmentFormData";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {StaffItemData, AppointmentViewData} from "../AppointmentViewData";
import {SelectStaffViewDataMgr} from "./SelectStaffViewDataMgr";

@IonicPage({
  name:"selectStaff",
  segment: 'selectStaff'
})
@Component({
  template: `
          <zm-modal-header title="选择服务人员" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>
          <zm-page-content>
                <ng-container *ngIf="viewData.staffList">
                  <zmk-staff-item *ngFor="let item of viewData.staffList" [item]="item"></zmk-staff-item>
                  <zm-no-data *ngIf="viewData.staffList&&viewData.staffList.length==0"  text="没有数据" ></zm-no-data>
              </ng-container>
          </zm-page-content>
          <ion-footer >
            
             <div style="padding:0 15px;">
              <button ion-button block (click)="confirmClick()"> 确定</button>
             </div>
            
          </ion-footer>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectStaffPage implements OnInit,OnDestroy{

  public viewData:SelectStaffViewData = new SelectStaffViewData();

  public modalCtrl:ModalCtrl;

  constructor( private cdRef: ChangeDetectorRef ,private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    let initData:SelectStaffViewData = null;
    SelectStaffViewDataMgr.getInstance().onDataChanged(initData,(viewDataP:SelectStaffViewData) => {
      if(viewDataP){
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    SelectStaffViewDataMgr.getInstance().onViewDestroy();
  }

  @ViewChild(PageContent) loadRef: PageContent;
  ionViewDidEnter(){
    this.buildViewData();
  }

  buildViewData(){
    let appointmentViewData = AppointmentFormData.getInstance().getAppointmentViewData();
    SelectStaffViewDataMgr.getInstance().setData(SelectStaffViewData.fromAppoint(appointmentViewData));
  }

  confirmClick(){
    this.modalCtrl.dismiss(null);
  }
}

export class SelectStaffViewData{
  staffList:Array<StaffItemData>

  public static fromAppoint(viewData:AppointmentViewData):SelectStaffViewData{
    let selectStaffViewData = new SelectStaffViewData();
    selectStaffViewData.staffList = viewData.selectedProductItem.staffList;
    return selectStaffViewData;
  }
}


