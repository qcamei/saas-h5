import {Component} from '@angular/core';
import {IonicPage} from "ionic-angular";


@IonicPage({
  name: "openWF",
  segment: 'openWF'
})

@Component({
  template: `

    <zm-page-header [operation]="true" [edit]="'开单'" title="开单收银"></zm-page-header>
    <zm-page-content>
      <!--开单-->
      <zmbLeaguerSelect></zmbLeaguerSelect>
      <div border-gray></div>
      <zmbBUserSelect></zmbBUserSelect>
      <div border-gray></div>
      <zm-workFlow-title [title]="'赠送'" [required]="true" [showBorder]="false"></zm-workFlow-title>
     
      <zmb-workFlow-item></zmb-workFlow-item>

      <div border-gray></div>
      <zm-workFlow-title [title]="'购买'" [required]="true" [showBorder]="false"></zm-workFlow-title>
    </zm-page-content>
    <ion-footer style="background:#fff;">
      <zm-btn-sub [name]="'提交订单'" (zmbtnClick)="click()"></zm-btn-sub>
    </ion-footer>
  `,
  styles: [`

  `],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * 管理页
 */
export class OpenWFPage {


  constructor() {
  }

}





