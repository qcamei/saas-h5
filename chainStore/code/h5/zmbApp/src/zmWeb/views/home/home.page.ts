import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {HomeViewData} from "./homeViewData";
import {HomeService} from "./homeService";
import {HomeViewDataMgr} from "./HomeViewDataMgr";
import {MainViewDataMgr} from "../main/MainViewDataMgr";
import {MainViewData} from "../main/MainViewData";
import {AppRouter} from "../zmComUtils/AppRouter";
import {MessageTypeEnum} from "../../bsModule/message/data/MessageTypeEnum";

@IonicPage({
  name: "home",
  segment: 'home'
})

@Component({
  template: `
    <zm-root-page-header></zm-root-page-header>
    <zm-page-content>

      <ion-row color="primary" style="padding-top:40px;height:150px;background-color: #4678FA">
        <ion-col col-4>
          <zm-btn-count title="今日预约" value="{{viewData.statisticsData.appointCount}}"
                        (zmbtnClick)="click()"></zm-btn-count>
        </ion-col>
        <ion-col col-4>
          <zm-btn-count title="客户总数" value="{{viewData.statisticsData.leaguerCount}}"
                        (zmbtnClick)="click()"></zm-btn-count>
        </ion-col>
        <ion-col col-4>
          <zm-btn-count title="本月销售额" value="￥{{viewData.statisticsData.monthOrderCount}}"
                        (zmbtnClick)="click()"></zm-btn-count>
        </ion-col>

      </ion-row>

      <ion-card>
        <zm-btn-item-push [count]="getWorkFlowCount()" *ngIf="viewData.buserPermData.isPurchaseAdmin" zmk-item-sm icon="zm-apply" title="我的店务"
                          (zmbtnClick)="goMyBillList()"></zm-btn-item-push>
        <zm-btn-item-push [count]="getAppointmentCount()"  *ngIf="viewData.buserPermData.isAppointmentAdmin" zmk-item-sm icon="zm-appointment"
                          title="我的预约" (zmbtnClick)="goMyAppointmentList()"></zm-btn-item-push>
        <zm-btn-item-push *ngIf="viewData.buserPermData.isLeaguerAdmin" zmk-item-sm icon="zm-client" title="我的客户"
                          (zmbtnClick)="goLeaguerList()"></zm-btn-item-push>
        <zm-btn-item-push *ngIf="viewData.buserPermData.isOrderAdmin" zmk-item-sm icon="zm-order" title="我的订单"
                          (zmbtnClick)="goMyOrderList()"></zm-btn-item-push>
        <zm-btn-item-push *ngIf="viewData.buserPermData.isBonusAdmin" zmk-item-sm icon="zm-order" title="我的提成"
                          (zmbtnClick)="goMyBonus()"></zm-btn-item-push>

      </ion-card>
    </zm-page-content>
  `,
  styles: [`
    [text-indent] {
      text-indent: 25px;
    }

    .protocol-title {
      text-align: center;
      font-weight: bold;
      font-size: 16px;
    }

  `]
})
export class HomePage {

  private service: HomeService;
  public viewData: HomeViewData = new HomeViewData();

  constructor(private cdRef: ChangeDetectorRef) {
    this.service = new HomeService();
    HomeViewDataMgr.getInstance().onDataChanged(new HomeViewData(), (viewDataTmp: HomeViewData) => {
      this.viewData = viewDataTmp;
      this.viewData.buserPermData = MainViewData.getInstance().userPermData;
      this.viewData.messageList = MainViewData.getInstance().messageList;

      // console.log("HomeViewDataMgr.onDataChanged=====" + JSON.stringify(this.viewData));
      this.cdRef.markForCheck();
    });

    MainViewDataMgr.getInstance().onDataChange(MainViewData.getInstance(), (mainViewDataP: MainViewData) => {
      if (mainViewDataP) {
        this.viewData.buserPermData = mainViewDataP.userPermData;
        this.viewData.messageList = mainViewDataP.messageList;
        this.cdRef.markForCheck();
      }
    });

  }

  ionViewDidEnter() {
    this.service.initViewData();
  }

  getWorkFlowCount():number{
    return this.getCountWithItemEnum(MessageTypeEnum.MY_WORKFLOW);
  }

  getAppointmentCount():number{
    return this.getCountWithItemEnum(MessageTypeEnum.BEAUTICIAN_APPOINTMENT);
  }

  getCountWithItemEnum(messageType: number): number {
    for (let message of this.viewData.messageList) {
      if (message.messageType == messageType) {
        return message.count;
      }
    }
  }

  //去我的店务
  goMyBillList(){

  }

  //我的预约
  goMyAppointmentList(){
    let isFromHomePage :boolean = true;
    AppRouter.getInstance().goMyAppointmentList(isFromHomePage);
  }

  //我的客户
  goLeaguerList(){
    AppRouter.getInstance().goLeaguerList();
  }
  //我的订单
  goMyOrderList(){
    AppRouter.getInstance().goOrderListPage();
  }

  /**
   * 跳转我的提成
   */
  goMyBonus(){
    AppRouter.getInstance().goMyBonusPage();
  }

}





