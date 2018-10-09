import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject, Subscription} from "rxjs"
import {AppointmentListViewData} from "./appointmentList/AppointmentListViewData";
import {AppointDetailCompViewData} from "./appointmentDetails/appointDetailComp";

@Injectable()
export class AppointmentViewDataMgr { //场景：列表->编辑->列表

  private appointmentListVDS: Subject<AppointmentListViewData> = new BehaviorSubject<AppointmentListViewData>(null);//观察者对象

  public setAppointmentListViewData(appointmentListViewData: AppointmentListViewData): void {
    this.appointmentListVDS.next(appointmentListViewData);
  }

  public subscribeAppointmentListVD(func: (appointmentListViewData: AppointmentListViewData) => void) {
    this.appointmentListVDS.subscribe(func);
  }


  private appointDetailCompVD: Subject<AppointDetailCompViewData> = new BehaviorSubject<AppointDetailCompViewData>(null);//观察者对象

  public setAppointDetailCompViewData(viewData: AppointDetailCompViewData): void {
    this.appointDetailCompVD.next(viewData);
  }

  public subscribeAppointDetailCompVD(func: (viewData: AppointDetailCompViewData) => void): Subscription { //接受者
    return this.appointDetailCompVD.subscribe(func);
  }

}
