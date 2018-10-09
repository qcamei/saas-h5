// @ 2018/3/1
// <zm-btn-Date [values]="['按钮','按钮']"></zm-btn-Date>
import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

@Component({
  selector:'zm-btn-Date',
  template: `

              <mat-button-toggle-group   [value]="itemActiveIndex" >
                  <mat-button-toggle   color="accent"  *ngFor="let item of values; let i = index" [value]="i"  (click)="btnDate_Click($event,i)">{{item}}</mat-button-toggle>
              </mat-button-toggle-group>

            `,
  styles:[` 
    
  `]
})
export class ZmBtnDate implements OnInit,OnDestroy {

  @Input() itemActiveIndex:number = 2;
  @Input() values = [];
  @Input() name: string;
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  btnDate_Click(e,index){
    this.itemActiveIndex = index;
    this.zmbtnClick.emit(index);
  }

}
