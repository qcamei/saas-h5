import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {ProductSelectListViewData} from "./productSelectList.page";

export class ProductSelectListViewDataMgr {
  private static instance: ProductSelectListViewDataMgr = new ProductSelectListViewDataMgr();
  private viewDataMgr: ViewDataMgr<ProductSelectListViewData> = new ViewDataMgr<ProductSelectListViewData>();

  public static getInstance(): ProductSelectListViewDataMgr {
    return ProductSelectListViewDataMgr.instance;
  }

  public setData(viewData: ProductSelectListViewData): void {
    this.viewDataMgr.setData(viewData);
  }

  public onDataChange(oldViewData: ProductSelectListViewData, func: (viewData: ProductSelectListViewData) => void) {
    this.viewDataMgr.onDataChanged(oldViewData, func);
  }

  public onViewDestroy(): void {
    this.viewDataMgr.onViewDestroy();
  }
}
