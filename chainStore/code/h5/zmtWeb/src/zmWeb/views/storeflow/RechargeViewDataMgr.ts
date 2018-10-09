import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {RechargeViewData} from './storeRecharge/RechargeViewData';


@Injectable()
export class RechargeViewDataMgr {
  //观察者对象
  private rechargeVD: Subject<RechargeViewData> = new BehaviorSubject<RechargeViewData>(null);

  //rechargeViewData
  public setRechargeViewData(rechargeViewData:RechargeViewData):void{
    this.rechargeVD.next(rechargeViewData);
  }

  public subscribeRechargeVD(func:(rechargeViewData:RechargeViewData)=>void){
    this.rechargeVD.subscribe(func);
  }
}
