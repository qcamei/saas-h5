import {OnInit, OnDestroy, Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * 下拉选择select组件
 * eg:  <zm_select [label]="'状态'" [selectList]="[{name:'上架',value:0},{name:'下架',value:1}]" [(zmValue)]="viewData.status" (change)="queryList()"></zm_select>
 */
@Component({
  selector:"zm_select_small",
  template:`
      <div class="form-group form-inline">
      <label class="font-weight-bold col-form-label col-form-label-sm  mr-2">{{label}}</label>
      <select class="form-control form-control-sm set-bg  cur-hand"  [(ngModel)]="zmValue" (ngModelChange)="selectOption($event)">
        <option *ngIf="!noAll" [value]="allSelect.value">{{allSelect.name}}</option>
        <option *ngFor="let item of selectList" [value]="item[this.value]">{{item[this.name]}}</option>
      </select>
      </div>
  `,
  styles:[`
  //   .mg-b-0{
  //     margin-bottom:0;
  //   } 
  //   .fz-14{
  //     font-size: 14px;
  //   } 
  //   .font-bold{
  //     font-weight: bold;
  //   }
  //   .set-bg{
  //     background-color:#F4F6FA !important;
  //   }
  //   .c-hued{
  //     width: 100px;
  //   }
  //   .c-eight{
  //     width:80px;
  //   }
    
  //   .cur-hand{
  //     cursor: pointer;
  //   }
  //   :host {
  //     display: flex;
  //     flex-direction: row;
  //     align-items: center;
  //   }
  //   .form-control {
  //   padding: 0 10px;
  //   height: 30px !important;
  //   width: auto;
  //   display: inline-block;
  //   margin-left: 10px;
  // }
  // .form-select{
  //   border-width: 1px !important;
  // }
  // select.form-control:not([size]):not([multiple]){
  //   -moz-appearance: none;
  //   -webkit-appearance: none;
  //   background-image:url(./assets/images/arrow.png);
  //   background-repeat: no-repeat;
  //   background-position:95% 50%;
  //   font-size: 14px;
  //   padding-right: 25px;
  // }
  // select.c-form-select:not([size]):not([multiple]){
  //   -moz-appearance: none;
  //   -webkit-appearance: none;
  //   background-image:url(./assets/images/arrow.png);
  //   background-repeat: no-repeat;
  //   background-position:95% 50%;
  //   font-size: 14px;
  //   padding-right: 25px;
  // }
  // select::-ms-expand { display: none; }
  // input[type=number] {
  //   -moz-appearance: textfield;
  // }
  
  `]
})
export class ZmSelectSmall implements OnInit{

  //方式1 只输入字符串 这个方法输入的值会覆盖方法2 格式 name1:value1,name2:value2,
  @Input() nameValues: string;

  //方式2 输入item列表
  @Input() selectList: Array<any>;

  @Input() name: string = "name";
  @Input() value: string = "value";

  @Input() noAll: boolean = false;
  @Input() label: string;
  @Output() zmValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectCallback: EventEmitter<any> = new EventEmitter<any>();

  /**
   * zmValue 双向绑定
   */

  private valueTmp: string;

  @Input()
  get zmValue() {
    return this.valueTmp;
  }

  set zmValue(val: string) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);

  }

  public allSelect: SelectItem = new SelectItem("全部", "-1");

  ngOnInit(): void {
    if (this.nameValues) {
      this.selectList = new Array<SelectItem>();
      this.nameValues.split(",").forEach((item) => {

        let pair = item.split(":");
        let nameTmp = pair[0];
        let valueTmp = pair[1];
        let sItemTmp = new SelectItem(nameTmp, String(valueTmp));
        this.selectList.push(sItemTmp);
      })
    }

  }


  /**
   * 选择事件
   * @param valueP
   */
  selectOption(event:any) {
    this.selectCallback.emit(event);
  }

}

export class SelectItem {
  public name: string;
  public value: string;

  constructor(nameP: string, valueP: string) {
    this.name = nameP;
    this.value = valueP;
  }
}
