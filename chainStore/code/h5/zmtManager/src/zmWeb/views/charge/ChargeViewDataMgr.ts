import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {ChargeListViewData} from "./chargeList/chargeList";
import {AddChargeViewData} from "./addCharge/addCharge";
import {EditChargeViewData} from "./editCharge/editCharge";

@Injectable()
export class ChargeViewDataMgr{

  private chargeListVD:Subject<ChargeListViewData> = new BehaviorSubject<ChargeListViewData>(null);
  private addChargeVD:Subject<AddChargeViewData> = new BehaviorSubject<AddChargeViewData>(null);
  private editChargeVD:Subject<EditChargeViewData> = new BehaviorSubject<EditChargeViewData>(null);

  //chargeList
  public subscribeChargeListVD(fun:(viewData:ChargeListViewData)=>void){
    this.chargeListVD.subscribe(fun);
  }

  public setChargeListViewData(viewData:ChargeListViewData){
    this.chargeListVD.next(viewData);
  }

  //addCharge
  public subscribeAddChargeVD(fun:(viewData:AddChargeViewData)=>void){
    this.addChargeVD.subscribe(fun);
  }

  public setAddChargeViewData(viewData:AddChargeViewData){
    this.addChargeVD.next(viewData);
  }

  //editCharge
  public subscribeEditChargeVD(fun:(viewData:EditChargeViewData)=>void){
    this.editChargeVD.subscribe(fun);
  }

  public setEditChargeViewData(viewData:EditChargeViewData){
    this.editChargeVD.next(viewData);
  }

}
