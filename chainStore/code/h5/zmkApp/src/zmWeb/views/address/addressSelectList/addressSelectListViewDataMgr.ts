import {AddressSelectListViewData} from "./addressSelectList.page";
import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";

export class AddressListViewDataMgr {

  private static Instance: AddressListViewDataMgr = new AddressListViewDataMgr();

  public static getInstance(): AddressListViewDataMgr{
    return AddressListViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<AddressSelectListViewData> = new ViewDataMgr<AddressSelectListViewData>();

  public setData(viewData: AddressSelectListViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:AddressSelectListViewData, func: (viewData: AddressSelectListViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

}
