
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector:'zmb-password-item',
  template: `
      <div  fxLayout="row" fxLayoutAlign="space-between center"  style="border-bottom:1px solid #ccc;padding:12px 16px">
        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px"  style="width:93%;">
          <span style="color:gray;">{{label}}</span>
          <ion-input [type]="zmInputType" [maxlength]="maxLength" [placeholder]="placeHolder" [(ngModel)]="zmValue" no-margin></ion-input>
        </div>
        <span style="font-size:20px;"> 
          <ion-icon [ios]="zmIconType" style="color:gray" *ngIf="isShowIcon" (click)="itemIocnClick()"></ion-icon>
        </span>
      </div>
              
              `,
  styles:[`

`]
})

export class ZmbPasswordItem implements OnInit,OnDestroy {

  zmInputType:string = "password";
  zmIconType:string = "ios-eye-off";

  @Input() label: string = "";
  @Input() maxLength: number = 16;
  @Input() placeHolder:string = "";
  @Input() isShowIcon: boolean = true;

  @Output() onItemIocnClick:EventEmitter<any> = new EventEmitter();

  /**
   * zmValue 双向绑定
   */
  private zmValueTmp: string = "";
  @Output() zmValueChange = new EventEmitter();
  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }
  set zmValue(val) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValue);
  }

  constructor(){
  }

  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }

  itemIocnClick(){
    this.changeInputType();
    this.changeIocnType();
    this.onItemIocnClick.emit();
  }

  changeInputType(){
    if(this.zmInputType == "password"){
      this.zmInputType = "text";
    }else if (this.zmInputType == "text"){
      this.zmInputType = "password";
    }
  }

  changeIocnType(){
    if(this.zmIconType == "ios-eye-off"){
      this.zmIconType = "ios-eye";
    }else if (this.zmIconType == "ios-eye"){
      this.zmIconType = "ios-eye-off";
    }
  }

}
