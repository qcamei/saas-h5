import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject, Subscription} from "rxjs";
import {AddGoodsViewData} from './addGoods/addGoods';
import {StoreGoodsListViewData} from './storeGoodsList/storeGoodsList';
import {StoreGoodsTypeListViewData} from './goodsClassify/goodsClassify';
import {EditStoreGoodsViewData} from './editGoods/editGoods';
import {StoreGoodsDetailViewData} from './goodsDetails/goodsDetails';
import {UpdateStoreGoodsTypeViewData} from './goodsClassify/goodsClassifyModalComp';
import {AddTypeWithReturnViewData} from "../storeProductInfo/productInfo/comp/addProductTypeWithReturn";


@Injectable()
export class StoreGoodsViewDataMgr { //场景：列表->编辑->列表

  private addGoodsInfoVDS: Subject<AddGoodsViewData> = new BehaviorSubject<AddGoodsViewData>(null);//观察者对象

  public setAddGoodsViewData(addGoodsViewData:AddGoodsViewData):void{
    this.addGoodsInfoVDS.next(addGoodsViewData);
  }

  public subscribeAddGoodsVD(func:(viewData:AddGoodsViewData)=>void){
    this.addGoodsInfoVDS.subscribe(func);
  }

  private storeGoodsListVDS: Subject<StoreGoodsListViewData> = new BehaviorSubject<StoreGoodsListViewData>(null);//观察者对象

  public setStoreGoodsListViewData(storeGoodsListViewData:StoreGoodsListViewData):void{
    this.storeGoodsListVDS.next(storeGoodsListViewData);
  }

  public subscribeStoreGoodsListVD(func:(storeGoodsListViewData:StoreGoodsListViewData)=>void){
    this.storeGoodsListVDS.subscribe(func);
  }

  private storeGoodsTypeListVDS: Subject<StoreGoodsTypeListViewData> = new BehaviorSubject<StoreGoodsTypeListViewData>(null);//观察者对象

  public setStoreGoodsTypeListViewData(storeGoodsTypeListViewData:StoreGoodsTypeListViewData):void{
    this.storeGoodsTypeListVDS.next(storeGoodsTypeListViewData);
  }

  public subscribeStoreGoodsTypeListVD(func:(storeGoodsTypeListViewData:StoreGoodsTypeListViewData)=>void){
    this.storeGoodsTypeListVDS.subscribe(func);
  }

  private editStoreGoodsVDS: Subject<EditStoreGoodsViewData> = new BehaviorSubject<EditStoreGoodsViewData>(null);//观察者对象

  public setEditStoreGoodsViewData(editStoreGoodsViewData:EditStoreGoodsViewData):void{
    this.editStoreGoodsVDS.next(editStoreGoodsViewData);
  }

  public subscribeEditStoreGoodsVD(func:(viewData:EditStoreGoodsViewData)=>void){
    this.editStoreGoodsVDS.subscribe(func);
  }

  private storeGoodsDetailVDS: Subject<StoreGoodsDetailViewData> = new BehaviorSubject<StoreGoodsDetailViewData>(null);//观察者对象

  public setStoreGoodsDetailViewData(storeDetailViewData:StoreGoodsDetailViewData):void{
    this.storeGoodsDetailVDS.next(storeDetailViewData);
  }

  public subscribeStoreGoodsDetailVD(func:(viewData:StoreGoodsDetailViewData)=>void):Subscription{ //接受者
    return this.storeGoodsDetailVDS.subscribe(func);
  }

  private updateStoreGoodsTypeVDS: Subject<UpdateStoreGoodsTypeViewData> = new BehaviorSubject<UpdateStoreGoodsTypeViewData>(null);//观察者对象

  public setUpdateStoreGoodsTypeViewData(updateStoreGoodsTypeViewData:UpdateStoreGoodsTypeViewData):void{
    this.updateStoreGoodsTypeVDS.next(updateStoreGoodsTypeViewData);
  }

  public subscribeUpdateStoreGoodsTypeVD(func:(updateStoreGoodsTypeViewData:UpdateStoreGoodsTypeViewData)=>void){
    this.updateStoreGoodsTypeVDS.subscribe(func);
  }

  private addTypeWithReturnVDS: Subject<AddTypeWithReturnViewData> = new BehaviorSubject<AddTypeWithReturnViewData>(null);//观察者对象
  public setAddTypeWithReturnViewData(addTypeWithReturnViewData: AddTypeWithReturnViewData): void {
    this.addTypeWithReturnVDS.next(addTypeWithReturnViewData);
  }

  public subscribeAddTypeWithReturnVD(func: (addTypeWithReturnViewData: AddTypeWithReturnViewData) => void) {
    this.addTypeWithReturnVDS.subscribe(func);
  }
}
