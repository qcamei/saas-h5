import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/2/23.
  <zm-btn-large name="大按钮" (zmbtnClick)="click()"></zm-btn-large>
 */


@Component({
  selector:'zm-btn-large',
  template: `
        <!--<button type="button" class="btn-large" (click)="btnLarge_Click()"  >{{name}}</button>-->
        <button *ngIf="stroked"  mat-stroked-button color="accent" class="btn-large" [disabled]="disabled" (click)="btnLarge_Click()">{{name}}</button>
        <button *ngIf="!stroked" mat-raised-button color="accent" class="btn-large" [disabled]="disabled" (click)="btnLarge_Click()">{{name}}</button>
`,
  styles:[`
    .btn-large{ 
      width: 300px;
      border-radius:6px;
      padding:0.75rem 0.35rem;
      cursor: pointer;
      outline: none;
    }
  `]
})
export class ZmBtnLarge implements OnInit,OnDestroy {

  @Input() name: string;
  @Input() stroked: boolean=false;
  @Input() disabled: boolean;
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
