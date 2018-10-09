// @ 2018/3/1
// <zm_btn_new [name]="按钮" (zmbtnClick)="click()"></zm_btn_new>
import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

@Component({
  selector:'zm_btn_new',
  template: `
              <mat-chip-list>
                    <mat-chip class="mat-elevation-z3 "  style="cursor: pointer;" color="accent" selected="true" (click)="btnNew_Click()">{{name}}</mat-chip>
              </mat-chip-list>
            `,
})
export class ZmBtnNew implements OnInit,OnDestroy {

  @Input() name: string;
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  btnNew_Click(){
    this.zmbtnClick.emit();
  }

}
