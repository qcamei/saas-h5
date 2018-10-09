import {
  Component,
  Input
} from "@angular/core";
import {ManageItem} from "./ManageItem";
import {AppUtils} from "../../../../../comModule/AppUtils";
import {AppRouter} from "../../../../zmComUtils/AppRouter";

//  <zmManageItem [manageItem]=""></zmManageItem>
@Component({
  selector: 'zmbManageItem',
  template: `
    <zm-btn-icon [count]="getMsgCount()" [title]="getName()" [imgSrc]="getImgUrl()"
                 (zmbtnClick)="click()"></zm-btn-icon>
  `,

})

/**
 * 管理项 组件
 */
export class ZmbManageItem {

  @Input() manageItem: ManageItem;//管理项

  getName(): string{
    if(AppUtils.isNullObj(this.manageItem))return null;
    return this.manageItem.name;
  }

  getImgUrl(): string{
    if(AppUtils.isNullObj(this.manageItem))return null;
    return this.manageItem.imgUrl;
  }

  getMsgCount(): number{
    if(AppUtils.isNullObj(this.manageItem))return null;
    return this.manageItem.msgCount;
  }

  click(){
    if(AppUtils.isNullObj(this.manageItem))return;
    if(AppUtils.isNullObj(this.manageItem.page))return;
    AppRouter.getInstance().push(this.manageItem.page);
  }

}


