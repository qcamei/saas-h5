import {Component, OnInit, OnDestroy} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";

/**
 * 订单管理 订单详情 (开单收银)
 */
@Component({
  selector:'order-consume-detail',
  template:`
    
  <view-body-comp [headerArr]="['返回','订单详情']">
        <order-consume-detail-comp [orderId]="orderId"></order-consume-detail-comp>
  </view-body-comp>

`
})

export class OrderConsumeDetailPage implements OnInit,OnDestroy{

  private paramsSub:any;
  public orderId:string;


  constructor(private route:ActivatedRoute){
  }

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe(params =>{
      let orderId = params["orderId"];
      this.orderId = orderId;
    });
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.paramsSub)){
      this.paramsSub.unsubscribe();
    }
  }
}
