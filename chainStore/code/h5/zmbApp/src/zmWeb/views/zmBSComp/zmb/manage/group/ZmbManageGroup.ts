import {
  ChangeDetectorRef,
  Component,
  Input,
} from "@angular/core";
import {ManageItem} from "../itemInGroup/ManageItem";
import {AppUtils} from "../../../../../comModule/AppUtils";
import {ManageGroup} from "./ManageGroup";

//  <zmbManageGroup [manageGroup]="" ></zmManageGroup>
@Component({
  selector: 'zmbManageGroup',
  template: `

    <div *ngIf="isHasItem()">
      <zmbManager-title fxLayoutAlign="start center" [name]="getName()"></zmbManager-title>
      <div fxLayout="row" style="padding:10px 0;">
        <zmbManageItem  fxFlex="1 1 25%" *ngFor="let item of getItems()" [manageItem]="item"></zmbManageItem>
      </div>
      <div border-gray></div>
    </div>
  `
})

export class ZmbManageGroup {
  @Input() manageGroup: ManageGroup;//每组权限

  isHasItem(): boolean {
    if (AppUtils.isNullObj(this.manageGroup)) return false;
    return !AppUtils.isEmpty(this.manageGroup.manageItems);
  }

  getName(): string {
    if (AppUtils.isNullObj(this.manageGroup)) return null;
    return this.manageGroup.name;
  }

  getItems(): Array<ManageItem> {
    if (AppUtils.isNullObj(this.manageGroup)) return null;
    return this.manageGroup.manageItems;
  }

}


