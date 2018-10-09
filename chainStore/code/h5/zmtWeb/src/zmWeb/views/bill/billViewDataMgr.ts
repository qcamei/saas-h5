import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {BillListViewData} from "./billList/billList";
import {BillDetailViewData} from "./billDetail/billDetail";
import {BillProgressViewData} from "./comp/billProgress";


@Injectable()
export class BillViewDataMgr {

  //观察者对象
  private billListVD: Subject<BillListViewData> = new BehaviorSubject<BillListViewData>(null);
  private billDetailVD: Subject<BillDetailViewData> = new BehaviorSubject<BillDetailViewData>(null);
  private progressVD: Subject<BillProgressViewData> = new BehaviorSubject<BillProgressViewData>(null);

  //billList
  public setListViewData(billListViewData:BillListViewData):void{
    this.billListVD.next(billListViewData);
  }

  public subscribeListVD(func:(billListViewData:BillListViewData)=>void){
    this.billListVD.subscribe(func);
  }

  //billDetail
  public setDetailViewData(billDetailViewData:BillDetailViewData):void{
    this.billDetailVD.next(billDetailViewData);
  }

  public subscribeDetailVD(func:(billDetailViewData:BillDetailViewData)=>void){
    this.billDetailVD.subscribe(func);
  }

  //progress
  public setProgressViewData(billProgressViewData:BillProgressViewData):void{
    this.progressVD.next(billProgressViewData);
  }

  public subscribeProgressVD(func:(billProgressViewData:BillProgressViewData)=>void){
    this.progressVD.subscribe(func);
  }

}
