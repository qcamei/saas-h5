import {StaffItemData} from "./StaffItemData";

export class StaffExChangeData {

  private static instance:StaffExChangeData = new StaffExChangeData();

  public static getInstance():StaffExChangeData{
    return StaffExChangeData.instance;
  }

  private _staffList:Array<StaffItemData>;//跟进人员

  public getStaffList(): Array<StaffItemData> {
    return this._staffList;
  }

  public setStaffList(value: Array<StaffItemData>) {
    this._staffList = value;
  }

  public clear(){
    this._staffList = null;
  }

}
