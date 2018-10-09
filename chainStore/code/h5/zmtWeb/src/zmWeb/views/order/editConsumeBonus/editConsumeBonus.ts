import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppRouter} from "../../../comModule/AppRouter";

/**
 * 订单管理 修改提成 (开单收银)
 */
@Component({
  selector: 'edit-consume-bonus',
  templateUrl: 'editConsumeBonus.html',
  styleUrls: ['editConsumeBonus.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditConsumeBonusPage implements OnInit,OnDestroy {

  private paramsSub: any;

  public orderId:string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe(params => {
      this.orderId = params["orderId"];
    })
  }

  ngOnDestroy(): void {

  }

  callback(){
    AppRouter.goOrderList();
  }

}



