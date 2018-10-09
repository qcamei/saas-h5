import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppVersionMgr} from "../../../bsModule/appVersion/AppVersionMgr";
import {AppVersion} from "../../../bsModule/appVersion/apiData/AppVersion";


@Component({
  selector: 'selective-modal',
  template: `
    <div class="modal-header">
      <span class="font-bold">智美通服务协议</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" style="overflow-y: auto;height: 700px; padding: 30px 60px;" *ngFor="let item of viewData.descriptArray;let i = index;">
      <div style="width:635px;margin: 0 auto;">
      <span [innerHTML]="viewData.descriptArray"></span></div>
    </div>
    <div class="modal-footer">
      <button class="btn c-md-btn-modal c-close-btn-modal" style="margin-right: 20px;"  (click)="closeModal()">取消</button>
      <button class="btn c-md-btn-modal c-btn-blue" (click)="setRole()" >确认</button>
     
    </div>
  `,
})
export class serviceAgreementComponent implements OnInit{


  service:ServiceAgreementService;
  viewData:ServiceAgreementViewData;

  constructor(private activeModal: NgbActiveModal,
              private appVersionMgr:AppVersionMgr) {
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

