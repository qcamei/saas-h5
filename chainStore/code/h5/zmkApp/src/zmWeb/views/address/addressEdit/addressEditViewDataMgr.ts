import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {AddressEditViewData} from "./addressEdit.page";

export class AddressEditViewDataMgr {

  private static Instance: AddressEditViewDataMgr = new AddressEditViewDataMgr();

  public static getInstance(): AddressEditViewDataMgr{
    return AddressEditViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<AddressEditViewData> = new ViewDataMgr<AddressEditViewData>();

  public setData(viewData: AddressEditViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:AddressEditViewData, func: (viewData: AddressEditViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

}
