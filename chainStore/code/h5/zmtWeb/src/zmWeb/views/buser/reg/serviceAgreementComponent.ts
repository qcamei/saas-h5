import {Component, OnInit, Inject} from '@angular/core';

import {AppVersionMgr} from "../../../bsModule/appVersion/AppVersionMgr";
import {AppVersion} from "../../../bsModule/appVersion/apiData/AppVersion";
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'selective-modal',
  template: `
    <div>
      <div mat-dialog-title>
        <span class="font-bold">智美通软件协议</span>
      </div>
      <div mat-dialog-content style="overflow-y: auto;height:60vh; padding: 30px 60px;" *ngFor="let item of viewData.descriptArray;let i = index;">
        <div style="width:635px;margin: 0 auto;">
        <span [innerHTML]="viewData.descriptArray"></span></div>
      </div>
      <div mat-dialog-actions fxLayout="row" fxLayoutAlign="end" class="mt-20">
        <button mat-raised-button color="accent"  class="btn c-md-btn-modal c-close-btn-modal" style="margin-right: 20px;"  (click)="closeModal()">取消</button>
        <button mat-raised-button color="accent" class="zmCurHand" (click)="setRole()" >确认</button>
       
      </div>
    </div>
  `,
})
export class serviceAgreementComponent implements OnInit{


  service:ServiceAgreementService;
  viewData:ServiceAgreementViewData;
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any,
              private appVersionMgr:AppVersionMgr) {
    this.activeModal = dataInput.modalCtrl;
    this.service = new ServiceAgreementService(this.appVersionMgr);
  }

  closeModal() {
    this.activeModal.close();
  }

  setRole() {
    this.closeModal();
  }

  ngOnInit(){
    this.viewData = new ServiceAgreementViewData();
    this.service.initViewData((viewDataTmp:ServiceAgreementViewData)=>{
      this.viewData = viewDataTmp;
    });
  }
}
export class ServiceAgreementViewData{

  appVersion:AppVersion = new AppVersion();
  descriptArray:Array<String> = new Array<String>();
}

export class ServiceAgreementService{
  constructor(private appVersionMgr:AppVersionMgr){
  }
  public async initViewData(callBack:(viewDataTmp:ServiceAgreementViewData)=>void){
    let viewDataTmp = new ServiceAgreementViewData();
    let appName = "智美通PC";
    let appVersionTmp = await this.appVersionMgr.findByName(appName);
    viewDataTmp.appVersion = appVersionTmp;
    viewDataTmp.descriptArray.push(appVersionTmp.descript);
    callBack(viewDataTmp);
  }

}

