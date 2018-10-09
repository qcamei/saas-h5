import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/3/20
 <zm_btn  [stroked] = "true"(click)="closeModal()" name="取消"></zm_btn>
 */

@Component({
  selector:'zm_btn',
  template: `
        <button *ngIf="!stroked" mat-raised-button color="accent"  [disabled]="disabled" (click)="btnMd_Click()">{{name}}</button>
        <button *ngIf="stroked"  mat-stroked-button color="accent" [disabled]="disabled" (click)="btnMd_Click()">{{name}}</button>
`,
  styles:[`

  `]
})
export class ZmBtn implements OnInit,OnDestroy {

  @Input() stroked:boolean = false;
  @Input() disabled:boolean = false;
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
