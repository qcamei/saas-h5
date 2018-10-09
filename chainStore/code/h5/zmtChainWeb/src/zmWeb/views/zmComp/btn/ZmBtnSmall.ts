// @ 2018/3/2
// <zm_btn_small [name]="按钮" (zmbtnClick)="click()"></zm_btn_small>

import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

@Component({
  selector:'zm_btn_small',
  template: `
              <!--<button type="button"  class="btn btn-primary btn-sm px-3 cur-hand" (click)="btnSmall_Click()">{{name}}</button>-->
              <mat-chip-list>
                    <mat-chip class="mat-elevation-z3 " style="cursor: pointer;" color="accent" selected="true" (click)="btnSmall_Click()">{{name}}</mat-chip>
              </mat-chip-list>
`,
  styles:[`
  `]
})
export class ZmBtnSmall implements OnInit,OnDestroy {

  @Input() name: string; //按钮名称
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  btnSmall_Click(){
    this.zmbtnClick.emit();
  }

}
