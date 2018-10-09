import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AppointmentVD} from "../../appointment/appointmentList/appointmentList.viewdata";

//  <zmbAppoint-list [imgUrl]="" [itemName]="" [itemTag]="" [count]="number"></zmbAppoint-list>
@Component({
  selector: 'zmbAppoint-list',
  template: `    
    <div>
      <div fxLayout="row" fxLayoutAlign="space-between center" style="padding:10px">
        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px"><span>{{appoint.leaguerName}}</span><span
          style="color:#999;">{{appoint.appointment.appointTime | times}}</span></div>
        <div style="color:#4678fa;">{{appoint.statusName}}</div>
      </div>
      <zmbAppoint-item [itemList]="appoint.appointProducts"></zmbAppoint-item>
    </div>
  `
})

// assets/img/avatar.jpeg
export class ZmbAppointList implements OnInit {

  @Input() appoint: AppointmentVD = new AppointmentVD();


  constructor() {
  }


  ngOnInit() {

  }

}

