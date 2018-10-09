import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

/**
 <zm-btn-updown (zmbtnClick)="sortConsumeTime($event)" [active]="0"></zm-btn-updown>
 */
@Component({
  selector:'zm-btn-updown',
  template: `
  <div fxLayout="column">
    <span (click)="btnUpDown_Click(1)" class="transformUpDown zmCurHand" [class.opacity]="active==1" fxLayout="column" fxLayoutAlign="center center" style="width:26px;height:12px;">
        <img src="assets/images/icon/direction-down.png" alt="">
    </span>
    <span (click)="btnUpDown_Click(0)"  [class.opacity]="active==0" class="zmCurHand" fxLayout="column" fxLayoutAlign="center center" style="width:26px;height:12px;">
        <img src="assets/images/icon/direction-down.png" alt="">
    </span>

</div>
`,
  styles:[`
  span{
      opacity:0.5;
  }
    .transformUpDown{
        transform:rotate(180deg);
        -ms-transform:rotate(180deg); 	/* IE 9 */
        -moz-transform:rotate(180deg); 	/* Firefox */
        -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
        -o-transform:rotate(180deg); 
    }
    .opacity{
        opacity:1;
    }

  `]
})
export class ZmBtnUpDown implements OnInit,OnDestroy {

  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();
  @Input() active:number;//0为上高亮，1为下高亮

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }

  btnUpDown_Click(num){
    this.active=num;
    this.zmbtnClick.emit(num);
  }

}
