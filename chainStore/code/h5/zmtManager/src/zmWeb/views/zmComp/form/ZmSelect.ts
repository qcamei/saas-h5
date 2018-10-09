import {OnInit, OnDestroy, Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * 下拉选择select组件
 * eg: <zm_select [label]="'类型'" [selectList]="selectList" (selectCallback)="changeOption($event)"></zm_select>
 */
@Component({
  selector: "zm_select",
  template: `
          <div class="form-group row mb-0 ">
          <label class="col-md-2 col-form-label text-center px-0"><span class="text-danger">*</span>{{label}}</label>
          <div class="col-md-10">
            <select class="form-control cur-hand" (ngModelChange)="selectOption($event)"
                  [(ngModel)]="zmValue" [ngClass]="{'is-invalid':select.invalid && (select.touched)}"
                  required name="select" #select="ngModel">
            <option *ngIf="!noAll" [value]="allSelect.value">{{allSelect.name}}</option>
            <option *ngFor="let item of selectList" [value]="item.value">{{item.name}}</option>
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
export class ZmSelect implements OnInit,OnDestroy {

  @Input() label: string;
  @Input() noAll: boolean;
  @Input() selectList: Array<SelectItem>;
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

  public allSelect: SelectItem = new SelectItem("全部", -1);
  public optionValue: number = this.allSelect.value;

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  /**
   * 选择事件
   * @param valueP
   */
  selectOption(valueP) {
    let curValueTmp: SelectItem;
    if (valueP == this.allSelect.value) {
      curValueTmp = this.allSelect;
    } else {
      for (var i = 0; i < this.selectList.length; i++) {
        let item = this.selectList[i];
        if (item.value == valueP) {
          curValueTmp = item;
          break;
        }
      }
    }
    this.zmValueChange.emit(curValueTmp.value);
  }

}

export class SelectItem {
  public name: string;
  public value: number;

  constructor(nameP: string, valueP: number) {
    this.name = nameP;
    this.value = valueP;
  }
}

