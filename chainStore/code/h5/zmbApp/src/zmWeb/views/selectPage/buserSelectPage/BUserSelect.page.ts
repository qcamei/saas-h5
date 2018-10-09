import {Component, Input} from '@angular/core';
import {IonicPage, NavParams} from "ionic-angular";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {BUserSelectService} from "./BUserSelectService";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {AppRouter} from "../../zmComUtils/AppRouter";


@IonicPage({
  name: "buserSelect",
  segment: 'buserSelect'
})

@Component({
  template: `
    <zm-page-header [operation]="true" [title]="title"></zm-page-header>
    <zm-page-content>
      <div *ngFor="let item of busers;let i = index;">
        <div *ngIf="i == 0" border-gray></div>
        <div (click)="selectedBUser(item)">
        <zmbBuser [buser]="item"></zmbBuser>
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
export class BUserSelectPage {
  @Input() title: string = "选择跟进人员";

  private busers: Array<BUser> = new Array<BUser>();

  callback: (buser: BUser) => void;

  constructor(public navParams: NavParams) {
    this.callback = this.navParams.get('targetObj');
  }

  /**
   * 当将要进入页面时触发
   */
  ionViewWillEnter() {
    this.getAllBUsers();//获取店铺员工列表
  }

  /**
   * 获取店铺员工列表
   */
  getAllBUsers() {
    BUserSelectService.getInstance().getAllBUsers().then(value => {
      this.busers = value;
    });
  }

  /**
   * 选择员工
   */
  selectedBUser(buser: BUser) {
    this.callback(buser);
    AppRouter.getInstance().pop();
  }
}





