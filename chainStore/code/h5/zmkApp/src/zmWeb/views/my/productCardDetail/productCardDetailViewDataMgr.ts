import {ViewDataMgr} from "../../zmComUtils/ViewDataMgr";
import {ProductCardDetailViewData} from "./productCardDetail.page";

export class ProductCardDetailViewDataMgr{

  private static Instance: ProductCardDetailViewDataMgr = new ProductCardDetailViewDataMgr();

  public static getInstance(): ProductCardDetailViewDataMgr{

    return ProductCardDetailViewDataMgr.Instance;
  }

  private viewDataMgr:ViewDataMgr<ProductCardDetailViewData> = new ViewDataMgr<ProductCardDetailViewData>();

  public setData(viewData:ProductCardDetailViewData):void{

    this.viewDataMgr.setData(viewData);
  }

  public onDataChanged(initData:ProductCardDetailViewData,func:(viewData:ProductCardDetailViewData) => void){

    this.viewDataMgr.onDataChanged(initData,func);

  }

}
