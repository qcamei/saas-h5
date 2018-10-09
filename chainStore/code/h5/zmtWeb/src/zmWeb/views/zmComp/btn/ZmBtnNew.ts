// @ 2018/3/1
// <zm-btn-new [name]="按钮" (zmbtnClick)="click()"></zm-btn-new>
import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

@Component({
  selector:'zm-btn-new',
  template: `
              <mat-chip-list>
                    <mat-chip class="px-20"  style="cursor: pointer;" color="accent" selected="true" (click)="btnNew_Click()">{{name}}</mat-chip>
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
