import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject, Subscription} from "rxjs";
import {AddProductInfoViewData} from "./productInfo/addProductInfo/addProductInfo";
import {EditProductInfoViewData} from "./productInfo/editProductInfo/editProductInfo";
import {ProductInfoDetailViewData} from "./productInfo/productInfoDetail/productInfoDetail";
import {EditProductTypeViewData} from "./productType/addProductTypeModal";
import {ProductTypeListViewData} from "./productType/productTypeListService";
import {ProductInfoListViewData} from "./productInfo/productInfoList/ProductInfoListViewData";
import {AddTypeWithReturnViewData} from "./productInfo/comp/addProductTypeWithReturn";


@Injectable()
export class ChainProductViewDataMgr { //场景：列表->编辑->列表


  private productInfoDetailVDS: Subject<ProductInfoDetailViewData> = new BehaviorSubject<ProductInfoDetailViewData>(null);//观察者对象

  public setProductInfoDetailViewData(productInfoDetailViewData: ProductInfoDetailViewData): void {
    this.productInfoDetailVDS.next(productInfoDetailViewData);
  }

  public subscribeProductInfoDetailVD(func: (viewData: ProductInfoDetailViewData) => void): Subscription { //接受者
    return this.productInfoDetailVDS.subscribe(func);
  }


  private addProductInfoVDS: Subject<AddProductInfoViewData> = new BehaviorSubject<AddProductInfoViewData>(null);//观察者对象

  public setAddProductInfoViewData(addProductInfoViewData: AddProductInfoViewData): void {
    this.addProductInfoVDS.next(addProductInfoViewData);
  }

  public subscribeAddProductInfoVD(func: (viewData: AddProductInfoViewData) => void) {
    this.addProductInfoVDS.subscribe(func);
  }



  private productInfoListVDS: Subject<ProductInfoListViewData> = new BehaviorSubject<ProductInfoListViewData>(null);//观察者对象

  public setProductInfoListViewData(productInfoListViewData: ProductInfoListViewData): void {
    this.productInfoListVDS.next(productInfoListViewData);
  }

  public subscribeProductInfoListVD(func: (productInfoListViewData: ProductInfoListViewData) => void) {
    this.productInfoListVDS.subscribe(func);
  }


  private editProductInfoVDS: Subject<EditProductInfoViewData> = new BehaviorSubject<EditProductInfoViewData>(null);//观察者对象

  public setEditProductInfoViewData(updateStorePrdInfoViewData: EditProductInfoViewData): void {
    this.editProductInfoVDS.next(updateStorePrdInfoViewData);
  }

  public subscribeEditProductInfoVD(func: (viewData: EditProductInfoViewData) => void) {
    this.editProductInfoVDS.subscribe(func);
  }


  private productTypeListVDS: Subject<ProductTypeListViewData> = new BehaviorSubject<ProductTypeListViewData>(null);//观察者对象

  public setProductTypeListViewData(productTypeListViewData: ProductTypeListViewData): void {
    this.productTypeListVDS.next(productTypeListViewData);
  }

  public subscribeProductTypeListVD(func: (productTypeListViewData: ProductTypeListViewData) => void) {
    this.productTypeListVDS.subscribe(func);
  }

  private editProductTypeVDS: Subject<EditProductTypeViewData> = new BehaviorSubject<EditProductTypeViewData>(null);//观察者对象
  public setEditProductTypeViewData(editProductTypeViewData: EditProductTypeViewData): void {
    this.editProductTypeVDS.next(editProductTypeViewData);
  }

  public subscribeEditProductTypeVD(func: (editProductTypeViewData: EditProductTypeViewData) => void) {
    this.editProductTypeVDS.subscribe(func);
  }


  private addTypeWithReturnVDS: Subject<AddTypeWithReturnViewData> = new BehaviorSubject<AddTypeWithReturnViewData>(null);//观察者对象
  public setAddTypeWithReturnViewData(addTypeWithReturnViewData: AddTypeWithReturnViewData): void {
    this.addTypeWithReturnVDS.next(addTypeWithReturnViewData);
  }

  public subscribeAddTypeWithReturnVD(func: (addTypeWithReturnViewData: AddTypeWithReturnViewData) => void) {
    this.addTypeWithReturnVDS.subscribe(func);
  }


}
