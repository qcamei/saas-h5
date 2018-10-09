import {Output, Component, EventEmitter, Input} from "@angular/core";

/**
 * 单选框公共组件
 * eg:
 * <zm-input-radio [radioList]="radioList" [(curValue)]="curValue"></zm-input-radio>
 */
@Component({
  selector:'zm_input_radio',
  template: `
             <div *ngIf="radioList&&curValue">
                 <div *ngFor="let item of radioList;" (click)="select(item)" style="display: inline-block;" [ngStyle]="{'margin-bottom':radioList.length>2?'15px':'0'}" >
                    <label class="c-radio cur-hand" style="padding-top: 0;margin-bottom: 0;" >
                        <input type="radio"  class="cus-radio" name="state" [value]="item"  [(ngModel)]="curValue">
                        <span class="radio-b" [ngClass]="{'text-radio':item.value == curValue.value}"></span>
                        <span class="mg-l-10">{{item.name}}</span>
                    </label>
                 </div>
             </div>
            `,
  styleUrls:['./input.scss']
})
export class ZmInputRadio{

  @Input() radioList:Array<RadioItem>;
  @Output() curValueChange = new EventEmitter();

  private valueTmp:RadioItem;
  constructor(){}

  @Input()
  get curValue() {
    return this.valueTmp;
  }

  set curValue(val) {
    this.valueTmp = val;
    this.curValueChange.emit(this.valueTmp);
  }

  select(item:RadioItem){
    this.curValue = item;
  }

}

export class RadioItem{
  name:string;
  value:number;
  constructor(nameP:string,valueP:number){
    this.name = nameP;
    this.value = valueP;
  }
}


