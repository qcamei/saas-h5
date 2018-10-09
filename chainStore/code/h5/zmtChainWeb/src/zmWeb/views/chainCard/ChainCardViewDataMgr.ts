import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject, Subscription} from "rxjs";
import {AddMemberCardViewData} from "./memberCard/addMemberCard/addMemberCard";
import {MemberCardDetailViewData} from "./memberCard/memberCardDetail/memberCardDetail";
import {UpdateMemberCardViewData} from "./memberCard/updateMemberCard/updateMemberCard";
import {AddProductCardViewData} from "./productCard/addProductCard/addProductCard";
import {ProductCardDetailViewData} from "./productCard/productCardDetail/productCardDetail";
import {ProductCardListViewData} from "./productCard/productCardList/productCardList";
import {UpdateProductCardViewData} from "./productCard/updateProductCard/updateProductCard";
import {MemberCardListViewData} from "./memberCard/memberCardList/memberCardList";
import {ProductCardTypeListViewData} from "./productCard/productCardType/productCardTypListService";
import {EditProductCardTypeViewData} from "./productCard/productCardType/addProductCardTypeCompl";
import {AddProductCardTypeWithReturnViewData} from "./Comp/addTypeWithReturn/addPrdCardTypeWithReturn";

@Injectable()
export class ChainCardViewDataMgr { //场景：列表->编辑->列表


  private addMemberCardVDS: Subject<AddMemberCardViewData> = new BehaviorSubject<AddMemberCardViewData>(null);//观察者对象

  public setAddMemberCardViewData(addMemberCardViewData: AddMemberCardViewData): void {
    this.addMemberCardVDS.next(addMemberCardViewData);
  }

  public subscribeAddMemberCardVD(func: (viewData: AddMemberCardViewData) => void) {
    this.addMemberCardVDS.subscribe(func);
  }


  private memberCardDetailVDS: Subject<MemberCardDetailViewData> = new BehaviorSubject<MemberCardDetailViewData>(null);//观察者对象

  public setMemberCardDetailViewData(storeDetailViewData: MemberCardDetailViewData): void {
    this.memberCardDetailVDS.next(storeDetailViewData);
  }

  public subscribeMemberCardDetailVD(func: (viewData: MemberCardDetailViewData) => void): Subscription { //接受者
    return this.memberCardDetailVDS.subscribe(func);
  }


  private memberCardListVDS: Subject<MemberCardListViewData> = new BehaviorSubject<MemberCardListViewData>(null);//观察者对象

  public setMemberCardListViewData(memberCardListViewData: MemberCardListViewData): void {
    this.memberCardListVDS.next(memberCardListViewData);
  }

  public subscribeMemberCardListVD(func: (memberCardListViewData: MemberCardListViewData) => void) {
    this.memberCardListVDS.subscribe(func);
  }

  private updateMemberCardVDS: Subject<UpdateMemberCardViewData> = new BehaviorSubject<UpdateMemberCardViewData>(null);//观察者对象

  public setUpdateMemberCardViewData(updateMemberCardViewData: UpdateMemberCardViewData): void {
    this.updateMemberCardVDS.next(updateMemberCardViewData);
  }

  public subscribeUpdateMemberCardVD(func: (viewData: UpdateMemberCardViewData) => void) {
    this.updateMemberCardVDS.subscribe(func);
  }


  /*******************次卡**************************/


  private addProductCardVDS: Subject<AddProductCardViewData> = new BehaviorSubject<AddProductCardViewData>(null);//观察者对象

  public setAddProductCardViewData(addProductCardViewData: AddProductCardViewData): void {
    this.addProductCardVDS.next(addProductCardViewData);
  }

  public subscribeAddProductCardVD(func: (viewData: AddProductCardViewData) => void) {
    this.addProductCardVDS.subscribe(func);
  }

  private productCardDetailVDS: Subject<ProductCardDetailViewData> = new BehaviorSubject<ProductCardDetailViewData>(null);//观察者对象

  public setProductCardDetailViewData(storeDetailViewData: ProductCardDetailViewData): void {
    this.productCardDetailVDS.next(storeDetailViewData);
  }

  public subscribeProductCardDetailVD(func: (viewData: ProductCardDetailViewData) => void): Subscription { //接受者
    return this.productCardDetailVDS.subscribe(func);
  }

  private productCardListVDS: Subject<ProductCardListViewData> = new BehaviorSubject<ProductCardListViewData>(null);//观察者对象

  public setProductCardListViewData(productCardListViewData: ProductCardListViewData): void {
    this.productCardListVDS.next(productCardListViewData);
  }

  public subscribeProductCardListVD(func: (productCardListViewData: ProductCardListViewData) => void) {
    this.productCardListVDS.subscribe(func);
  }

  private updateProductCardVDS: Subject<UpdateProductCardViewData> = new BehaviorSubject<UpdateProductCardViewData>(null);//观察者对象

  public setUpdateProductCardViewData(updateProductCardViewData: UpdateProductCardViewData): void {
    this.updateProductCardVDS.next(updateProductCardViewData);
  }

  public subscribeUpdateProductCardVD(func: (viewData: UpdateProductCardViewData) => void) {
    this.updateProductCardVDS.subscribe(func);
  }

  /*******************次卡分类**************************/
  private productCardTypeListVDS: Subject<ProductCardTypeListViewData> = new BehaviorSubject<ProductCardTypeListViewData>(null);//观察者对象

  public setProductCardTypeListViewData(productCardTypeListViewData: ProductCardTypeListViewData): void {
    this.productCardTypeListVDS.next(productCardTypeListViewData);
  }

  public subscribeProductCardTypeListVD(func: (productCardTypeListViewData: ProductCardTypeListViewData) => void) {
    this.productCardTypeListVDS.subscribe(func);
  }

  private updateProductCardTypeVDS: Subject<EditProductCardTypeViewData> = new BehaviorSubject<EditProductCardTypeViewData>(null);//观察者对象

  public setEditProductCardTypeViewData(editProductCardTypeViewData: EditProductCardTypeViewData): void {
    this.updateProductCardTypeVDS.next(editProductCardTypeViewData);
  }

  public subscribeEditProductCardTypeVD(func: (viewData: EditProductCardTypeViewData) => void) {
    this.updateProductCardTypeVDS.subscribe(func);
  }

  private addTypeWithReturnVDS: Subject<AddProductCardTypeWithReturnViewData> = new BehaviorSubject<AddProductCardTypeWithReturnViewData>(null);//观察者对象
  public setAddTypeWithReturnViewData(addTypeWithReturnViewData: AddProductCardTypeWithReturnViewData): void {
    this.addTypeWithReturnVDS.next(addTypeWithReturnViewData);
  }

  public subscribeAddTypeWithReturnVD(func: (addTypeWithReturnViewData: AddProductCardTypeWithReturnViewData) => void) {
    this.addTypeWithReturnVDS.subscribe(func);
  }

}
