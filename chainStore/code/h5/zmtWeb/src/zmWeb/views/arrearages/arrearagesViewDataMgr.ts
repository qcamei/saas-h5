import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {ArrearagesListViewData} from "./arrearagesList/arrearagesList";
import {ArrearagesDetailViewData} from "./arrearagesDetails/arrearagesDetails";
@Injectable()
export class ArrearagesViewDataMgr{

  private arrearagesListVD:Subject<ArrearagesListViewData> = new BehaviorSubject<ArrearagesListViewData>(null);
  private arrearagesDetailVD:Subject<ArrearagesDetailViewData> = new BehaviorSubject<ArrearagesDetailViewData>(null);

  //listpage
  public subscribeArrearageListVD(func:(arrearagesListViewData:ArrearagesListViewData)=>void){
    this.arrearagesListVD.subscribe(func);
  }

  public setArrearageListVD(arrearagesListViewData:ArrearagesListViewData){
    this.arrearagesListVD.next(arrearagesListViewData);
  }

  //detailpage
  public subscribeArrearageDetailVD(func:(arrearagesDetailViewData:ArrearagesDetailViewData)=>void){
    this.arrearagesDetailVD.subscribe(func);
  }

  public setArrearageDetailVD(arrearagesDetailViewData:ArrearagesDetailViewData){
    this.arrearagesDetailVD.next(arrearagesDetailViewData);
  }

}
