import {AddressListViewData} from "./addressList.page";
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";

export class AddressListViewDataMgr {

  private static Instance: AddressListViewDataMgr = new AddressListViewDataMgr();

  public static getInstance(): AddressListViewDataMgr{
    return AddressListViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<AddressListViewData> = new ViewDataMgr<AddressListViewData>();

  public setData(viewData: AddressListViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:AddressListViewData, func: (viewData: AddressListViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

}
