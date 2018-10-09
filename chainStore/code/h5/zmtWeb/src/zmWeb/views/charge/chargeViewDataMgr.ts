import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {ChargeViewData} from "./charge/charge";
import {ChargePayViewData} from "./chargePay/chargePay";
import {ChargeListViewData} from "./chargeList/chargeList";

@Injectable()
export class ChargeViewDataMgr{

  private chargeVD:Subject<ChargeViewData> = new BehaviorSubject<ChargeViewData>(null);
  private chargePayVD:Subject<ChargePayViewData> = new BehaviorSubject<ChargePayViewData>(null);
  private chargeListVD:Subject<ChargeListViewData> = new BehaviorSubject<ChargeListViewData>(null);

  //charge
  public subscribeChargeVD(fun:(viewData:ChargeViewData)=>void){
    this.chargeVD.subscribe(fun);
  }

  public setChargeViewData(viewData:ChargeViewData){
    this.chargeVD.next(viewData);
  }

  //chargePay
  public subscribeChargePayVD(fun:(viewData:ChargePayViewData)=>void){
    this.chargePayVD.subscribe(fun);
  }

  public setChargePayViewData(viewData:ChargePayViewData){
    this.chargePayVD.next(viewData);
  }

  //chargeList
  public subscribeChargeListVD(fun:(viewData:ChargeListViewData)=>void){
    this.chargeListVD.subscribe(fun);
  }

  public setChargeListViewData(viewData:ChargeListViewData){
    this.chargeListVD.next(viewData);
  }

}
