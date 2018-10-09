import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {AddressAddViewData} from "./addressAdd.page";

export class AddressAddViewDataMgr {

  private static Instance: AddressAddViewDataMgr = new AddressAddViewDataMgr();

  public static getInstance(): AddressAddViewDataMgr{
    return AddressAddViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<AddressAddViewData> = new ViewDataMgr<AddressAddViewData>();

  public setData(viewData: AddressAddViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:AddressAddViewData, func: (viewData: AddressAddViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

}
