import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavParams} from "ionic-angular";
import {MemCardDetailViewDataMgr} from "./memCardDetailViewDataMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {MemCardDetailService} from "./memCardDetailService";
import {MemCardDetailViewData} from "./memCardDetailViewData";

@IonicPage({
  name: "memCardDetail",
  segment: 'memCardDetail'
})
@Component({
  template: `
    <zm-page-header title="会员卡详情"></zm-page-header>
    <zm-page-content>
      <zm-mem-card-info *ngIf="viewData.memCardDetail!=null" [title]=" '会员卡详情' " [memCard]="viewData.memCardDetail"></zm-mem-card-info>
    </zm-page-content>
  `
})
export class MemCardDetailPage {

  private service: MemCardDetailService;
  private viewDataSub: any;
  public viewData: MemCardDetailViewData = new MemCardDetailViewData();

  constructor(private cdRef: ChangeDetectorRef,
              private navParams: NavParams,) {

    this.service = new MemCardDetailService();

    let initData = new MemCardDetailViewData();
    this.viewDataSub = MemCardDetailViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: MemCardDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

  }

  ionViewDidEnter() {
    let targetId = AppRouter.getInstance().getTargetId(this.navParams);
    this.service.initViewData(targetId);
  }

}

