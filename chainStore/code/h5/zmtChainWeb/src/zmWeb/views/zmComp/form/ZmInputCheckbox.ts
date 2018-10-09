import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/3/8.
 * 必填文本输入框
 * <zm-input-checkbox   [(zmValue)]="viewData.zmtChecked" ><content class="cur-hand">我已同意</content></zm-input-checkbox>
 */

@Component({
  selector:'zm-input-checkbox',
  template: `
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
