import {Injectable} from "@angular/core";
import {EditVipLevelTypeViewData} from "./comp/VipLevelTypeComp";
import {Subject, BehaviorSubject} from "rxjs";
import {VipLevelTypeListViewData} from "./listService";
import {AddVipLevelTypeViewData} from "./comp/AddTypeAndReturnComp";


@Injectable()
export class VipLevelTypeViewDataMgr { //场景：列表->编辑->列表


  private vipLevelTypeListVDS: Subject<VipLevelTypeListViewData> = new BehaviorSubject<VipLevelTypeListViewData>(null);//观察者对象

  public setVipLevelTypeListViewData(viewData: VipLevelTypeListViewData): void {
    this.vipLevelTypeListVDS.next(viewData);
  }

  public subscribeVipLevelTypeListVD(func: (viewData: VipLevelTypeListViewData) => void) {
    this.vipLevelTypeListVDS.subscribe(func);
  }

  private addVipLevelTypeVDS: Subject<AddVipLevelTypeViewData> = new BehaviorSubject<AddVipLevelTypeViewData>(null);//观察者对象

  public setAddVipLevelTypeViewData(viewData: AddVipLevelTypeViewData): void {
    this.addVipLevelTypeVDS.next(viewData);
  }

  public subscribeAddVipLevelTypeVD(func: (viewData: AddVipLevelTypeViewData) => void) {
    this.addVipLevelTypeVDS.subscribe(func);
  }



  private editVipLevelTypeVDS: Subject<EditVipLevelTypeViewData> = new BehaviorSubject<EditVipLevelTypeViewData>(null);//观察者对象

  public setEditVipLevelTypeViewData(viewData: EditVipLevelTypeViewData): void {
    this.editVipLevelTypeVDS.next(viewData);
  }

  public subscribeEditVipLevelTypeVD(func: (viewData: EditVipLevelTypeViewData) => void) {
    this.editVipLevelTypeVDS.subscribe(func);
  }
}
