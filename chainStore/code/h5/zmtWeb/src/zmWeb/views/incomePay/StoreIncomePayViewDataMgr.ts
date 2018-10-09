import {BehaviorSubject, Subject} from "rxjs/index";
import {AddIncomePayViewData} from "./addIncomPay/AddIncomePay";
import {Injectable} from "@angular/core";
import {IncomePayListViewData} from "./incomePayList/IncomePayList";
import {EditIncomePayViewData} from "./editIncomePay/EditIncomePay";
import {IncomePayTypeListViewData} from "./incomePayType/IncomePayType";
import {EditIncomePayTypeViewData} from "./incomePayType/incomePayTypeModule";

@Injectable()
export class StoreIncomePayViewDataMgr { //场景：列表->编辑->列表

  private addIncomePayVDS: Subject<AddIncomePayViewData> = new BehaviorSubject<AddIncomePayViewData>(null);//观察者对象

  public setAddIncomePayViewData(addIncomePayViewData:AddIncomePayViewData):void{
    this.addIncomePayVDS.next(addIncomePayViewData);
  }

  public subscribeAddIncomePayVD(func:(viewData:AddIncomePayViewData)=>void){
    this.addIncomePayVDS.subscribe(func);
  }

  private incomePayListVDS: Subject<IncomePayListViewData> = new BehaviorSubject<IncomePayListViewData>(null);//观察者对象

  public setIncomePayListViewData(incomePayListViewData:IncomePayListViewData):void{
    this.incomePayListVDS.next(incomePayListViewData);
  }

  public subscribeIncomePayListVD(func:(incomePayListViewData:IncomePayListViewData)=>void){
    this.incomePayListVDS.subscribe(func);
  }

  private storeIncomePayTypeListVDS: Subject<IncomePayTypeListViewData> = new BehaviorSubject<IncomePayTypeListViewData>(null);//观察者对象

  public setStoreIncomePayTypeListViewData(storeIncomePayTypeListViewData:IncomePayTypeListViewData):void{
    this.storeIncomePayTypeListVDS.next(storeIncomePayTypeListViewData);
  }

  public subscribeStoreIncomePayTypeListVD(func:(storeIncomePayTypeListViewData:IncomePayTypeListViewData)=>void){
    this.storeIncomePayTypeListVDS.subscribe(func);
  }

  private editIncomePayVDS: Subject<EditIncomePayViewData> = new BehaviorSubject<EditIncomePayViewData>(null);//观察者对象

  public setEditIncomePayViewData(editIncomePayViewData:EditIncomePayViewData):void{
    this.editIncomePayVDS.next(editIncomePayViewData);
  }

  public subscribeEditIncomePayVD(func:(viewData:EditIncomePayViewData)=>void){
    this.editIncomePayVDS.subscribe(func);
  }

  private editIncomePayTypeVDS: Subject<EditIncomePayTypeViewData> = new BehaviorSubject<EditIncomePayTypeViewData>(null);//观察者对象

  public setEditIncomePayTypeViewData(editIncomePayTypeViewData:EditIncomePayTypeViewData):void{
    this.editIncomePayTypeVDS.next(editIncomePayTypeViewData);
  }

  public subscribeEditIncomePayTypeVD(func:(viewData:EditIncomePayTypeViewData)=>void){
    this.editIncomePayTypeVDS.subscribe(func);
  }

}
