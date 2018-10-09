import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/3/8.
 * 列表复选框
 * <select_list_checkbox  [(zmValue)]="data.productList[i]" [(zmSelect)] = "isSlectedAll" (callback)="checkList()"></select_list_checkbox>
 */

@Component({
  selector:'select_list_checkbox',
  template: `
            <div class="disFlex align-center cur-hand  just-content"  (click)="cheed()">
              
                <span class="disFlex align-center" >
                 <span style="cursor: pointer;width: 16px;height: 16px;display: inline-block;"><img src="assets/images/icon/checkbox.png" alt="" *ngIf="cheStyle" style="display: inherit;"></span>
                  <span style="cursor: pointer;width: 16px;height: 16px;display: inline-block;margin-left: -16px;"><img src="assets/images/icon/checkboxNo.png" alt="" *ngIf="!cheStyle" style="display: inherit;"></span>
                </span>
              <ng-content select="content"></ng-content>
            </div>
            `,
  styles:[
    `
      .just-content{
        justify-content: center !important;
      }
     .c-input-checkbox{
       /*width: 1rem;*/
       /*height: 1rem;*/
       /*z-index: -1;*/
       /*opacity: 0;*/
       /*filter:alpha(opacity=0);!*IE*!*/
     }
     .disFlex{
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: -moz-box;
        display: flex;
     }
     .align-center {
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -moz-box-align: center;
        align-items: center;
     }
     .cur-hand{
      cursor: hand;
     }
     
    `]
})

export class SelectListCheckbox implements OnInit{

  @Output() callback = new EventEmitter();
  public cheStyle: boolean = false;

  private itemTmp:any;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue() {
    return this.itemTmp;
  }
  set zmValue(val) {
    this.itemTmp = val;
    this.zmValueChange.emit(this.itemTmp);
  }

  private zmSelectTmp:any;
  @Output() zmSelectChange = new EventEmitter();

  @Input()
  get zmSelect() {
    return this.zmSelectTmp;
  }
  set zmSelect(val) {
    this.zmSelectTmp = val;
    this.zmSelectChange.emit(this.zmSelectTmp);
  }

  ngOnInit(){
    if(this.itemTmp && this.itemTmp.checked){
      this.cheStyle = !this.cheStyle;
    }else{
      this.cheStyle = this.cheStyle;
    }
  }

  cheed():void{
    this.itemTmp.checked = !this.itemTmp.checked;
    this.cheStyle = !this.cheStyle;

    if(this.itemTmp.checked == false){
      this.zmSelectTmp = false;
      this.zmSelectChange.emit(this.zmSelectTmp);
    }

    this.zmValueChange.emit(this.itemTmp);

    this.callback.emit();

  }

}
