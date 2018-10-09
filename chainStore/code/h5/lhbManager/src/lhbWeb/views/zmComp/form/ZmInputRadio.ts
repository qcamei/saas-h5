import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";

/**
 * 单选框公共组件
 * eg:
 * <zm_input_radio [label]="'性别'" [radioList]="radioList" [(curValue)]="curValue"></zm_input_radio>
 */
@Component({
  selector:'zm_input_radio',
  template: `
             <div class="demo-radio c-input-group mg-b-40" style="height: 50px;">
                 <label class="c-label font-bold" style="margin-left: -15px;">{{label}}</label>
                 <div *ngFor="let item of radioList">
                    <label class="custom-control  custom-radio" style="padding-top: 0;padding-bottom: 0;">
                        <input type="radio"  class="custom-control-input" name="state" [value]="item" [(ngModel)]="curValue">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">{{item.name}}</span>
                    </label>
                 </div>
             </div>
            `
})
export class ZmInputRadio implements OnInit,OnDestroy,OnChanges {

  @Input() label:string;
  @Input() radioList:Array<RadioItem>;
  // @Input() curValue:RadioItem;
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

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }

  /**
   * 监听输入值的变化
   * @param changes
   */
  ngOnChanges(changes){
    // this.curValue = changes.curValue.currentValue;
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
