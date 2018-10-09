import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/3/8.
 * 必填文本输入框
 * <zm-input-checkbox   [(zmValue)]="viewData.zmtChecked" ><content class="cur-hand">我已同意</content></zm-input-checkbox>
 */

@Component({
  selector:'zm-input-checkbox',
  template: `
            <!--<div (click)="cheed()" class="disFlex align-center">-->
                <!--<span class="c-child-checkbox disFlex cur-hand align-center" >-->
                <!--<span style="width: 16px;height: 16px;display: inline-block;"><img src="assets/images/icon/checkbox.png" alt="" *ngIf="cheStyle" style="display: inherit;"></span>-->
                  <!--<span style="width: 16px;height: 16px;display: inline-block;margin-left: -16px;"><img src="assets/images/icon/checkboxNo.png" alt="" *ngIf="!cheStyle" style="display: inherit;"></span>-->
                <!--</span>-->
                <!--<span class="mg-l-10 cur-hand" >{{lable}}</span>-->
                <!--<ng-content select="content"></ng-content>-->
            <!--</div>-->
            
              <mat-checkbox [(ngModel)]="zmValue"  (change) = "change()"><span class="mat-body-1" style="color:#ffffff;">{{lable}}</span></mat-checkbox>
            `
})

export class ZmInputCheckbox implements OnInit{

  @Input() lable:string;

  private valueTmp:any;
  @Output() zmValueChange = new EventEmitter();

  @Output() onChange = new EventEmitter();


  @Input()
  get zmValue() {
    return this.valueTmp;
  }
  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }

  change():void{

    this.onChange.emit(null);
  }


  ngOnInit(): void {
    // if (this.valueTmp) {
    //   this.cheStyle = !this.cheStyle;
    // } else {
    //   this.cheStyle = this.cheStyle;
    // }
  }

}
