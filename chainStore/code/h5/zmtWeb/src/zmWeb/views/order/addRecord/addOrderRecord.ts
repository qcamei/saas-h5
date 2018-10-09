import {Component, OnInit, OnDestroy,ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AppRouter} from "../../../comModule/AppRouter";

/**
 * 添加订单跟进记录
 */
@Component({
  selector: 'add-order-record',
  templateUrl: 'addOrderRecord.html',
  styleUrls: ['addOrderRecord.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AddOrderRecordPage implements OnInit,OnDestroy {

  private paramsSub:any;
  public orderId:string;
  public leaguerId:string;

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params =>{
      this.orderId = params["orderId"];
      this.leaguerId = params["leaguerId"];
    });
  }

  ngOnDestroy(): void {

  }

  callback(){
    AppRouter.goOrderList();
  }

}
