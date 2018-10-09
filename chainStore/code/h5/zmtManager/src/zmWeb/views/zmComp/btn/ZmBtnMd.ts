import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/3/20
 * <zm_btn_md name="中按钮" (zmbtnClick)="click()"></zm_btn_md>
 */

@Component({
  selector:'zm_btn_md',
  template: '<button type="button" class="btn btn-primary btn-block" (click)="btnMd_Click()">{{name}}</button>',
  styles:[`
    // .btn-md{
    //   width: 150px;
    //   height: 50px;
    //   line-height: 50px;
    //   font-size: 16px;
    //   text-align: center;
    //   background: #4678fa;
    //   border-radius: 6px;
    //   color: #fff;
    //   cursor: pointer;
    //   border: none;
    //   outline: none;
      /*文本不能被選擇*/
      /*-webkit-user-select: none;*/
      /*-moz-user-select: none;*/
      /*-ms-user-select: none;*/
      /*user-select: none;*/
      /*cursor: pointer;*/
      /*outline: none;*/
    }
  `]
})
export class ZmBtnMd implements OnInit,OnDestroy {

  @Input() name: string;
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  btnMd_Click(){
    this.zmbtnClick.emit();
  }

}
