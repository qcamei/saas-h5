import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/3/20
 <zm_btn_md  [stroked] = "true"(zmbtnClick)="closeModal()" name="取消"></zm_btn_md>
 */

@Component({
  selector:'zm_btn_md',
  template: `
        <button *ngIf="!stroked" mat-raised-button color="accent" class="btn-md" [disabled]="disabled" (click)="btnMd_Click()">{{name}}</button>
        <button *ngIf="stroked"  mat-stroked-button color="accent" class="btn-md" [disabled]="disabled" (click)="btnMd_Click()">{{name}}</button>
`,
  styles:[`
    .btn-md{
      width: 150px;
      border-radius:6px;
      padding:0.75rem 0.35rem;
      cursor: pointer;
      outline: none;
    }
  `]
})
export class ZmBtnMd implements OnInit,OnDestroy {

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
