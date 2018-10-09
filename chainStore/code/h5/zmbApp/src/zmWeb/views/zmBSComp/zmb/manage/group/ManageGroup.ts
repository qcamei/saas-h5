import {ManageItem} from "../itemInGroup/ManageItem";

/**
 * 管理页 权限组封装
 */
export class ManageGroup {

  constructor(private _name: string,private _manageItems: Array<ManageItem>) {
  }

  public static newInstance(name: string,manageItems: Array<ManageItem>): ManageGroup {
    return new ManageGroup(name,manageItems);
  }

  get manageItems(): Array<ManageItem> {
    return this._manageItems;
  }

  set manageItems(value: Array<ManageItem>) {
    this._manageItems = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}
