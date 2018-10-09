import {Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * 下拉选择select组件
 * eg: <zm_select_type [label]="'类型'" [selectList]="selectList" (selectCallback)="changeOption($event)"></zm_select_type>
 */
@Component({
  selector: "zm_select_type",
  template: `
          <div class="form-group row mb-0 ">
          <label class="col-md-3 col-form-label text-center px-0"><span class="text-danger">*</span>{{label}}</label>
          <div class="col-md-8 px-0" >
            <select class="form-control cur-hand" (ngModelChange)="selectOption($event)"
                  [(ngModel)]="zmValue" [ngClass]="{'is-invalid':select.invalid && (select.touched)}"
                  required name="select" #select="ngModel">
            <option *ngFor="let item of selectList" [value]="item.id">{{item.name}}</option>
          </select>
          </div>

        </div>
        <div class="row" style="height:30px;font-size:14px;">
            <div class="col-md-2"></div>
            <div class="col-md-10 text-danger">
              <div  *ngIf="select.invalid && (select.touched)">
                <div *ngIf="select.errors.required">
                  {{label}}不能为空
                </div>
              </div>
            </div>
        </div>

  `,
  styles: [`
  select.form-control:not([size]):not([multiple]) {
    height: auto !important;
}
  .form-control{
    border: 1px solid #ced4da !important;

  }
  `]
})
export class ZmSelectType {

  @Input() label: string;
  @Input() selectList: Array<any>;
  @Output() zmValueChange: EventEmitter<any> = new EventEmitter<any>();

  private valueTmp: string;
  /**
   * zmValue 双向绑定
   */

  @Input()
  get zmValue() {
    return this.valueTmp;
  }

  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }


  /**
   * 选择事件
   * @param valueP
   */
  selectOption(valueP) {
    let curValueTmp:any;
    for (let item of this.selectList) {
      if (item.id == valueP) {
        curValueTmp = item;
        break;
      }
    }
    this.zmValueChange.emit(curValueTmp.id);
  }
}
