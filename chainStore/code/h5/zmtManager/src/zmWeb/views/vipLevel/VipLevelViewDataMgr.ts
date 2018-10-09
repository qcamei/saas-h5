import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {VipLevelListViewData} from "./vipLevelList/vipLevelList";
import {AddVipLevelViewData} from "./addVipLevel/addVipLevel";
import {EditVipLevelViewData} from "./editVipLevel/editVipLevel";


@Injectable()
export class VipLevelViewDataMgr { //场景：列表->编辑->列表


  private vipLevelListVDS: Subject<VipLevelListViewData> = new BehaviorSubject<VipLevelListViewData>(null);//观察者对象

  public setVipLevelListViewData(viewData: VipLevelListViewData): void {
    this.vipLevelListVDS.next(viewData);
  }

  public subscribeVipLevelListVD(func: (viewData: VipLevelListViewData) => void) {
    this.vipLevelListVDS.subscribe(func);
  }

  private addVipLevelVDS: Subject<AddVipLevelViewData> = new BehaviorSubject<AddVipLevelViewData>(null);//观察者对象

  public setAddVipLevelViewData(viewData: AddVipLevelViewData): void {
    this.addVipLevelVDS.next(viewData);
  }

  public subscribeAddVipLevelVD(func: (viewData: AddVipLevelViewData) => void) {
    this.addVipLevelVDS.subscribe(func);
  }

  private editVipLevelVDS: Subject<EditVipLevelViewData> = new BehaviorSubject<EditVipLevelViewData>(null);//观察者对象

  public setEditVipLevelViewData(viewData: EditVipLevelViewData): void {
    this.editVipLevelVDS.next(viewData);
  }

  public subscribeEditVipLevelVD(func: (viewData: EditVipLevelViewData) => void) {
    this.editVipLevelVDS.subscribe(func);
  }
}
