import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject, Subscription} from "rxjs";
import {OperationViewData} from "./operation/OperationViewData";


@Injectable()
export class OperationViewDataMgr { //场景：列表->编辑->列表


  operationListViewDataVDS: Subject<OperationViewData> = new BehaviorSubject<OperationViewData>(null);//观察者对象

  public setOperationListViewData(operationViewData: OperationViewData): void {
    this.operationListViewDataVDS.next(operationViewData);
  }

  public subscribeOperationListViewDataVD(func: (viewData: OperationViewData) => void): Subscription { //接受者
    return this.operationListViewDataVDS.subscribe(func);
  }

}
