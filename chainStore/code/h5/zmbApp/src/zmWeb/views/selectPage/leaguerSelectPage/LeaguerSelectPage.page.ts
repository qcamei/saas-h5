import {Component, Input} from '@angular/core';
import {IonicPage, NavParams, ViewController} from "ionic-angular";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {LeaguerSelectService} from "./LeaguerSelectService";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {AppRouter} from "../../zmComUtils/AppRouter";


@IonicPage({
  name: "leaguerSelect",
  segment: 'leaguerSelect'
})

@Component({
  template: `
    <zm-page-header [operation]="true" [title]="title"></zm-page-header>
    <zm-page-content>
      <div *ngFor="let item of leaguers;let i = index;">
        <div *ngIf="i == 0" border-gray></div>
        <div (click)="selectedLeaguer(item)">
          <zmbLeaguerInfo [leaguer]="item"></zmbLeaguerInfo>
        </div>
        <div border-gray></div>
      </div>
    </zm-page-content>
  `,
  styles: [`

  `],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * 选择 员工
 */
export class LeaguerSelectPage {
  @Input() title: string = "选择会员";

  private leaguers: Array<Leaguer> = new Array<Leaguer>();

  callback: (leaguer: Leaguer) => void;

  constructor(public navParams: NavParams) {
    this.callback = this.navParams.get('targetObj');
  }

  /**
   * 当将要进入页面时触发
   */
  ionViewWillEnter() {
    this.getAllLeaguers();//获取店铺员工列表
  }

  /**
   * 获取店铺员工列表
   */
  getAllLeaguers() {
    LeaguerSelectService.getInstance().getAllLeaguers().then(value => {
      this.leaguers = value.values();
    });
  }

  /**
   * 选择客户
   */
  selectedLeaguer(leaguer: Leaguer) {
    this.callback(leaguer);
    AppRouter.getInstance().pop();
  }
}





