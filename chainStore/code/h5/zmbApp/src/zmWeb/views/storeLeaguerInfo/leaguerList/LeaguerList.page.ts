import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {IonicPage} from "ionic-angular";
import {LeaguerListViewData} from "./LeaguerListViewData";
import {LeaguerListService} from "./LeaguerListService";
import {LeaguerListViewDataMgr} from "./LeaguerListViewDataMgr";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {SortTypeEnum} from "../../../bsModule/leaguerDetail/data/SortTypeEnum";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {ZmDatePipe} from "../../zmComp/pipe/ZmDatePipe";

/**
 * 会员管理-会员列表
 */
@IonicPage({
  name:"leaguerList",
  segment:"leaguerList"
})
@Component({
  template:`
            <zm-page-header title="会员管理" [operation]="true" [add]="'add'" (zmbBtnClick)="onAdd($event)"></zm-page-header>
            <zm-page-content [ftShow]="viewData.recordCount>10" >
            <div>
               
                <zm-tabs-custom [tabList]="viewData.tabList" [(zmValue)]="viewData.selectedTab" (onChange)="switchTab()"></zm-tabs-custom>
                
                <zm-tab-sort [tabList]="viewData.sortTabList" [(zmValue)]="viewData.selectedSortType" (onChange)="switchSortTab()"></zm-tab-sort>
                <div class="order-pull-h" [ngClass]="{'orderViewHeight':viewData.recordCount <10}">
                     <div *ngFor="let item of viewData.list">
                      <zmb-leaguer-list (click)="goDetailPage(item.id)" headImg="{{item.headImg}}" name="{{item.name}}" phone="{{item.phone}}" sortType="{{getSortType(item)}}" sortTypeAttr="{{viewData.sortTypeAttr}}"></zmb-leaguer-list>
                     </div>
                    <zm-no-data *ngIf="viewData.loadingFinish&&viewData.list.length==0" text="没有数据"></zm-no-data>
                </div>
               
            </div>
            </zm-page-content>
            <ion-footer class="bg-white">
               <zm-page [totalSize]="viewData.recordCount" [curPage]="viewData.page" (pageChange)="getPageData($event)"></zm-page>
            </ion-footer>
`,
  styles:[`
      
`  ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LeaguerListPage{

  public viewData: LeaguerListViewData;
  private service: LeaguerListService;

  constructor(private zmDatePipe:ZmDatePipe,private cdRef: ChangeDetectorRef) {
    this.service = new LeaguerListService();
    let initViewData = new LeaguerListViewData();
    LeaguerListViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        // this.doForAnimate();
        this.cdRef.markForCheck();
      }
    }));
  }

  /**
   * 动画
   * @type {Array}
   */
  // public animateItems = [];
  // doForAnimate() {
  //   let target = this;
  //   for (let i = 0; i < target.viewData.list.length; i++) {
  //     setTimeout(function () {
  //       target.animateItems.push(target.viewData.list[i]);
  //     }, 200 * i + 500);
  //   }
  // }

  // ionViewWillEnter() {
  //   this.animateItems = [];
  // }

  ionViewDidLoad(){
    this.service.buildViewData();
  }

  ionViewWillUnload(){

  }

  /**
   * 跳转添加会员
   * @param event
   */
  onAdd(event){
    AppRouter.getInstance().goAddLeaguerPage();
  }

  /**
   * 跳转详情
   * @param leaguerId
   */
  goDetailPage(leaguerId:string){
    AppRouter.getInstance().goLeaguerDetailPage(leaguerId);
  }

  /**
   * 获取排序项value
   * @param item
   * @returns {number}
   */
  getSortType(item:LeaguerDetail){
    let sortType = this.viewData.queryForm.sortType;
    if(sortType == SortTypeEnum.LastConsumeTime){
      return this.zmDatePipe.transform(item.lastConsumeTime.toString());
    }else if(sortType == SortTypeEnum.AvgPrice){
      return item.avgPrice;
    }else if(sortType == SortTypeEnum.ConsumeAmount){
      return item.consumeAmount;
    }else if(sortType == SortTypeEnum.MonthRate){
      return item.monthRate;
    }
  }

  /**
   * 切换客户类型tab
   */
  switchTab(){
    this.viewData.queryForm.leaguerType = this.viewData.selectedTab.value;
    this.service.getPageData(1,this.viewData);
  }

  /**
   * 切换排序类型tab
   */
  switchSortTab(){
    this.viewData.queryForm.sortType = this.viewData.selectedSortType.value;
    this.viewData.queryForm.sort = this.viewData.selectedSortType.sort;
    this.viewData.sortTypeAttr = this.viewData.selectedSortType.name;
    this.service.getPageData(1,this.viewData);
  }

  /**
   * 获取分页数据
   * @param curPage
   */
  getPageData(curPage:number){
    this.service.getPageData(curPage,this.viewData);
  }

}
