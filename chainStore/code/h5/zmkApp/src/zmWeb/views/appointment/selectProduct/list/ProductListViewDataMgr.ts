import {ProductListViewData} from "./ProductListViewData";
import {ViewDataMgr} from "../../../zmComUtils/ViewDataMgr";

export class ProductListViewDataMgr {

  private static Instance: ProductListViewDataMgr = new ProductListViewDataMgr();

  public static getInstance(): ProductListViewDataMgr{
    return ProductListViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<ProductListViewData> = new ViewDataMgr<ProductListViewData>();

  public setData(vieData: ProductListViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:ProductListViewData, func: (viewData: ProductListViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

}
