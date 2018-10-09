import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {MyMemCardViewDataMgr} from "./myMemCardViewDataMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {MyMemCardService} from "./myMemCardService";
import {MyMemCardViewData} from "./myMemCardViewData";

@IonicPage({
  name: "myMemCard",
  segment: 'myMemCard'
})

@Component({
  template: `
  <zm-page-header title="会员卡列表"></zm-page-header>
  <zm-page-content>
    <div *ngIf="viewData.membershipCard && viewData.membershipCard.imgPath && viewData.membershipCard.name">
      <zmk-store-card [imgPath]="viewData.membershipCard.imgPath" [name]="viewData.membershipCard.name" (callback)="goMemCardDetailPage(viewData.membershipCard.id)"></zmk-store-card>
    </div>
    
    <zm-no-data *ngIf="viewData.loadingFinish && !viewData.membershipCard.name"></zm-no-data>
  </zm-page-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyMemCardPage {

  private service: MyMemCardService;
  private viewDataSub: any;
  public viewData: MyMemCardViewData = new MyMemCardViewData();

  constructor(private cdRef: ChangeDetectorRef) {

    this.service = new MyMemCardService();

    let initData = new MyMemCardViewData();
    this.viewDataSub = MyMemCardViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: MyMemCardViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

  }

  ionViewDidEnter() {
    this.service.initViewData();
  }

  goMemCardDetailPage(memCardId:string){
      AppRouter.getInstance().goMemCardDetailPage(memCardId);
  }

}




