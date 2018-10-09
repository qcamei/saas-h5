import {Output, Component, EventEmitter, Input} from "@angular/core";

/**
 * 有效期单选框公共组件
 * eg:
 * <zm-input-radio [(curValue)]="curValue"></zm-input-radio>
 */
@Component({
  selector:'zm-validPeriod-radio',
  template: `
            <div class="disFlex align-center">
               <label class="mg-b-0">
                  <input type="radio"  required class="cus-radio cur-hand" name="Radio" [(ngModel)]="curValue.type" [value] = "0" (change)="changeType()">                
                  <span class="radio-b cur-hand" [ngClass]="{'text-radio':curValue.type==0 }"></span>
                  <span class="mg-l-10 cur-hand">永久</span>
               </label>
               <label class="mg-b-0" style="padding-right: 0;padding-left: 10px;" >
                  <input type="radio"  required class="cus-radio cur-hand" name="Radio" (change)="changeType()" [(ngModel)]="curValue.type" [value] = "1">
                  <span class="radio-b cur-hand" [ngClass]="{'text-radio':curValue.type==1 }"></span>
                  <span class="mg-l-10" style="opacity: 0;">1</span>
               </label>
               <div class="disFlex">
                 <input type="number"oninput="if(value>999 || value<1){value=null}" placeholder="请输入有效期" class="c-input"  [disabled]="curValue.type==0" [ngClass]="{'input':curValue.type==0}" [(ngModel)]="curValue.value" [ngModelOptions]="{standalone: true}" (change)="changeData()">
                 <select class="c-form-select cur-hand"  [disabled]="curValue.type==0" [ngClass]="{'input':curValue.type==0}" [(ngModel)]="curValue.unit" [ngModelOptions]="{standalone: true}" (change)="changeData()">
                      <option [value]="1">天</option>
                      <option [value]="2">月</option>
                      <option [value]="3">年</option>
                 </select>
               </div>
            </div>
            `,
  styles:[`
   .disFlex {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: -moz-box;
      display: flex;
    }
    .flex {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      -webkit-flex: 1;
         -moz-box-flex: 1;
              flex: 1;
    }
    .align-center {
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      align-items: center;
    }
    
    .hor-center {
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      -moz-box-pack: center;
      justify-content: center;
    }
    .mg-b-0{
      margin-bottom:0;
    }
    .mg-l-10{
      margin-left:10px;
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    .cus-radio{
      opacity: 0;
      filter:alpha(opacity=0);
      z-index: -1;
    }
    .radio-b{
      width: 12px;
      height: 12px;
      display: inline-block;
      background-color: #DDDDDD;
      border-radius: 50%;
      position: relative;
    }
    .radio-b:after{
      content: "";
      width: 6px;
      height: 6px;
      position: absolute;
      left:3px;
      top:3px;
      background-color: #fff;
      border-radius: 50%;
      z-index: 2;
    }
    .radio-b:before{
      content: "";
      width: 20px;
      height: 20px;
      position: absolute;
      left:-4px;
      top: -4px;
      border: 2px solid #DDDDDD;
      border-radius: 50%;
      z-index: 1;
    }
    .c-input{
      display: block;
      padding:0.35rem 0.735rem;
      width: 200px;
      height: 40px;
      font-size: 14px;
      color: #495057;
      background-color: #fff;
      background-image: none;
      background-clip: padding-box;
      border: 2px solid #ced4da;
      border-radius: 0.25rem;
      outline: none;
    }
    .text-radio{
      background-color:#03a9f4;
      position: relative;
    }
    .text-radio:after{
      content: "";
      width: 6px;
      height: 6px;
      position: absolute;
      left:3px;
      top:3px;
      background-color: #fff;
      border-radius: 50%;
      z-index: 2;
    }
    .text-radio:before{
      content: "";
      width: 20px;
      height: 20px;
      position: absolute;
      left:-4px;
      top: -4px;
      border: 2px solid#03a9f4;
      border-radius: 50%;
      z-index: 1;
    }
  .c-form-select {
    font-size: 14px;
    margin-top: 5px;
    height: 30px !important;
    width: 49px;
    outline: none;
    margin-left: -52px;
    border: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    -ms-appearance: none;
    background: url(assets/images/arrow.png) no-repeat 93% 50%;
  }

  `]
})
export class zmValidPeriodRadio{

  @Output() curValueChange = new EventEmitter();
  @Output() callback = new EventEmitter();
  private valueTmp:ValidPerioItem;
  constructor(){}

  @Input()
  get curValue() {
    return this.valueTmp;
  }
  set curValue(val) {
    this.valueTmp = val;
    this.curValueChange.emit(this.valueTmp);
  }

  changeData(){
    this.callback.emit(this.valueTmp);
  }

  changeType(){
    if(this.curValue.type == 0){
      this.curValue.value = null;
      this.curValue.unit = 0;
    }else{
      this.curValue.value = null;
      this.curValue.unit = 1;
    }
    this.changeData();
  }
}

export class ValidPerioItem{
  type:number;//类型 0 永久
  value:number;//值
  unit:number;//单位
  constructor(typeP:number,valueP:number,unitP:number){
    this.type = typeP;
    this.value = valueP;
    this.unit = unitP;
  }
}


