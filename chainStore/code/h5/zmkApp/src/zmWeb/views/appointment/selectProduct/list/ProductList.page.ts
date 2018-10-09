import {Component, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, OnInit} from '@angular/core';
import {ProductListViewDataMgr} from "./ProductListViewDataMgr";
import {ProductListViewData} from "./ProductListViewData";
import {IonicPage, ViewController} from "ionic-angular";
import {AppointmentFormData} from "../../AppointmentFormData";
import {ModalCtrl} from "../../../zmComUtils/ModalCtrl";
import {PageContent} from "../../../zmComp/layout/PageContent";

@IonicPage({
  name:"selectProduct",
  segment: 'selectProduct'
})

@Component({
  template: `
          <zm-modal-header title="选择项目" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>
          <zm-page-content>
                <ng-container *ngIf="viewData.productList">
                  <zmk-appoint-product-item
                    *ngFor="let item of viewData.productList"
                    [item]="item"
                    [typeMap]="viewData.productTypeMap">
                  </zmk-appoint-product-item>
                    
                  <zm-no-data *ngIf="viewData.productList&&viewData.productList.length==0"  text="没有数据" ></zm-no-data>
                </ng-container>
          </zm-page-content>
          <ion-footer>
            <div style="padding:0 15px;">
              <button ion-button block (click)="confirmClick()"> 确定</button>
            </div>
          </ion-footer>

    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectProductPage implements OnInit,OnDestroy{

  public viewData:ProductListViewData = new ProductListViewData();
  public modalCtrl:ModalCtrl;

  constructor( private cdRef: ChangeDetectorRef ,private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    let initData:ProductListViewData = null;
    ProductListViewDataMgr.getInstance().onDataChanged(initData,(viewDataP:ProductListViewData) => {
      if(viewDataP){
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    ProductListViewDataMgr.getInstance().onViewDestroy();
  }

  @ViewChild(PageContent) loadRef: PageContent;
  ionViewDidEnter(){
    this.buildViewData();
  }

  buildViewData(){
    let appointmentViewData = AppointmentFormData.getInstance().getAppointmentViewData();
    ProductListViewDataMgr.getInstance().setData(ProductListViewData.fromAppoint(appointmentViewData));
  }


  confirmClick(){
    this.modalCtrl.dismiss(null);
  }
}




