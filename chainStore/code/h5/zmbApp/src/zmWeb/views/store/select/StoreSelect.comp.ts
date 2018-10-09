import {Component, OnInit, OnDestroy, ChangeDetectorRef,ChangeDetectionStrategy} from '@angular/core';
import {StoreListViewDataMgr} from "./StoreListViewDataMgr";
import {StoreListService} from "./StoreListService";
import {StoreListViewData} from "./StoreListViewData";
import {Store} from "../../../bsModule/store/data/Store";
import {IonicPage, ViewController} from "ionic-angular";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";
import {RestResp} from "../../../comModule/asynDao/apiData/RestResp";
import {WXUtils} from "../../zmComUtils/WXUtils";

@IonicPage({
  name:"mainStoreSelect",
  segment: 'mainStoreSelect'
})
@Component({
  template: `
         <zm-modal-header title="选择店铺" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>
         
         <zm-page-content>
           <div>
           <ng-container *ngIf="viewData.storeList">
                <zm-store-info *ngFor="let item of viewData.storeList" 
                    [store]="item" (zmClick)="onSelect($event)" ></zm-store-info>
                <zm-no-data *ngIf="viewData.loadFinish==true && viewData.storeList!=null && viewData.storeList.length==0"  text="没有数据" ></zm-no-data>
           </ng-container>
           </div>
          </zm-page-content>
    

    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StoreSelectComp implements OnInit,OnDestroy{

  private service:StoreListService;
  public viewData:StoreListViewData;


  modalCtrl:ModalCtrl;
  constructor( private cdRef: ChangeDetectorRef,private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(this.viewCtrl);
    this.service = new StoreListService();
    this.viewData = new StoreListViewData();
  }

  ngOnInit(): void {
    let initData:StoreListViewData = null;
    StoreListViewDataMgr.getInstance().onDataChanged(initData,(viewDataP:StoreListViewData) => {
      if(viewDataP){
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    StoreListViewDataMgr.getInstance().onViewDestroy();
  }

  ionViewWillEnter(){
    this.service.buildViewData();
  }

  ionViewDidEnter() {
  }


  async onSelect(store:Store){
    await SessionUtil.getInstance().switchStore(store.id);
    this.modalCtrl.dismiss(store);
  }



}




