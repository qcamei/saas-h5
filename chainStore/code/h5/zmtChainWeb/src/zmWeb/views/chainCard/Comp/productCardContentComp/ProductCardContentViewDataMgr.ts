import {ViewDataMgr} from "../../../zmComUtils/ViewDataMgr";
import {ProductCardContentCompViewData} from "./ProductCardContentCompViewData";

export class ProductCardContentViewDataMgr {

  private static Instance: ProductCardContentViewDataMgr = new ProductCardContentViewDataMgr();

  public static getInstance(): ProductCardContentViewDataMgr{
    return ProductCardContentViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<ProductCardContentCompViewData> = new ViewDataMgr<ProductCardContentCompViewData>();

  public setData(vieData: ProductCardContentCompViewData): void {
    this.viewDataMgr.setData(vieData);
  }

  public onDataChanged(initData:ProductCardContentCompViewData, func: (viewData: ProductCardContentCompViewData) => void) {
    this.viewDataMgr.onDataChanged(initData,func);
  }

  public onInformDataChanged(func: () => void) {
    this.viewDataMgr.onInformDataChanged(func);
  }
  onViewDestroy():void{
    this.viewDataMgr.onViewDestroy();
  }

  public notifyDataChanged(): void {
    this.viewDataMgr.notifyDataChanged();
  }


}
