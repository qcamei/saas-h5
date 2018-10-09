import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../comModule/AppUtils";

@Component({
  template: `
        <view-body-comp [headerArr]="['预约列表','预约详情']" >
         <appoint-detail-comp [appointId]="appointId"></appoint-detail-comp>
       </view-body-comp>
     
`
})


export class AppointmentDetailsPage implements OnInit,OnDestroy {

  public appointId:string;
  private paramsSub:any;

  constructor(public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      let apptId = params['apptId'];
      this.appointId = apptId;
    });

  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.paramsSub)) {
      this.paramsSub.unsubscribe();
    }
  }
}
