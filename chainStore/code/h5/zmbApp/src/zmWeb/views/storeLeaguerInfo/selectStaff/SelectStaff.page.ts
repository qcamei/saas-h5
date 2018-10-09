import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {IonicPage, NavParams, ViewController} from "ionic-angular";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {SelectStaffViewDataMgr} from "./SelectStaffViewDataMgr";
import {StaffItemData} from "./StaffItemData";
import {StaffExChangeData} from "./StaffExChangeData";
import {AppRouter} from "../../zmComUtils/AppRouter";

/**
 * 会员管理-添加会员-选择跟进人员
 */
@IonicPage({
  name:"selectStaff",
  segment: 'selectStaff'
})
@Component({
  template: `
          <!--<zm-modal-header title="选择跟进人员" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>-->
          <zm-page-header title="选择跟进人员"></zm-page-header>
          <zm-page-content>
                <ng-container *ngIf="viewData.staffList">
                  <zmb-staff-item *ngFor="let item of viewData.staffList" [item]="item"></zmb-staff-item>
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
export class SelectStaffPage{

  public viewData:SelectStaffViewData;
  public modalCtrl:ModalCtrl;

  targetObj: any;
  targetCallback: any;

  constructor( private cdRef: ChangeDetectorRef ,private viewCtrl: ViewController,public navParams: NavParams) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    let initData:SelectStaffViewData = new SelectStaffViewData();
    SelectStaffViewDataMgr.getInstance().onDataChanged(initData,(viewDataP:SelectStaffViewData) => {
      if(viewDataP){
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    });

  }

  ionViewDidLoad(){
    this.targetObj = AppRouter.getInstance().getTargetObj(this.navParams);
    this.targetCallback = AppRouter.getInstance().getTargetCallback(this.navParams);

    let viewDataTmp = new SelectStaffViewData();
    // viewDataTmp.staffList = StaffExChangeData.getInstance().getStaffList();
    viewDataTmp.staffList = this.targetObj;
    SelectStaffViewDataMgr.getInstance().setData(viewDataTmp);
  }

  confirmClick(){
    // this.modalCtrl.dismiss(null);
    this.targetCallback(this.viewData.staffList);
    AppRouter.getInstance().pop();
  }
}

export class SelectStaffViewData{
  public staffList:Array<StaffItemData>;
}


