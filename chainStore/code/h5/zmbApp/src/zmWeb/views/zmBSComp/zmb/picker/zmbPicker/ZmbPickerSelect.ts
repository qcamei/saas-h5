import {Picker, PickerController, PickerOptions} from "ionic-angular";
import {Component, EventEmitter, Output, Input} from "@angular/core";
import {PICKER_DEFAULT_DATA_LIST, PickerDataItem} from "./PickerData";
import {AppUtils} from "../../../../../comModule/AppUtils";

@Component({
  selector: 'zmb-picker-select',
  template: `
  `,
})

/**
 * 自定义Picker，参考AreasSelect改写而来
 */
export class ZmbPickerSelect {

  constructor(protected pickerCtrl: PickerController) {
  }

  private picker:Picker; //picker
  private pickerColumnCmps; // picker纵列数据实例
  private isOpen = false; //  是否被创建
  private pickerCmp; // picker 实例
  private value:PickerDataItem = new PickerDataItem(); // 选中后的数据

  @Input() pickerData:Array<PickerDataItem> = PICKER_DEFAULT_DATA_LIST;　// picker默认数据
  @Input() cancelText = '取消'; // 关闭按钮文本
  @Input() doneText = '确定'; // 完成按钮文本
  @Input() separator = ''; // 数据衔接模式
  @Input() level = 3; // 等级设置 最高为三级

  /**
   *  关闭时触发的事件
   *  没有值返回
   * @type {EventEmitter}
   */
  @Output() cancel: EventEmitter<any> = new EventEmitter(); // 关闭事件

  /**
   *  完成时触发的事件
   *  返回值为obj
   *  obj = {data: object,value: string} data为对应的省市区和编码
   * @type {EventEmitter}
   */
  @Output() done: EventEmitter<any> = new EventEmitter(); // 完成事件

  /**
   * 打开选择器
   * 基本思路
   * 1. 创建picker
   * 2. 先把数据处理成分开的数组
   * 3. 将数据以列的形式给到picker
   * 4. 设置数据显示样式（picker）
   * 5. 展示picker
   */
  public open() {
    if(this.isOpen){
      return; //避免重复open
    }

    let pickerOptions = this.buildPickerOptions();
    this.picker = this.pickerCtrl.create(pickerOptions); //创建
    this.addDataToPicker(); //添加数据
    this.setColumnsStyleToPicker(); //设置样式
    this.presentPicker(); //展示
    this.resetOpenFlag();
  }

  /**
   * 构建pickerOptions
   * @returns PickerOptions
   */
  private buildPickerOptions(){
    let pickerOptions = {
      buttons: [
        {
          text: this.cancelText,
          role: 'cancel',
          handler:() => {
            this.cancel.emit(null);
          }
        },
        {
          text: this.doneText,
          handler: (data) =>{
            this.onChange(data);
            this.done.emit(this.value); //格式: {"text":"其他","value":"1","columnIndex":0};
          }
        }
      ]
    };
    return pickerOptions;
  }

  /**
   * 对数据进行处理，并移交给picker
   */
  private addDataToPicker() {
    let column0 = {
      name: 'column0',
      options: this.pickerData.map(function (column0Data) {
        return {text: column0Data.text, value: column0Data.value, disabled: false};
      }),
      selectedIndex: 0
    };

    this.picker.addColumn(column0);
  }

  /**
   * 设置数据显示样式
   */
  private setColumnsStyleToPicker() {
    let pickerColumns = this.picker.getColumns(); // 获取列数据
    let columns = [];
    pickerColumns.forEach(function (col, i) {
      columns.push(0);
      col.options.forEach(function (opt) {
        if (opt && opt.text && opt.text.length > columns[i]) {
          columns[i] = opt.text.length;
        }
      });
    });
    if (columns.length === 2) {
      let width = Math.max(columns[0], columns[1]);
      pickerColumns[0].align = 'right';
      pickerColumns[1].align = 'left';
      pickerColumns[0].optionsWidth = pickerColumns[1].optionsWidth = width * 17 + "px";
    } else if (columns.length === 3) {
      let width = Math.max(columns[0], columns[2]);
      pickerColumns[0].align = 'right';
      pickerColumns[1].columnWidth = columns[1] * 33 + "px";
      pickerColumns[0].optionsWidth = pickerColumns[2].optionsWidth = width * 17 + "px";
      pickerColumns[2].align = 'left';
    }
  }

  /**
   * 展示
   */
  private presentPicker(){
    this.picker.present().then(() => {
      this.pickerCmp = this.picker.instance;
      this.pickerColumnCmps = this.pickerCmp._cols.toArray();
      this.pickerColumnCmps.forEach(function (col) {
        return col.lastIndex = -1;
      });
    });
  }

  /**
   * 重置open标识
   */
  private resetOpenFlag(){
    let _self = this;
    _self.isOpen = true;
    _self.picker.onDidDismiss(function () {
      _self.isOpen = false;
    });
  }


  /**
   *  设置value
   * @param newData
   */
  private setValue(newData) {
    if (!AppUtils.isNullObj(newData)) {
      this.value = newData;
    }
  }

  /**
   *  获取value值
   * @returns {string}
   */
  private getValue() {
    return this.value;
  }

  /**
   *  改变value值的显示
   * @param val
   */
  private onChange(val) {
    this.setValue(this.getSelectedData(val));
  }

  /**
   *  获取当前选择的数据, 可对数据格式进一步处理
   * @param selectedDataTmp
   * @returns
   */
  private getSelectedData(selectedDataTmp):PickerDataItem {
    //{"column0":{"text":"其他","value":"1","columnIndex":0}}
    let selectedData = PickerDataItem.newInstance(selectedDataTmp.column0.value, selectedDataTmp.column0.text);
    return selectedData;
  }
}
