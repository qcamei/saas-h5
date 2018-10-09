import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/2/23.
 * <zm_btn_large name="大按钮" (zmClick)="click()"></zm_btn_large>
 */


@Component({
  selector:'zm_btn_large',
  template: '<button type="button" class="btn btn-primary btn-lg" (click)="onClick()">{{name}}</button>'
})
export class ZmBtnLarge implements OnInit,OnDestroy {

  @Input() name: string;
  @Output() zmClick: EventEmitter<any> = new EventEmitter();

  constructor(){

  }

  public onClick(): void {
    // console.log("emit trigger");
    this.zmClick.emit(null);
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }


}
