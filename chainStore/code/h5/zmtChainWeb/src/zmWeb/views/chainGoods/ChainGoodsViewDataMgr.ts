import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject, Subscription} from "rxjs";
import {AddGoodsViewData} from './addGoods/AddGoods';
import {UpdateChainGoodsTypeViewData} from './goodsClassify/goodsClassifyModalComp';
import {ChainGoodsListViewData} from "./goodsList/GoodsList";
import {ChainGoodsTypeListViewData} from "./goodsClassify/goodsClassify";
import {EditChainGoodsViewData} from "./editGoods/editGoods";
import {ChainGoodsDetailViewData} from "./goodsDetails/goodsDetails";
import {AddTypeWithReturnViewData} from "../chainProduct/productInfo/comp/addProductTypeWithReturn";


@Injectable()
export class ChainGoodsViewDataMgr { //场景：列表->编辑->列表

  private addGoodsInfoVDS: Subject<AddGoodsViewData> = new BehaviorSubject<AddGoodsViewData>(null);//观察者对象

  public setAddGoodsViewData(addGoodsViewData:AddGoodsViewData):void{
    this.addGoodsInfoVDS.next(addGoodsViewData);
  }

  public subscribeAddGoodsVD(func:(viewData:AddGoodsViewData)=>void){
    this.addGoodsInfoVDS.subscribe(func);
  }

  private chainGoodsListVDS: Subject<ChainGoodsListViewData> = new BehaviorSubject<ChainGoodsListViewData>(null);//观察者对象

  public setChainGoodsListViewData(chainGoodsListViewData:ChainGoodsListViewData):void{
    this.chainGoodsListVDS.next(chainGoodsListViewData);
  }

  public subscribeChainGoodsListVD(func:(chainGoodsListViewData:ChainGoodsListViewData)=>void){
    this.chainGoodsListVDS.subscribe(func);
  }

  private chainGoodsTypeListVDS: Subject<ChainGoodsTypeListViewData> = new BehaviorSubject<ChainGoodsTypeListViewData>(null);//观察者对象

  public setChainGoodsTypeListViewData(chainGoodsTypeListViewData:ChainGoodsTypeListViewData):void{
    this.chainGoodsTypeListVDS.next(chainGoodsTypeListViewData);
  }

  public subscribeChainGoodsTypeListVD(func:(chainGoodsTypeListViewData:ChainGoodsTypeListViewData)=>void){
    this.chainGoodsTypeListVDS.subscribe(func);
  }

  private editChainGoodsVDS: Subject<EditChainGoodsViewData> = new BehaviorSubject<EditChainGoodsViewData>(null);//观察者对象

  public setEditChainGoodsViewData(editChainGoodsViewData:EditChainGoodsViewData):void{
    this.editChainGoodsVDS.next(editChainGoodsViewData);
  }

  public subscribeEditChainGoodsVD(func:(viewData:EditChainGoodsViewData)=>void){
    this.editChainGoodsVDS.subscribe(func);
  }

  private chainGoodsDetailVDS: Subject<ChainGoodsDetailViewData> = new BehaviorSubject<ChainGoodsDetailViewData>(null);//观察者对象

  public setChainGoodsDetailViewData(chainDetailViewData:ChainGoodsDetailViewData):void{
    this.chainGoodsDetailVDS.next(chainDetailViewData);
  }

  public subscribeChainGoodsDetailVD(func:(viewData:ChainGoodsDetailViewData)=>void):Subscription{ //接受者
    return this.chainGoodsDetailVDS.subscribe(func);
  }

  private updateChainGoodsTypeVDS: Subject<UpdateChainGoodsTypeViewData> = new BehaviorSubject<UpdateChainGoodsTypeViewData>(null);//观察者对象

  public setUpdateChainGoodsTypeViewData(updateChainGoodsTypeViewData:UpdateChainGoodsTypeViewData):void{
    this.updateChainGoodsTypeVDS.next(updateChainGoodsTypeViewData);
  }

  public subscribeUpdateChainGoodsTypeVD(func:(updateChainGoodsTypeViewData:UpdateChainGoodsTypeViewData)=>void){
    this.updateChainGoodsTypeVDS.subscribe(func);
  }

  private addTypeWithReturnVDS: Subject<AddTypeWithReturnViewData> = new BehaviorSubject<AddTypeWithReturnViewData>(null);//观察者对象
  public setAddTypeWithReturnViewData(addTypeWithReturnViewData: AddTypeWithReturnViewData): void {
    this.addTypeWithReturnVDS.next(addTypeWithReturnViewData);
  }

  public subscribeAddTypeWithReturnVD(func: (addTypeWithReturnViewData: AddTypeWithReturnViewData) => void) {
    this.addTypeWithReturnVDS.subscribe(func);
  }
}
