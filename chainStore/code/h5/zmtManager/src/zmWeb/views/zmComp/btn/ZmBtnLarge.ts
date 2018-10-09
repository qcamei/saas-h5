import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/2/23.
 * <zm_btn_large name="大按钮" (zmbtnClick)="click()"></zm_btn_large>
 */


@Component({
  selector:'zm_btn_large',
  template: '<button type="button" class="btn-large" (click)="btnLarge_Click()"  >{{name}}</button>',
  styles:[`
    .btn-large{ 
      width: calc(50% - 184px);
      color: #fff;
      background: #4678fa;
      border: none;
      border-radius:6px;
      padding:0.75rem 0.35rem;;
      font-size:1rem;
      cursor: pointer;
      outline: none;
    }
  `]
})
export class ZmBtnLarge implements OnInit,OnDestroy {

  @Input() name: string;
  @Input() disabledBtn: boolean;
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){

  }

  public btnLarge_Click(): void {
    this.zmbtnClick.emit();
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
}
